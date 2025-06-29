import { Module } from '@nestjs/common';
import { SessionService } from '@/auth/session/session.service';

@Module({
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}
