import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UserRole } from '../../constants/enums';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MedicationRepository {
  constructor(private readonly prisma: PrismaService) {}

  findMany(user: { sub: string; role: UserRole }, petId?: string, name?: string) {
    const where: Prisma.MedicationWhereInput = {
      ...(user.role === UserRole.PET_OWNER ? { pet: { ownerId: user.sub } } : {}),
      ...(petId ? { petId } : {}),
      ...(name ? { name: { contains: name, mode: 'insensitive' } } : {}),
    };
    return this.prisma.medication.findMany({
      where,
      include: { pet: true, medicalRecord: true },
      orderBy: { startDate: 'desc' },
    });
  }

  findByPetIdGroupedByName(petId: string) {
    return this.prisma.medication.findMany({
      where: { petId },
      include: { medicalRecord: true },
      orderBy: { startDate: 'desc' },
    });
  }

  findUpcomingEndDates(now: Date, daysAhead: number) {
    const endDate = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);
    return this.prisma.medication.findMany({
      where: { endDate: { gte: now, lte: endDate } },
      include: { pet: true },
    });
  }

  findById(id: string) {
    return this.prisma.medication.findUnique({ where: { id }, include: { pet: true, medicalRecord: true } });
  }

  create(data: Prisma.MedicationUncheckedCreateInput) {
    const startDate = new Date(data.startDate as any);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + (data.durationDays as number) - 1);
    return this.prisma.medication.create({
      data: { ...data, startDate, endDate },
    });
  }

  update(id: string, data: Prisma.MedicationUncheckedUpdateInput) {
    let endDate: Date | undefined;
    if (data.startDate !== undefined || data.durationDays !== undefined) {
      return this.prisma.medication.findUnique({ where: { id } }).then((existing) => {
        if (!existing) return null;
        const startDate = data.startDate !== undefined ? new Date(data.startDate as any) : existing.startDate;
        const durationDays = data.durationDays !== undefined ? (data.durationDays as number) : existing.durationDays;
        const newEndDate = new Date(startDate);
        newEndDate.setDate(newEndDate.getDate() + durationDays - 1);
        return this.prisma.medication.update({
          where: { id },
          data: { ...data, startDate, endDate: newEndDate },
        });
      });
    }
    return this.prisma.medication.update({ where: { id }, data });
  }