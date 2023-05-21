import { SessionData } from '@fastify/secure-session';
import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Post,
  Put,
  Query,
  Session,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { OptionalIntPipe } from '../decorator/OptionalIntPipe.decorator';
import { ResponseService } from '../response/response.service';
import { SessionService } from '../session/session.service';
import { CreateTrackerDto, UpdateTrackerDto } from './tracker.dto';
import { TrackerService } from './tracker.service';

@Controller({
  path: 'tracker',
})
export class TrackerController {
  constructor(
    private readonly service: TrackerService,
    private readonly sessionService: SessionService,
    private readonly formatter: ResponseService,
  ) {}

  @Get()
  async getAll(
    @Session() session: SessionData,
    @Query('month', new OptionalIntPipe()) month: number,
    @Query('year', new OptionalIntPipe())
    year: number = new Date().getFullYear(),
    @Query('trace-id') trace = randomUUID(),
  ) {
    Logger.log(`Hitting find all tracker with ${month} & ${year}`, trace);
    const member = await this.sessionService.getMember(
      session.get('id'),
      trace,
    );

    this.sessionService.ifNullThrow(!member, trace);
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
    @Session() session: SessionData,
    @Body() body: CreateTrackerDto,
    @Query('trace-id') trace = randomUUID(),
  ) {
    Logger.log(`Hitting create a tracker`, trace);
    const member = await this.sessionService.getMember(
      session.get('id'),
      trace,
    );

    this.sessionService.ifNullThrow(!member, trace);
    const tracker = await this.service.create(body, member);
    return this.formatter.formatSuccess(tracker);
  }

  @Post('/toggle')
  async toggleOn(
    @Session() session: SessionData,
    @Query('id') id: string,
    @Query('trace-id') trace = randomUUID(),
  ) {
    Logger.log(`Hitting toggle on tracker`, trace);
    const member = await this.sessionService.getMember(
      session.get('id'),
      trace,
    );

    this.sessionService.ifNullThrow(!member, trace);
    const tracker = await this.service.toggleOn(id, member, trace);
    return this.formatter.formatSuccess(tracker);
  }

  @Delete('/toggle')
  async toggleOff(
    @Session() session: SessionData,
    @Query('id') id: string,
    @Query('trace-id') trace = randomUUID(),
  ) {
    Logger.log(`Hitting toggle off tracker`, trace);
    const member = await this.sessionService.getMember(
      session.get('id'),
      trace,
    );

    this.sessionService.ifNullThrow(!member, trace);
    const tracker = await this.service.toggleOff(id, member, trace);
    return this.formatter.formatSuccess(tracker);
  }

  @Put()
  async update(
    @Session() session: SessionData,
    @Query('id') id: string,
    @Query('trace-id') trace = randomUUID(),
    @Body() body: UpdateTrackerDto,
  ) {
    Logger.log(`Hitting UPDATE tracker`, trace);
    const member = await this.sessionService.getMember(
      session.get('id'),
      trace,
    );

    this.sessionService.ifNullThrow(!member, trace);
    const trackers = this.service.update(id, body, member, trace);

    return this.formatter.formatSuccess(trackers);
  }

  @Delete()
  async del(
    @Session() session: SessionData,
    @Query('id') id: string,
    @Query('trace-id') trace = randomUUID(),
  ) {
    Logger.log(`Hitting DELETE tracker`, trace);
    const member = await this.sessionService.getMember(
      session.get('id'),
      trace,
    );

    this.sessionService.ifNullThrow(!member, trace);
    const trackers = this.service.del(id, member, trace);

    return this.formatter.formatSuccess(trackers);
  }
}
