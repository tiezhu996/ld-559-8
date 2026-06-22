import { Injectable } from '@nestjs/common';
import { addDays } from '../../utils/date';
import { PrismaService } from '../../prisma/prisma.service';
import { MedicationRepository } from '../medications/medication.repository';

@Injectable()
export class NotificationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly medicationRepo: MedicationRepository,
  ) {}

  list(userId: string) {
    return this.prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  }

  unreadCount(userId: string) {
    return this.prisma.notification.count({ where: { userId, read: false } });
  }

  markRead(id: string) {
    return this.prisma.notification.update({ where: { id }, data: { read: true } });
  }

  async scanAndCreateReminders() {
    const now = new Date();
    const vaccineDue = await this.prisma.vaccineRecord.findMany({
      where: { nextDueDate: { gte: now, lte: addDays(now, 7) } },
      include: { pet: true },
    });
    for (const item of vaccineDue) {
      await this.prisma.notification.create({
        data: {
          userId: item.pet.ownerId,
          title: '疫苗即将到期',
          content: `${item.pet.name} 的 ${item.vaccineName} 需要续种`,
          type: 'VACCINE',
        },
      }).catch(() => undefined);
    }

    const policies = await this.prisma.insurancePolicy.findMany({
      where: { endDate: { gte: now, lte: addDays(now, 30) } },
      include: { pet: true },
    });
    for (const policy of policies) {
      await this.prisma.notification.create({
        data: {
          userId: policy.pet.ownerId,
          title: '保单即将续保',
          content: `${policy.pet.name} 的 ${policy.provider} 保单即将到期`,
          type: 'INSURANCE',
        },
      }).catch(() => undefined);
    }

    const medications = await this.medicationRepo.findUpcomingEndDates(now, 7);
    for (const med of medications) {
      await this.prisma.notification.create({
        data: {
          userId: med.pet.ownerId,
          title: '用药即将到期',
          content: `${med.pet.name} 的 ${med.name} 用药即将结束，请及时复诊`,
          type: 'MEDICATION',
        },
      }).catch(() => undefined);
    }
  }
}
