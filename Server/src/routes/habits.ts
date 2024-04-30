import { FastifyInstance } from "fastify";
import dayjs from "dayjs";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function habitsRoutes(app: FastifyInstance) {
  app.post("/:id/habits", async (request) => {
    const createHabitBody = z.object({
      title: z.string(),
      weekDays: z.array(z.number().min(0).max(6)),
    });
    const requestParamsValidation = z.object({
      id: z.string(),
    });
    const { title, weekDays } = createHabitBody.parse(request.body);
    const { id } = requestParamsValidation.parse(request.params);

    const today = dayjs().startOf("day").toDate();

    await prisma.habit.create({
      data: {
        title,
        created_at: today,
        user_id: id,
        WeekDays: {
          create: weekDays.map((weekDay) => {
            return {
              week_day: weekDay,
            };
          }),
        },
      },
    });
  });
  app.get("/day", async (request) => {
    const getDayParams = z.object({
      date: z.coerce.date(),
    });

    //pega o dia enviado pela request
    const { date } = getDayParams.parse(request.query);

    const parsedDate = dayjs(date).startOf("day");
    const weekDay = parsedDate.get("day");

    //todos os habitos possiveis e os que foram completados
    //pega todos os habitos que foram criados ate certa data e que possam ser feitos em alguns dias da semana
    const possibleHabits = await prisma.habit.findMany({
      where: {
        created_at: {
          //tem que ter sido criado antes da data
          lte: date,
        },
        //estar relacionado com esse dia especifico
        WeekDays: {
          some: {
            week_day: weekDay,
          },
        },
      },
    });
    //encontra os dias em que alguns habito estiver completo baseado na data enviada
    const day = await prisma.day.findUnique({
      where: {
        date: parsedDate.toDate(),
      },
      include: {
        dayHabits: true,
      },
    });
    //mapeia esse dia para encontrar os habitos concluidos e retorna o id deles
    const completedHabits =
      day?.dayHabits.map((dayHabit) => {
        return dayHabit.habit_id;
      }) ?? [];
    return {
      possibleHabits,
      completedHabits,
      day,
    };
  });
  //completas e nao completar um habito
  app.patch("/:userId/habits/:id/toggle", async (request) => {
    const toggleHabitParams = z.object({
      id: z.string().uuid(),
      userId: z.string().uuid(),
    });

    const { id, userId } = toggleHabitParams.parse(request.params);

    const today = dayjs().startOf("day").toDate();

    let day = await prisma.day.findUnique({
      where: {
        date: today,
      },
    });
    if (!day) {
      day = await prisma.day.create({
        data: {
          date: today,
          user_id: userId,
        },
      });
    }

    let dayHabit = await prisma.dayHabit.findUnique({
      where: {
        day_id_habit_id: {
          day_id: day.id,
          habit_id: id,
        },
      },
    });

    if (dayHabit) {
      //remover a marcação
      await prisma.dayHabit.delete({
        where: {
          id: dayHabit.id,
        },
      });
    } else {
      //completar o habito
      await prisma.dayHabit.create({
        data: {
          day_id: day.id,
          habit_id: id,
        },
      });
    }
  });
  app.get("/summary", async () => {
    const summary = await prisma.$queryRaw`

    SELECT
     D.id,
     D.date,
     (
      SELECT 
        cast(count(*) as float)
      FROM day_habits DH
          WHERE DH.day_id = D.id
     ) as completed,
     (
      SELECT 
        cast(count(*) as float)
        FROM habit_week_days HWD
        JOIN habits H
          ON H.id = HWD.habit_id
        WHERE 
          HWD.week_day = cast(strftime('%w',D.date/1000.0,'unixepoch') as int)
          AND H.created_at <= D.date
     )as amount
    FROM days D
    `;
    return summary;
  });
}
