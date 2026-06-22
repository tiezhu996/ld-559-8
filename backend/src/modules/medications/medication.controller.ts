import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuditLog } from '../../middleware/audit-log';
import { AuthGuard } from '../auth/auth.guard';
import { CreateMedicationDto, UpdateMedicationDto } from './medication.dto';
import { MedicationService } from './medication.service';

@Controller('medications')
@UseGuards(AuthGuard)
export class MedicationController {
  constructor(private readonly service: MedicationService) {}

  @Get()
  async list(@Req() req: any, @Query('petId') petId?: string, @Query('name') name?: string) {
    return { code: 0, message: 'ok', data: await this.service.list(req.user, petId, name) };
  }

  @Get('pet/:petId/grouped')
  async listByPetGrouped(@Param('petId') petId: string) {
    return { code: 0, message: 'ok', data: await this.service.listByPetGrouped(petId) };
  }

  @Post()
  @AuditLog('添加用药记录')
  async create(@Body() dto: CreateMedicationDto) {
    return { code: 0, message: 'ok', data: await this.service.create(dto) };
  }

  @Patch(':id')
  @AuditLog('更新用药记录')
  async update(@Param('id') id: string, @Body() dto: UpdateMedicationDto) {
    return { code: 0, message: 'ok', data: await this.service.update(id, dto) };
  }
}
