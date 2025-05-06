import { Module } from '@nestjs/common';
import { MySql } from './common/db/mysql';
import { CombinationModule } from './modules/combination/combination.module';
import { GenerateModule } from './modules/generate/generate.module';
import { DaoModule } from './common/db/dao/dao.module';

@Module({
  imports: [CombinationModule, GenerateModule, DaoModule],
  providers: [MySql],
})
export class AppModule {}
