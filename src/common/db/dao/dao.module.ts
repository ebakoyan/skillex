import { Module } from '@nestjs/common';
import { CombinationDao } from './combination.dao';
import { ItemDao } from './item.dao';
import { MySql } from '../mysql';
import { ResponseDao } from './response.dao';

@Module({
  providers: [CombinationDao, ItemDao, MySql, ResponseDao],
  exports: [CombinationDao, ItemDao, MySql, ResponseDao],
})
export class DaoModule {}
