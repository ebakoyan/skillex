import { Injectable } from '@nestjs/common';
import { MySql } from '../mysql';

@Injectable()
export class ResponseDao {
  constructor(private readonly mySql: MySql) {}

  async createOne(body: any, combinationId: number) {
    const connection = await this.mySql.getConnection();

    const [result] = await connection.query<any>(
      'INSERT INTO responses (request_body, combination_id) VALUES (?, ?)',
      [JSON.stringify(body), combinationId],
    );

    return result.insertId;
  }
}
