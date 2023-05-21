import {
  createParamDecorator,
  ExecutionContext,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { PrismaService } from '../prisma/prisma.service';

export const Member = createParamDecorator(
  async (_: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<FastifyRequest>();
    const trace = request.query['trace-id'];
    const sessionId: string = request.session.get('id');
    const prisma = new PrismaService();

    Logger.log(`Attempting to find session with the id of ${sessionId}`, trace);
    const response = await prisma.session.findFirst({
      where: {
        id: sessionId ?? '',
      },
      select: {
        id: true,
        member: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            updatedAt: true,
            organizations: true,
          },
        },
      },
    });

    if (!response) {
      Logger.error(`Session not found / is invalid. throwing error`, trace);
      throw new UnauthorizedException('Session not found, please login.');
    }

    Logger.log(
      `Successfully found member with session id of ${sessionId}`,
      trace,
    );
    Logger.debug(response?.member, trace);
    return response?.member;
  },
);
