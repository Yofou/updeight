import { Injectable } from '@nestjs/common';

export interface UpdeightResponse<T> {
  data: T;
  operationStatus: {
    isSuccess: boolean;
    message?: string;
  };
}

@Injectable()
export class ResponseService {
  private format<T>(data: T, isSuccess: boolean, message?: string) {
    const response: UpdeightResponse<T> = {
      data,
      operationStatus: {
        isSuccess,
      },
    };

    if (message) response.operationStatus.message = message;

    return response;
  }

  formatSuccess<T>(data: T) {
    return this.format(data, true);
  }

  formatFailure(message: string) {
    return this.format(undefined, false, message);
  }
}
