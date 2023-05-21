import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginMemberDto } from '../member/member.dto';
import { PrismaService } from '../prisma/prisma.service';
import { verify } from 'argon2';
import { ResponseService } from '../response/response.service';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class SessionService {
  selector: {
    id: boolean;
    name: boolean;
    email: boolean;
    createdAt: boolean;
    updatedAt: boolean;
    organizations: boolean;
  };

  constructor(
    private prisma: PrismaService,
    private formatter: ResponseService,
    private schedulerRegistry: SchedulerRegistry,
  ) {
    this.selector = {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
      organizations: true,
    };
  }

  async getMember(sessionId: string, trace: string) {
    Logger.log(`Attempting to find session with the id of ${sessionId}`, trace);
    const response = await this.prisma.session.findFirst({
      where: {
        id: sessionId ?? '',
      },
      select: {
        id: true,
        member: {
          select: this.selector,
        },
      },
    });

    Logger.log(
      `Successfully found member with session id of ${sessionId}`,
      trace,
    );
    Logger.debug(response?.member, trace);
    return response?.member;
  }

  ifNullThrow(
    condition: boolean,
    trace: string,
    message = 'Session not found, please login.',
  ) {
    if (condition) {
      Logger.error(`Session not found / is invalid. throwing error`, trace);
      throw new UnauthorizedException(message);
    }
  }

  async loginMember(body: LoginMemberDto, trace: string) {
    Logger.log(`Attempting to find member by email ${body.email}`, trace);
    const member = await this.prisma.member.findFirst({
      where: {
        email: body.email,
      },
    });

    if (!member) {
      throw new NotFoundException('Member not found by that email/password');
    }
    Logger.log(`Found member by email ${body.email}`, trace);

    const isValidPassword = await verify(member.password, body.password);
    if (!isValidPassword) {
      throw new NotFoundException('Member not found by that email/password');
    }

    const expiresAt = new Date(Date.now() + 604800000);
    const session = await this.prisma.session.create({
      data: {
        memberId: member.id,
        expiresAt,
      },
      include: {
        member: {
          select: this.selector,
        },
      },
    });

    const job = new CronJob(expiresAt, async () => {
      const sessionId = session.id;
      Logger.log(
        `Attempting to delete session with the id of ${sessionId} from cron job`,
        trace,
      );

      await this.prisma.session.deleteMany({
        where: {
          id: sessionId,
        },
      });
    });

    this.schedulerRegistry.addCronJob(session.id, job);
    job.start();

    return session;
  }

  async del(id: string, trace: string) {
    Logger.log(`Hitting the DELETE operation on session`, trace);
    await this.prisma.session.deleteMany({
      where: {
        id,
      },
    });

    Logger.log(`Successfully delete all sessions with the id of ${id}`, trace);
    return this.formatter.formatSuccess(true);
  }

  // We do a clean up function everyone once in a while to ensure we delete session that are suppose to be expired
  @Cron('0 0 23 * * *')
  async cleanUpSession() {
    const response = await this.prisma.session.deleteMany({
      where: {
        expiresAt: {
          lte: new Date(Date.now()).toISOString(),
        },
      },
    });

    Logger.log(`cleaned up ${response.count} sessions`, 'clean up session');
  }
}
