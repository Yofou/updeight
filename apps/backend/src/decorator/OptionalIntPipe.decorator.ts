import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  ParseIntPipe,
} from '@nestjs/common';

@Injectable()
export class OptionalIntPipe implements PipeTransform {
  constructor(private pip: ParseIntPipe = new ParseIntPipe()) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (!value) return value;
    return this.pip.transform(value, metadata);
  }
}
