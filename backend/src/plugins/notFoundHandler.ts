import { type FastifyReply } from 'fastify/types/reply';
import { type FastifyRequest } from 'fastify/types/request';

const notFoundHandler = async (req: FastifyRequest, res: FastifyReply) => {
  res.notFound(`No route found for ${req.url}.`);
};

export default notFoundHandler;
