import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

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

      try {
        const user = await prisma.user.findUnique({
          where: {
            email: email,
          },
        });
        if (!user) {
          const createdUser = await prisma.user.create({
            data: {
              email,
              password,
              username,
            },
          });
          console.log(createdUser.id);
        }
      } catch (error) {
        throw error;
      }
      return reply.status(200).send();
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
      //Fazer o JWT
    } catch (error) {
      throw error;
    }
    return reply.status(200).send();
  });
}
