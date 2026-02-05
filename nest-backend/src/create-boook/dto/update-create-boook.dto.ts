import { PartialType } from '@nestjs/mapped-types';
import { CreateCreateBoookDto } from './create-create-boook.dto';

export class UpdateCreateBoookDto extends PartialType(CreateCreateBoookDto) {}
