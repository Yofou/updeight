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
import { CreateOrganizationDTO, OrganizationDTO } from './organization.dto';
import { OrganizationService } from './organization.service';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import {
  GeneralResponseWithBoolenaData,
  getGeneralResponse,
} from '../response/response.swagger';

@Controller({
  path: 'organization',
})
export class OrganizationController {
  constructor(private readonly orgService: OrganizationService) {}

  @ApiOperation({
    summary: 'Gets all organizations or one if queried by id',
  })
  @ApiResponse({
    description: 'should return the all organizations or one',
    type: getGeneralResponse(OrganizationDTO),
    isArray: true,
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
  @Get()
  read(
    @Query('id') id?: string,
    @Query('trace-id') trace: string = randomUUID(),
  ) {
    Logger.log('Htting READ operation on Organization', trace);
    if (id) return this.orgService.getById(id, trace);
    return this.orgService.getAll(trace);
  }

  @ApiQuery({
    name: 'trace-id',
    type: 'string',
    required: false,
  })
  @ApiOperation({
    summary: 'Create a new organization',
  })
  @ApiResponse({
    description: 'should return newly created organization',
    type: getGeneralResponse(OrganizationDTO),
  })
  @Post()
  create(
    @Query('trace-id') trace = randomUUID(),
    @Body() organization: CreateOrganizationDTO,
  ) {
    Logger.log('Hitting CREATE operation on Organization', trace);
    return this.orgService.createOrganization(organization, trace);
  }

  @ApiOperation({
    summary: 'Updates a specific organization by id',
  })
  @ApiQuery({
    name: 'trace-id',
    type: 'string',
    required: false,
  })
  @ApiResponse({
    description: 'should return the newly updated organization',
    type: getGeneralResponse(OrganizationDTO),
  })
  @Put()
  update(
    @Query('id') id: string,
    @Query('trace-id') trace = randomUUID(),
    @Body() organization: CreateOrganizationDTO,
  ) {
    Logger.log('Hitting UPDATE operation on Organization', trace);
    return this.orgService.updateOrganization(id, organization, trace);
  }

  @ApiQuery({
    name: 'trace-id',
    type: 'string',
    required: false,
  })
  @ApiOperation({
    summary: 'delete an existing organization',
  })
  @ApiResponse({
    description: 'should return a boolean if ',
    type: GeneralResponseWithBoolenaData,
  })
  @Delete()
  del(@Query('id') id: string, @Query('trace-id') trace = randomUUID()) {
    Logger.log('Hitting UPDATE operation on Organization', trace);
    return this.orgService.deleteOrganization(id, trace);
  }
}
