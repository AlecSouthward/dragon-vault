import "dotenv/config";

import Fastify from "fastify";
import jwt from "@fastify/jwt";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";

import preHandlers from "./routes/preHandlers.js";
import pingRoutes from "./routes/ping.js";
import userRoutes from "./routes/user.js";
import campaignRoutes from "./routes/campaign.js";
import characterRoutes from "./routes/character.js";

import { testDatabaseConnection } from "./database.js";

const basePrefixPath = "/api";
const fastify = Fastify({ logger: true });

await fastify.register(cors, {
  origin: process.env.CORS_ORIGIN,
  methods: ["GET", "POST", "PUT", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
});

await fastify.register(jwt, { secret: process.env.JWT_TOKEN });
await fastify.register(cookie, { secret: process.env.COOKIE_TOKEN });
await fastify.register(preHandlers);

await fastify.register(pingRoutes, { prefix: `${basePrefixPath}/` });
await fastify.register(userRoutes, { prefix: `${basePrefixPath}/user` });
await fastify.register(campaignRoutes, {
  prefix: `${basePrefixPath}/campaign`,
});
await fastify.register(characterRoutes, {
  prefix: `${basePrefixPath}/character`,
});

const start = async () => {
  try {
    await testDatabaseConnection();
    await fastify.listen({ port: 8080, host: "0.0.0.0" });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
