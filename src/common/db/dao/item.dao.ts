import { Injectable } from '@nestjs/common';
import { MySql } from '../mysql';

@Injectable()
export class ItemDao {
  constructor(private readonly mySql: MySql) {}

  async upsertOne(name: string) {
    const connection = await this.mySql.getConnection();

    const [result] = await connection.query<any>(
      'INSERT IGNORE INTO items (name) VALUES (?)',
      [name],
    );

    return result.insertId;
  }

  async findAll() {
    const connection = await this.mySql.getConnection();

    const [rows] = await connection.query<any[]>('SELECT * FROM items');

    return {
      count: rows.length,
      rows: rows.map((row) => this.mapRow(row)),
    };
  }

  private mapRow(row: any) {
    return {
      id: +row.id,
      name: row.name as string,
    };
  }
}
