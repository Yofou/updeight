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
import { SessionService } from '../session/session.service';
import { MemberService } from './member.service';
import { Session as SessionData } from '@fastify/secure-session';
import { ResponseService } from '../response/response.service';
import {
  CreateMemberDto,
  LoginMemberDto,
  MemberResponseDto,
  UpdateMemberDto,
} from './member.dto';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import {
  GeneralResponseWithBooleanData,
  getGeneralResponse,
} from '../response/response.swagger';
import { Member } from '../decorator/member.decorator';
import { MemberWithOrg } from '../session/session.types';

@Controller({
  path: 'member',
})
export class MemberController {
  constructor(
    private service: MemberService,
    private sessionService: SessionService,
    private formatter: ResponseService,
  ) {}

  @ApiOperation({
    summary:
      'Gets member(s) by id or organization id, if nothing is supplied will get by active session id',
  })
  @ApiCookieAuth('session')
  @ApiResponse({
    description: 'should return the all members or one',
    type: getGeneralResponse(MemberResponseDto),
    isArray: true,
  })
  @ApiQuery({
    name: 'id',
    type: 'string',
    required: false,
  })
  @ApiQuery({
    name: 'organization',
    type: 'string',
    required: false,
  })
  @ApiQuery({
    name: 'trace-id',
    type: 'string',
    required: false,
  })
  @Get()
  async read(
    @Member() member: MemberWithOrg,
    @Query('id') id?: string,
    @Query('organization') organizationId?: string,
    @Query('trace-id') trace = randomUUID(),
  ) {
    Logger.log('Hitting READ operation on member', trace);

    if (id) return this.service.getByMemberById(id, trace);
    if (organizationId) {
      const response = await this.service.getAllOrgMembers(
        organizationId,
        member,
        trace,
      );

      return this.formatter.formatSuccess(response);
    }

    return this.formatter.formatSuccess(member);
  }

  @ApiOperation({
    summary: 'Checks credentials & logs user in, and create a session',
  })
  @ApiResponse({
    description: 'should return the logged in member',
    type: getGeneralResponse(MemberResponseDto),
  })
  @ApiQuery({
    name: 'trace-id',
    type: 'string',
    required: false,
  })
  @Post('login')
  async login(
    @Session() session: SessionData,
    @Query('trace-id') trace = randomUUID(),
    @Body() body: LoginMemberDto,
  ) {
    Logger.log('Hitting LOGIN operation on member', trace);
    const response = await this.sessionService.loginMember(body, trace);

    session.set('id', response.id);
    return this.formatter.formatSuccess(response.member);
  }

  @ApiOperation({
    summary: 'Checks credentials & logs user out, and deletes a session',
  })
  @ApiCookieAuth('session')
  @ApiResponse({
    description: 'should return a boolean response',
    type: GeneralResponseWithBooleanData,
  })
  @ApiQuery({
    name: 'trace-id',
    type: 'string',
    required: false,
  })
  @Post('logout')
  async logout(
    @Session() session: SessionData,
    @Query('trace-id') trace = randomUUID(),
  ) {
    const id = session.get('id');
    session.delete();

    return this.sessionService.del(id, trace);
  }

  @ApiOperation({
    summary: 'registers a user & create a session',
  })
  @ApiResponse({
    description: 'should return the newly created member',
    type: getGeneralResponse(MemberResponseDto),
  })
  @ApiQuery({
    name: 'trace-id',
    type: 'string',
    required: false,
  })
  @Post()
  async create(
    @Session() session: SessionData,
    @Query('trace-id') trace = randomUUID(),
    @Body() body: CreateMemberDto,
  ) {
    // Register
    Logger.log('Hitting CREATE operation on member', trace);
    const response = await this.service.createMember(body, trace);

    session.set('id', response.id);
    return this.formatter.formatSuccess(response.member);
  }

  @ApiOperation({
    summary: 'allows a given user to change there details other than email',
  })
  @ApiCookieAuth('session')
  @ApiResponse({
    description: 'should return the newly updated member',
    type: getGeneralResponse(MemberResponseDto),
  })
  @ApiQuery({
    name: 'id',
    type: 'string',
    required: false,
  })
  @ApiQuery({
    name: 'trace-id',
    type: 'string',
    required: false,
  })
  @Put()
  async update(
    @Member() member: MemberWithOrg,
    @Query('id') id: string,
    @Query('trace-id') trace = randomUUID(),
    @Body() body: UpdateMemberDto,
  ) {
    Logger.log('Hitting the UPDATE operation on member', trace);
    return this.service.updateMember(id, body, member, trace);
  }

  @ApiOperation({
    summary: 'allows a given user to delete there membership',
  })
  @ApiCookieAuth('session')
  @ApiResponse({
    description: 'should return the boolean response if membership was deleted',
    type: GeneralResponseWithBooleanData,
  })
  @ApiQuery({
    name: 'id',
    type: 'string',
    required: false,
  })
  @ApiQuery({
    name: 'trace-id',
    type: 'string',
    required: false,
  })
  @Delete()
  async del(
    @Session() session: SessionData,
    @Member() member: MemberWithOrg,
    @Query('id') id?: string,
    @Query('trace-id') trace = randomUUID(),
  ) {
    Logger.log('Hitting the DELETE operation on member', trace);
    await this.sessionService.del(session.get('id'), trace);
    session.delete();

    const response = await this.service.delMember(
      id ?? member.id,
      member,
      trace,
    );

    return response;
  }
}
