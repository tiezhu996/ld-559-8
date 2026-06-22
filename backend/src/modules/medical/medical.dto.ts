import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsEnum, IsInt, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { MedicationFrequency, VisitType } from '../../constants/enums';

export class MedicalMedicationItemDto {
  @IsString() name!: string;
  @IsString() dosage!: string;
  @IsEnum(MedicationFrequency) frequency!: MedicationFrequency;
  @IsInt() @Min(1) durationDays!: number;
  @IsDateString() startDate!: string;
  @IsOptional() @IsString() notes?: string;
}

export class CreateMedicalDto {
  @IsString() petId!: string;
  @IsString() vetId!: string;
  @IsString() clinicId!: string;
  @IsDateString() visitDate!: string;
  @IsEnum(VisitType) type!: VisitType;
  @IsString() diagnosis!: string;
  @IsString() treatment!: string;
  @IsString() prescription!: string;
  @IsNumber() cost!: number;
  @IsOptional() @IsDateString() nextVisitDate?: string;
  @IsOptional() @IsArray() attachments?: string[];
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => MedicalMedicationItemDto) medications?: MedicalMedicationItemDto[];
}

export class UpdateMedicalDto extends CreateMedicalDto {}
