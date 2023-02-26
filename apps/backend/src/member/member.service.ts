import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ResponseService } from '../response/response.service';
import { CreateMemberDto, UpdateMemberDto } from './member.dto';
import { hash } from 'argon2';
import { Member, Prisma } from 'prisma';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class MemberService {
  private selector: Prisma.MemberSelect;
  constructor(
    private prisma: PrismaService,
    private formater: ResponseService,
    private schedulerRegistry: SchedulerRegistry,
  ) {
    this.selector = {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    };
  }

  async getByMemberById(id: string, trace: string) {
    Logger.log(`Attempting to get a member record by the id of ${id}`, trace);
    const response = await this.prisma.member.findFirst({
      where: {
        id,
      },
      select: this.selector,
    });

    if (!response) {
      Logger.error(`Failed to get a member record by the id of ${id}`, trace);
      throw new BadRequestException(
        `Cannot find a member with the id of ${id}`,
      );
    }

    Logger.log(`Succesfully got the member record by the id of ${id}`, trace);
    Logger.debug(response, trace);
    return this.formater.formatSucces(response);
  }

  async getAllOrgMembers(id: string, trace: string) {
    Logger.log(
      `Attempting to read all members from the orgization ${id}`,
      trace,
    );

    const members = await this.prisma.member.findMany({
      where: {
        organizations: {
          some: {
            id,
          },
        },
      },
      select: this.selector,
    });

    Logger.log(
      `Successfuly read all membwers from the organization ${id}`,
      trace,
    );
    Logger.debug(members);
    return this.formater.formatSucces(members);
  }

  async createMember(body: CreateMemberDto, trace: string) {
    Logger.log('Attempting to create a member', trace);
    Logger.debug(body, trace);
    const member = await this.prisma.member.create({
      data: { ...body, password: await hash(body.password) },
      select: this.selector,
    });
    Logger.log('Succesfully created a memmber', trace);

    Logger.log(
      `Attempting to create a session with the member ${member.id}`,
      trace,
    );

    const expiresAt = new Date(Date.now() + 604800000);
    const session = await this.prisma.session.create({
      data: {
        memberId: member.id,
        expiresAt,
      },
    });
    Logger.log('Succesfully created session', trace);

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

    return {
      ...session,
      member,
    };
  }

  async updateMember(
    id: string,
    body: UpdateMemberDto,
    member: Omit<Member, 'password'>,
    trace: string,
  ) {
    Logger.log(
      `Attempting to check validation if ${member.id} can update ${id}`,
      trace,
    );
    if (member.id !== id) {
      Logger.error(
        `Failed validation on if user can performe an update on ${id}`,
        trace,
      );
      throw new BadRequestException('you cannot update this member');
    }

    Logger.log(`Attempting to update the user id ${id}`, trace);
    const newMember = await this.prisma.member.update({
      where: {
        id,
      },
      data: body,
      select: this.selector,
    });

    Logger.log(`Succesfully updated the user id of ${id}`, trace);
    Logger.debug(newMember);
    return this.formater.formatSucces(newMember);
  }

  async delMember(id: string, member: Omit<Member, 'password'>, trace: string) {
    Logger.log(
      `Checking if member has permission to delete the member of id ${id}`,
      trace,
    );
    if (id !== member.id) {
      Logger.error(
        `request member of id ${member.id}, cannot delete the member of id ${id}`,
        trace,
      );
      throw new UnauthorizedException('You cannot delete this member');
    }

    Logger.log(`Attemtping to delete the member of id ${id}`, trace);
    const response = await this.prisma.member.deleteMany({
      where: {
        id,
      },
    });

    if (response.count === 0) {
      Logger.error(`No deletions were made, throwing not found`, trace);
      throw new NotFoundException('Member by the id of ${id} was not found');
    }

    Logger.log(`Deletion of member ${id} was succesful`, trace);
    return this.formater.formatSucces(true);
  }
}
