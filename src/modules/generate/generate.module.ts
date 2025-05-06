import { Module } from '@nestjs/common';
import { GenerateService } from './generate.service';
import { GenerateController } from './generate.controller';
import { CombinationModule } from '../combination/combination.module';
import { MySql } from '../../common/db/mysql';
import { DaoModule } from '../../common/db/dao/dao.module';

@Module({
  imports: [CombinationModule, DaoModule],
  controllers: [GenerateController],
  providers: [GenerateService, MySql],
})
export class GenerateModule {}
