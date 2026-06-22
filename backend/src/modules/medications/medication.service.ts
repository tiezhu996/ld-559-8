import { Injectable } from '@nestjs/common';
import { UserRole } from '../../constants/enums';
import { BusinessException } from '../../exceptions/business.exception';
import { CreateMedicationDto, UpdateMedicationDto } from './medication.dto';
import { MedicationRepository } from './medication.repository';
import { validateMedicationDuration } from './medication.validator';

@Injectable()
export class MedicationService {
  constructor(private readonly repo: MedicationRepository) {}

  list(user: { sub: string; role: UserRole }, petId?: string, name?: string) {
    return this.repo.findMany(user, petId, name);
  }

  listByPetGrouped(petId: string) {
    return this.repo.findByPetIdGroupedByName(petId);
  }

  async create(dto: CreateMedicationDto) {
    validateMedicationDuration(dto.durationDays);
    return this.repo.create(dto);
  }

  async createMany(medicalRecordId: string, petId: string, items: Array<Omit<CreateMedicationDto, 'medicalRecordId' | 'petId'>>) {
    const results = [];
    for (const item of items) {
      validateMedicationDuration(item.durationDays);
      results.push(
        await this.repo.create({
          ...item,
          medicalRecordId,
          petId,
        }),
      );
    }
    return results;
  }

  async update(id: string, dto: UpdateMedicationDto) {
    const exists = await this.repo.findById(id);
    if (!exists) throw new BusinessException('用药记录不存在', 40401);
    if (dto.durationDays !== undefined) {
      validateMedicationDuration(dto.durationDays);
    }
    return this.repo.update(id, dto);
  }
}
