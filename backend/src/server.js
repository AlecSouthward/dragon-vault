import Fastify from "fastify";
import cors from '@fastify/cors';

import userRoutes from "./routes/user.js";
// import { connectDB } from "./db.js";
// import { redis } from "./cache.js";
import dotenv from "dotenv";

dotenv.config();

const fastify = Fastify({ logger: true });

await fastify.register(cors, { origin: "*" });
await fastify.register(userRoutes, { prefix: "/user" });

const start = async () => {
  try {
    // await connectDB();
    // await redis.ping();
    await fastify.listen({ port: process.env.PORT || 8080, host: "0.0.0.0" });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
