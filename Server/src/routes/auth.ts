import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import dayjs from "dayjs";
import { compare, hash } from "bcryptjs";

export async function authRoutes(app: FastifyInstance) {
  app.post(
    "/register",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const bodySchema = z.object({
        email: z.string().email(),
        password: z.string().min(6),
        username: z.string().min(3),
      });

      const { email, password, username } = bodySchema.parse(request.body);
      const today = dayjs().startOf("day").toDate();

      try {
        let user = await prisma.user.findUnique({
          where: {
            email: email,
          },
        });
        if (!user) {
          const password_hash = await hash(password, 5);

          user = await prisma.user.create({
            data: {
              email,
              password: password_hash,
              username,
            },
          });
          //Create a new day on the db as the user first day
          await prisma.day.create({
            data: {
              date: today,
              user_id: user.id,
            },
          });
          console.log(user.id);
        }
        //sign token
        const token = await reply.jwtSign(
          { name: user.username },
          { sign: { sub: user.id, expiresIn: "30 days" } }
        );
        return reply.status(200).send({ token });
      } catch (error) {
        console.log(error);
        throw error;
      }
    }
  );

  app.post("/login", async (request: FastifyRequest, reply: FastifyReply) => {
    const bodySchema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    });

    const { email, password } = bodySchema.parse(request.body);

    try {
      const user = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });
      if (!user) {
        return reply.status(404).send();
      }
      const doesPasswordMatches = await compare(password, user.password);
      if (!doesPasswordMatches) {
        return reply.status(500).send();
      }
      //Fazer o JWT
      const token = await reply.jwtSign(
        { name: user.username },
        { sign: { sub: user.id, expiresIn: "30 days" } }
      );
      return reply.status(200).send({ token });
    } catch (error) {
      throw error;
    }
  });
}
