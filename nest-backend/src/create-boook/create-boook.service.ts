import { Injectable } from '@nestjs/common';
import { CreateCreateBoookDto } from './dto/create-create-boook.dto';
import { UpdateCreateBoookDto } from './dto/update-create-boook.dto';

@Injectable()
export class CreateBoookService {
  create(createCreateBoookDto: CreateCreateBoookDto) {
    return 'This action adds a new createBoook';
  }

  findAll() {
    return `This action returns all createBoook`;
  }

  findOne(id: number) {
    return `This action returns a #${id} createBoook`;
  }

  update(id: number, updateCreateBoookDto: UpdateCreateBoookDto) {
    return `This action updates a #${id} createBoook`;
  }

  remove(id: number) {
    return `This action removes a #${id} createBoook`;
  }
}
