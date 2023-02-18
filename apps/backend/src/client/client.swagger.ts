import { getGeneralResponse } from '../response/response.swagger';
import { ClientDto } from './client.dto';

export class ClientResponse extends getGeneralResponse(ClientDto) {}
