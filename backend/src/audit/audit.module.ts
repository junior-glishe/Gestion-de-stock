import { Module } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { AuditController } from './audit.controller';
import { AuditService } from './audit.service';

@Module({
  controllers: [AuditController],
  providers: [AuditService, AuthGuard],
  exports: [AuditService],
})
export class AuditModule {}
