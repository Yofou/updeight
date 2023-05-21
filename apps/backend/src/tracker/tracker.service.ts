import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { MemberWithOrg } from '../session/session.types';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTrackerDto, UpdateTrackerDto } from './tracker.dto';
import { DateTime } from 'luxon';

@Injectable()
export class TrackerService {
  constructor(private prisma: PrismaService) {}

  async getAllForMonth(
    memberId: string,
    trace: string,
    month?: number,
    year?: number,
  ) {
    const lowerBoundDate = DateTime.utc(year, month, 1);
    const upperBoundDate = DateTime.utc(
      year,
      month,
      lowerBoundDate.daysInMonth,
    );

    Logger.log(
      `Attempting to search for all trackers on a member ${memberId} from ${lowerBoundDate} to ${upperBoundDate}`,
      trace,
    );
    const trackers = await this.prisma.tracker.findMany({
      where: {
        memberId: memberId,
        createdFor: {
          lte: upperBoundDate.toJSDate(),
          gte: lowerBoundDate.toJSDate(),
        },
      },
    });

    return trackers;
  }

  async create(data: CreateTrackerDto, member: MemberWithOrg) {
    const client = await this.prisma.client.findFirst({
      where: {
        id: data.clientId,
        organization: {
          members: {
            some: {
              id: member.id,
            },
          },
        },
      },
    });

    if (!client) {
      throw new NotFoundException(
        `No client found with the id of ${data.clientId}`,
      );
    }

    const date = new Date(data.createdFor);
    const createdFor = new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
    );

    const response = await this.prisma.tracker.create({
      data: {
        ...data,
        createdFor: createdFor,
        memberId: member.id,
      },
    });

    return response;
  }

  async toggleOn(id: string, member: MemberWithOrg, trace: string) {
    const { count } = await this.prisma.tracker.updateMany({
      where: {
        id,
        memberId: member.id,
        isToggledOn: false,
      },
      data: {
        isToggledOn: true,
        lastToggledOn: DateTime.utc().toJSDate(),
      },
    });

    if (count === 0) {
      const message = `Could not find a tracker with the id of ${id} or you do not own this tracker`;
      Logger.error(message, trace);
      throw new NotFoundException(message);
    }

    const trackers = await this.prisma.tracker.findMany({
      where: {
        memberId: member.id,
      },
    });

    return trackers;
  }

  async toggleOff(id: string, member: MemberWithOrg, trace: string) {
    const tracker = await this.prisma.tracker.findFirst({
      where: {
        id,
        memberId: member.id,
      },
    });

    if (!tracker) {
      const message = `Could not find a tracker with the id of ${id} or you do not own this tracker`;
      Logger.error(message, trace);
      throw new NotFoundException(message);
    }

    const timeTillNow = Date.now() - tracker.lastToggledOn.getTime();
    await this.prisma.tracker.update({
      where: {
        id,
      },
      data: {
        isToggledOn: false,
        lastToggledOn: DateTime.utc().toJSDate(),
        beforeDuration: {
          increment: timeTillNow,
        },
      },
    });

    const trackers = await this.prisma.tracker.findMany({
      where: {
        memberId: member.id,
      },
    });

    return trackers;
  }

  async update(
    id: string,
    data: UpdateTrackerDto,
    member: MemberWithOrg,
    trace: string,
  ) {
    const { count } = await this.prisma.tracker.updateMany({
      where: {
        id,
        memberId: member.id,
      },
      data: {
        ...data,
        updatedAt: DateTime.utc().toJSDate(),
      },
    });

    if (count === 0) {
      const message = `Could not find a tracker with the id of ${id} or you do not own this tracker`;
      Logger.error(message, trace);
      throw new NotFoundException(message);
    }

    const trackers = await this.prisma.tracker.findMany({
      where: {
        memberId: member.id,
      },
    });

    return trackers;
  }

  async del(id: string, member: MemberWithOrg, trace: string) {
    const { count } = await this.prisma.tracker.deleteMany({
      where: {
        id,
        memberId: member.id,
      },
    });

    if (count === 0) {
      const message = `Could not find a tracker with the id of ${id} or you do not own this tracker`;
      Logger.error(message, trace);
      throw new NotFoundException(message);
    }

    const trackers = await this.prisma.tracker.findMany({
      where: {
        memberId: member.id,
      },
    });

    return trackers;
  }
}
