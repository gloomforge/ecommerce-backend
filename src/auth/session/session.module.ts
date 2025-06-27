import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, PrismaModule],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}
