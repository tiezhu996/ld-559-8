import { Injectable } from '@nestjs/common';
import { UserRole } from '../../constants/enums';
import { MedicationService } from '../medications/medication.service';
import { CreateMedicalDto, UpdateMedicalDto } from './medical.dto';
import { MedicalRepository } from './medical.repository';
import { validateMedicalCost } from './medical.validator';

@Injectable()
export class MedicalService {
  constructor(
    private readonly repo: MedicalRepository,
    private readonly medicationService: MedicationService,
  ) {}

  list(user: { sub: string; role: UserRole }, petId?: string, type?: string) {
    return this.repo.findMany(user, petId, type);
  }

  async create(dto: CreateMedicalDto) {
    validateMedicalCost(dto.cost);
    const { medications, ...rest } = dto;
    const record = await this.repo.create({
      ...rest,
      visitDate: new Date(dto.visitDate),
      nextVisitDate: dto.nextVisitDate ? new Date(dto.nextVisitDate) : undefined,
      attachments: dto.attachments || [],
    });
    if (medications && medications.length > 0) {
      await this.medicationService.createMany(record.id, dto.petId, medications);
    }
    return record;
  }

  update(id: string, dto: UpdateMedicalDto) {
    validateMedicalCost(dto.cost);
    const { medications, ...rest } = dto;
    return this.repo.update(id, {
      ...rest,
      visitDate: new Date(dto.visitDate),
      nextVisitDate: dto.nextVisitDate ? new Date(dto.nextVisitDate) : null,
      attachments: dto.attachments || [],
    });
  }
}
