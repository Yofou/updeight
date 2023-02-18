import { ApiProperty } from '@nestjs/swagger';

export class OperationStatusResponse {
  @ApiProperty({ type: 'boolean' })
  isSuccess: boolean;

  @ApiProperty({ type: 'string', nullable: true })
  message?: string;
}

export class GeneralResponseWithBoolenaData {
  @ApiProperty({ type: 'boolean' })
  data: boolean;

  @ApiProperty()
  operation_status: OperationStatusResponse;
}

export const getGeneralResponse = <T>(value: T, isArray = false) => {
  class GeneralResponse {
    @ApiProperty({ type: value, isArray })
    data: T;

    @ApiProperty()
    operation_status: OperationStatusResponse;
  }

  return GeneralResponse;
};
