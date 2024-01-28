import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportsService } from './reports.service';
import { ReportDto } from './dto/report.dto';
import { ApproveReportDto } from './dto/approve-report.dto';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../users/user.entity';
import { CurrentUser } from '../users/docorators/current-user.decorator';
import { Serialize } from '../interceptors/serialize.interceptor';
import { RolesGuard } from '../guards/roles.guard';
import { AccessPermissions } from '../users/docorators/permissions.decorator';
import { GetEstimateDto } from './dto/get-estimate.dto';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('/')
  getEstimate(@Query() query: GetEstimateDto) {
    return this.reportsService.createEstimate(query);
  }

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  createReport(@CurrentUser() user: User, @Body() body: CreateReportDto) {
    return this.reportsService.create(user, body);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @AccessPermissions('approve_report')
  approveReport(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() body: ApproveReportDto,
  ) {
    return this.reportsService.changeApproval(id, body.approved);
  }
}
