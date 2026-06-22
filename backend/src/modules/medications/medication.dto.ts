import { IsDateString, IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { MedicationFrequency } from '../../constants/enums';

export class CreateMedicationDto {
  @IsString() petId!: string;
  @IsString() medicalRecordId!: string;
  @IsString() name!: string;
  @IsString() dosage!: string;
  @IsEnum(MedicationFrequency) frequency!: MedicationFrequency;
  @IsInt() @Min(1) durationDays!: number;
  @IsDateString() startDate!: string;
  @IsOptional() @IsString() notes?: string;
}

export class UpdateMedicationDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() dosage?: string;
  @IsOptional() @IsEnum(MedicationFrequency) frequency?: MedicationFrequency;
  @IsOptional() @IsInt() @Min(1) durationDays?: number;
  @IsOptional() @IsDateString() startDate?: string;
  @IsOptional() @IsString() notes?: string;
}
