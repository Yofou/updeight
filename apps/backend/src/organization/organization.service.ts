import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ResponseService } from '../response/response.service';
import { CreateOrganizationDTO } from './organization.dto';

@Injectable()
export class OrganizationService {
  constructor(
    private prisma: PrismaService,
    private formater: ResponseService,
  ) {}

  async getAll(traceId: string) {
    Logger.log('Getting all organizations', traceId);
    const response = await this.prisma.organization.findMany();
    Logger.log('Succesfully got all organizations', traceId);
    return this.formater.formatSucces(response);
  }

  async getById(id: string, trace: string) {
    Logger.log(`Grabbing organization by id of ${id}`, trace);
    const response = await this.prisma.organization.findFirst({
      where: {
        id,
      },
    });

    if (!response) {
      Logger.error(`Failed to find Organization by ${id}`, trace);
      throw new BadRequestException(
        `No Organization was found by this id of ${id}`,
      );
    }

    Logger.log(`Succesfully found organization record by ${id}`, trace);
    return this.formater.formatSucces(response);
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
    Logger.log('Attemping to create an organization', trace);
    const organization = await this.prisma.organization.create({
      data: {
        name: body.name,
        invite_code: this.genInvite(),
      },
    });

    if (!organization) {
      Logger.error('Failed to create an organization', trace);
      throw new InternalServerErrorException(
        `Whoops cannot create a organization at this time, try again later`,
      );
    }

    Logger.log('Success to create an organization', trace);
    return this.formater.formatSucces(organization);
  }

  async updateOrganization(
    id: string,
    body: CreateOrganizationDTO,
    trace: string,
  ) {
    Logger.log(`Attemping to update an organization with id of ${id}`, trace);
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
      throw new InternalServerErrorException(
        `Whoops cannot update a organization at this time, try again later`,
      );
    }

    Logger.log(`Success to update an organization with the id of ${id}`, trace);
    return this.formater.formatSucces(organization);
  }

  async deleteOrganization(id: string, trace: string) {
    Logger.log(`Attempting to delete Organization with the id of ${id}`, trace);

    Logger.debug(id);
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
      throw new BadRequestException(
        `Cannot find an organization to delete with the id of ${id}`,
      );
    }

    return this.formater.formatSucces(true);
  }
}
