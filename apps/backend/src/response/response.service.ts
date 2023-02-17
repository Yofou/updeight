import { Injectable } from '@nestjs/common';

export interface UpdeightResponse<T> {
  data: T;
  operation_status: {
    isSuccess: boolean;
    message?: string;
  };
}

@Injectable()
export class ResponseService {
  private format<T>(data: T, isSuccess: boolean, message?: string) {
    const response: UpdeightResponse<T> = {
      data,
      operation_status: {
        isSuccess,
      },
    };

    if (message) response.operation_status.message = message;

    return response;
  }

  formatSucces<T>(data: T) {
    return this.format(data, true);
  }

  formatFailure(message: string) {
    return this.format(undefined, false, message);
  }
}
