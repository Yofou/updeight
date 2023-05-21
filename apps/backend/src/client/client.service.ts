import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from 'prisma';
import { ResponseService } from '../response/response.service';
import { CreateClientDto, UpdateClientDto } from './client.dto';

@Injectable()
export class ClientService {
  private select: Prisma.ClientSelect;
  constructor(
    private prisma: PrismaService,
    private formatter: ResponseService,
  ) {
    this.select = {
      id: true,
      name: true,
      thumbnail: true,
      organization: true,
      createdAt: true,
      updatedAt: true,
    };
  }

  async getAll(trace: string) {
    Logger.log('Attempting to get all clients', trace);
    const response = await this.prisma.client.findMany({
      select: this.select,
    });

    Logger.log('Successfully got all clients', trace);
    return this.formatter.formatSuccess(response);
  }

  async getOneById(id: string, trace: string) {
    Logger.log(`Attempting to get a client by id of ${id}`, trace);
    const response = await this.prisma.client.findFirst({
      where: {
        id,
      },
      select: this.select,
    });

    if (!response) {
      Logger.error(`Failed to get a client by id of ${id}`, trace);
      throw new BadRequestException(`Cannot find a client by that id of ${id}`);
    }

    Logger.log(`Successfully found the client of id of ${id}`, trace);
    return this.formatter.formatSuccess(response);
  }

  async getAllByOrganizationId(id: string, trace: string) {
    Logger.log(
      `Attempting to get all client with organization id of ${id}`,
      trace,
    );
    const response = await this.prisma.client.findFirst({
      where: {
        organizationId: id,
      },
      select: this.select,
    });

    Logger.log(`Successfully found the clients with organization id of ${id}`);
    return this.formatter.formatSuccess(response);
  }

  async create(body: CreateClientDto, trace: string) {
    Logger.log('Attempting create a client', trace);
    const response = await this.prisma.client.create({
      data: body,
      select: this.select,
    });

    Logger.log('Successfully create a client', trace);
    return this.formatter.formatSuccess(response);
  }

  async doesOrgExist(id: string, trace: string) {
    Logger.log('Checking if organization of ${id} exists', trace);
    const count = await this.prisma.organization.count({
      where: {
        id,
      },
    });

    if (count === 0) {
      Logger.error(`Cannot find the organization with the id of ${id}`, trace);
      throw new BadRequestException(
        `Cannot find the organization with the id of ${id}`,
      );
    }
  }

  async update(id: string, body: UpdateClientDto, trace: string) {
    Logger.log('Attempting create a client', trace);
    const response = await this.prisma.client.update({
      where: {
        id,
      },
      data: body,
      select: this.select,
    });

    Logger.log('Successfully create a client', trace);
    return this.formatter.formatSuccess(response);
  }

  async delete(id: string, trace: string) {
    Logger.log(`Attempting to delete a client with the id of ${id}`, trace);
    const response = await this.prisma.client.deleteMany({
      where: {
        id,
      },
    });

    if (response.count === 0) {
      Logger.error(`Failed to delete a client with id of ${id}`, trace);
      throw new BadRequestException(
        `Couldn't find the client with id of ${id}`,
      );
    }

    Logger.log(`Successfully deleted a client with the id of ${id}`, trace);
    return this.formatter.formatSuccess(true);
  }
}
