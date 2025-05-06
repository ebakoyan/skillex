import { Module } from '@nestjs/common';
import { CombinationService } from './combination.service';
import { DaoModule } from '../../common/db/dao/dao.module';

@Module({
  imports: [DaoModule],
  providers: [CombinationService],
  exports: [CombinationService],
})
export class CombinationModule {}
