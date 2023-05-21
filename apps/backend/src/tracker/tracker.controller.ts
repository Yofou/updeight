import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Member } from '../decorator/member.decorator';
import { MemberWithOrg } from '../session/session.types';
import { OptionalIntPipe } from '../decorator/OptionalIntPipe.decorator';
import { ResponseService } from '../response/response.service';
import { CreateTrackerDto, UpdateTrackerDto } from './tracker.dto';
import { TrackerService } from './tracker.service';

@Controller({
  path: 'tracker',
})
export class TrackerController {
  constructor(
    private readonly service: TrackerService,
    private readonly formatter: ResponseService,
  ) {}

  @Get()
  async getAll(
    @Member() member: MemberWithOrg,
    @Query('month', new OptionalIntPipe()) month: number,
    @Query('year', new OptionalIntPipe())
    year: number = new Date().getFullYear(),
    @Query('trace-id') trace = randomUUID(),
  ) {
    Logger.log(`Hitting find all tracker with ${month} & ${year}`, trace);
    const trackers = await this.service.getAllForMonth(
      member.id,
      trace,
      month,
      year,
    );

    return this.formatter.formatSuccess(trackers);
  }

  @Post()
  async create(
    @Member() member: MemberWithOrg,
    @Body() body: CreateTrackerDto,
    @Query('trace-id') trace = randomUUID(),
  ) {
    Logger.log(`Hitting create a tracker`, trace);
    const tracker = await this.service.create(body, member);
    return this.formatter.formatSuccess(tracker);
  }

  @Post('/toggle')
  async toggleOn(
    @Member() member: MemberWithOrg,
    @Query('id') id: string,
    @Query('trace-id') trace = randomUUID(),
  ) {
    Logger.log(`Hitting toggle on tracker`, trace);
    const tracker = await this.service.toggleOn(id, member, trace);
    return this.formatter.formatSuccess(tracker);
  }

  @Delete('/toggle')
  async toggleOff(
    @Member() member: MemberWithOrg,
    @Query('id') id: string,
    @Query('trace-id') trace = randomUUID(),
  ) {
    Logger.log(`Hitting toggle off tracker`, trace);
    const tracker = await this.service.toggleOff(id, member, trace);
    return this.formatter.formatSuccess(tracker);
  }

  @Put()
  async update(
    @Member() member: MemberWithOrg,
    @Query('id') id: string,
    @Query('trace-id') trace = randomUUID(),
    @Body() body: UpdateTrackerDto,
  ) {
    Logger.log(`Hitting UPDATE tracker`, trace);
    const trackers = this.service.update(id, body, member, trace);

    return this.formatter.formatSuccess(trackers);
  }

  @Delete()
  async del(
    @Member() member: MemberWithOrg,
    @Query('id') id: string,
    @Query('trace-id') trace = randomUUID(),
  ) {
    Logger.log(`Hitting DELETE tracker`, trace);
    const trackers = await this.service.del(id, member, trace);

    return this.formatter.formatSuccess(trackers);
  }
}
