import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateBoookService } from './create-boook.service';
import { CreateCreateBoookDto } from './dto/create-create-boook.dto';
import { UpdateCreateBoookDto } from './dto/update-create-boook.dto';

@Controller('create-boook')
export class CreateBoookController {
  constructor(private readonly createBoookService: CreateBoookService) {}

  @Post()
  create(@Body() createCreateBoookDto: CreateCreateBoookDto) {
    return this.createBoookService.create(createCreateBoookDto);
  }

  @Get()
  findAll() {
    return this.createBoookService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.createBoookService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCreateBoookDto: UpdateCreateBoookDto) {
    return this.createBoookService.update(+id, updateCreateBoookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.createBoookService.remove(+id);
  }
}
