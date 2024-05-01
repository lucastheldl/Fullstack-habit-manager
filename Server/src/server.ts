import fastify from "fastify";
import cors from "@fastify/cors";
import { habitsRoutes } from "./routes/habits";
import { authRoutes } from "./routes/auth";
import jwt from "@fastify/jwt";

const app = fastify();

app.register(cors);
app.register(habitsRoutes);
app.register(authRoutes);
app.register(jwt, {
  secret: "habits",
});

app
  .listen({
    port: 3333,
    host: "0.0.0.0",
  })
  .then(() => {
    console.log("HTTP server running");
  });
