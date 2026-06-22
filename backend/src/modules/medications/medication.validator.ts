import { BusinessException } from '../../exceptions/business.exception';

export function validateMedicationDuration(days: number) {
  if (days <= 0) throw new BusinessException('疗程天数必须大于0');
  if (days > 365) throw new BusinessException('疗程天数不能超过365天');
}
