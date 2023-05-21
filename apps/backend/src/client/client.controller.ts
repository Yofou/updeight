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
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { GeneralResponseWithBooleanData } from '../response/response.swagger';
import { CreateClientDto, UpdateClientDto } from './client.dto';
import { ClientService } from './client.service';
import { ClientResponse } from './client.swagger';

@Controller({
  path: 'client',
})
export class ClientController {
  constructor(private clientService: ClientService) {}

  @ApiOperation({
    summary: `Gets all clients`,
    description: `Get's all clients, if supplied an id will grab single client or if given an organization id will grab all clients for that organization`,
  })
  @ApiQuery({
    name: 'id',
    required: false,
    type: 'string',
  })
  @ApiQuery({
    name: 'id',
    required: false,
    type: 'string',
  })
  @ApiResponse({
    type: ClientResponse,
    isArray: true,
  })
  @Get()
  read(
    @Query('id') id?: string,
    @Query('trace-id') trace = randomUUID(),
    @Query('organization') organization?: string,
  ) {
    Logger.log('Hitting the READ operation on clients');
    if (id) return this.clientService.getOneById(id, trace);
    if (organization)
      return this.clientService.getAllByOrganizationId(organization, trace);
    return this.clientService.getAll(trace);
  }

  @ApiOperation({
    summary: 'Create a client record',
  })
  @ApiQuery({
    name: 'trace-id',
    type: 'string',
    required: false,
  })
  @ApiResponse({
    type: ClientResponse,
  })
  @Post()
  create(
    @Query('trace-id') trace = randomUUID(),
    @Body() body: CreateClientDto,
  ) {
    Logger.log('Hitting the CREATE operation on clients', trace);
    return this.clientService.create(body, trace);
  }

  @ApiOperation({
    summary: `Updates a client a record`,
  })
  @ApiQuery({
    name: 'id',
    required: false,
    type: 'string',
  })
  @ApiResponse({
    type: ClientResponse,
  })
  @Put()
  async update(
    @Query('id') id: string,
    @Query('trace-id') trace = randomUUID(),
    @Body() body: UpdateClientDto,
  ) {
    Logger.log('Hitting the UPDATE operation on clients');
    const client = await this.clientService.getOneById(id, trace);
    this.clientService.doesOrgExist(client.data.organizationId, trace);
    return this.clientService.update(id, body, trace);
  }

  @Delete()
  @ApiOperation({
    summary: `Deletes a client a record`,
  })
  @ApiResponse({
    type: GeneralResponseWithBooleanData,
  })
  del(@Query('id') id: string, @Query('trace-id') trace = randomUUID()) {
    Logger.log('Hitting the DELETE operati on on clients', trace);
    return this.clientService.delete(id, trace);
  }
}
