import "dotenv/config";

import Fastify from "fastify";
import jwt from "fastify-jwt";
import cors from "@fastify/cors";

import authentication from "./routes/authentication.js";
import pingRoutes from "./routes/ping.js";
import userRoutes from "./routes/user.js";

import { connectDB } from "./db.js";

const fastify = Fastify({ logger: true });

await fastify.register(cors, { origin: "*" });
await fastify.register(jwt, { secret: process.env.JWT_TOKEN });
await fastify.register(authentication);

await fastify.register(pingRoutes, { prefix: "/" });
await fastify.register(userRoutes, { prefix: "/user" });

const start = async () => {
  try {
    await connectDB();
    await fastify.listen({ port: 8080, host: "0.0.0.0" });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
