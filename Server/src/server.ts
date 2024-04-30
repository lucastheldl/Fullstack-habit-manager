import fastify from "fastify";
import cors from "@fastify/cors";
import { habitsRoutes } from "./routes/habits";
import { authRoutes } from "./routes/auth";

const app = fastify();

app.register(cors);
app.register(habitsRoutes);
app.register(authRoutes);

app
  .listen({
    port: 3333,
    host: "0.0.0.0",
  })
  .then(() => {
    console.log("HTTP server running");
  });
