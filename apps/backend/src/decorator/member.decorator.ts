import {
  CanActivate,
  createParamDecorator,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MemberGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(ctx: ExecutionContext) {
    const request = ctx.switchToHttp().getRequest<FastifyRequest>();
    const trace = request.query['trace-id'];
    const sessionId: string = request.session.get('id');

    Logger.log(`Attempting to find session with the id of ${sessionId}`, trace);
    const response = await this.prisma.session.findFirst({
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
    request.member = response.member;

    return true;
  }
}

export const Member = createParamDecorator(
  async (_: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<FastifyRequest>();
    return request.member;
  },
);
