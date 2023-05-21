import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { MemberWithOrg } from '../session/session.types';
import { PrismaService } from '../prisma/prisma.service';
import { ResponseService } from '../response/response.service';
import { CreateOrganizationDTO } from './organization.dto';

@Injectable()
export class OrganizationService {
  constructor(
    private prisma: PrismaService,
    private formatter: ResponseService,
  ) {}

  async getAll(member: MemberWithOrg, traceId: string) {
    Logger.log('Getting all organizations', traceId);
    const response = await this.prisma.organization.findMany({
      where: {
        members: {
          some: {
            id: member.id,
          },
        },
      },
    });
    Logger.log('Successfully got all organizations', traceId);
    return this.formatter.formatSuccess(response);
  }

  async getById(id: string, member: MemberWithOrg, trace: string) {
    Logger.log(`Grabbing organization by id of ${id}`, trace);
    const response = await this.prisma.organization.findFirst({
      where: {
        id,
        members: {
          some: {
            id: member.id,
          },
        },
      },
      include: {
        members: {
          select: {
            id: true,
            name: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!response) {
      Logger.error(
        `Failed to find Organization by ${id} or you're not apart of this organization`,
        trace,
      );
      throw new NotFoundException(
        `No Organization was found by this id of ${id} or you're not apart of this organization`,
      );
    }

    Logger.log(`Successfully found organization record by ${id}`, trace);
    return this.formatter.formatSuccess(response);
  }

  genInvite() {
    const values =
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return Array.from(
      { length: 10 },
      () => values[Math.floor(Math.random() * values.length)],
    ).join('');
  }

  async createOrganization(body: CreateOrganizationDTO, trace: string) {
    Logger.log('Attempting to create an organization', trace);
    const organization = await this.prisma.organization.create({
      data: {
        name: body.name,
        inviteCode: this.genInvite(),
      },
    });

    if (!organization) {
      Logger.error('Failed to create an organization', trace);
      throw new BadRequestException(
        `Whoops cannot create a organization at this time, try again later`,
      );
    }

    Logger.log('Success to create an organization', trace);
    return this.formatter.formatSuccess(organization);
  }

  async updateOrganization(
    id: string,
    body: CreateOrganizationDTO,
    trace: string,
  ) {
    Logger.log(`Attempting to update an organization with id of ${id}`, trace);
    const organization = await this.prisma.organization.update({
      where: {
        id,
      },
      data: {
        name: body.name,
        updatedAt: new Date(Date.now()),
      },
    });

    if (!organization) {
      Logger.error('Failed to update an organization', trace);
      throw new BadRequestException(
        `Whoops cannot update a organization at this time, try again later`,
      );
    }

    Logger.log(`Success to update an organization with the id of ${id}`, trace);
    return this.formatter.formatSuccess(organization);
  }

  async deleteOrganization(id: string, trace: string) {
    Logger.log(`Attempting to delete Organization with the id of ${id}`, trace);
    const response = await this.prisma.organization.deleteMany({
      where: {
        id,
      },
    });

    if (response.count === 0) {
      Logger.error(
        `Failed to delete an organization with the id of ${id}`,
        trace,
      );
      throw new NotFoundException(
        `Cannot find an organization to delete with the id of ${id}`,
      );
    }

    return this.formatter.formatSuccess(true);
  }

  async joinOrg(member: MemberWithOrg, inviteCode: string, trace: string) {
    Logger.log(
      `Attempting to find and connect member of id ${member.id} with invite code of ${inviteCode}`,
      trace,
    );
    const org = await this.prisma.organization.update({
      where: {
        inviteCode: inviteCode,
      },
      data: {
        members: {
          connect: [{ id: member.id }],
        },
      },
    });

    if (!org) {
      const message = `Failed to find organization with the invite of ${inviteCode}`;
      Logger.error(message, trace);

      throw new BadRequestException(message);
    }

    return true;
  }
}
