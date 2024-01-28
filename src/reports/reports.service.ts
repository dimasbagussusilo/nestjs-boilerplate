import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './report.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { User } from '../users/user.entity';
import { GetEstimateDto } from './dto/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  createEstimate(estimateDto: GetEstimateDto) {
    return this.repo
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make LIKE LOWER(:make)', {
        make: `%${estimateDto.make?.toLowerCase() || ''}%`,
      })
      .andWhere('model LIKE LOWER(:model)', {
        model: `%${estimateDto.model?.toLowerCase() || ''}%`,
      })
      .andWhere('longitude - :longitude BETWEEN -5 AND 5', {
        longitude: estimateDto.longitude || 0,
      })
      .andWhere('latitude - :latitude BETWEEN -5 AND 5', {
        latitude: estimateDto.latitude || 0,
      })
      .andWhere('year - :year BETWEEN -:threshold AND :threshold', {
        year: estimateDto.year || 0,
        threshold: estimateDto.year ? 3 : 9999,
      })
      .andWhere('approved IS TRUE')
      .orderBy('ABS(mileage - :mileage)', 'DESC')
      .setParameters({
        mileage: estimateDto.mileage,
      })
      .limit(3)
      .getRawMany();
  }

  create(user: User, reportDto: CreateReportDto) {
    const report = this.repo.create(reportDto);
    report.user = user;

    return this.repo.save(report);
  }

  async changeApproval(id: string, approved: boolean) {
    const report = await this.repo.findOne({ where: { id: +id } });

    if (!report) {
      throw new NotFoundException('report not found');
    }

    report.approved = approved;

    return this.repo.save(report);
  }
}
