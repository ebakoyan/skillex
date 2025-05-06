import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GenerateDto } from './generate.dto';
import { CombinationService } from '../combination/combination.service';
import { MySql } from '../../common/db/mysql';
import { ResponseDao } from '../../common/db/dao/response.dao';

@Injectable()
export class GenerateService {
  constructor(
    private readonly combinationService: CombinationService,
    private readonly responseDao: ResponseDao,
    private readonly mySql: MySql,
  ) {}

  async generate(dto: GenerateDto) {
    const connection = await this.mySql.getConnection();
    await connection.beginTransaction();

    try {
      const combination = await this.combinationService.upsertOne(
        dto.items,
        dto.length,
      );
      await this.responseDao.createOne(dto, combination.id);

      await connection.commit();

      return combination;
    } catch {
      await connection.rollback();
      throw new InternalServerErrorException();
    }
  }
}
