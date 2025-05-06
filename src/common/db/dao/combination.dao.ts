import { Injectable } from '@nestjs/common';
import { MySql } from '../mysql';
import { ItemDao } from './item.dao';

@Injectable()
export class CombinationDao {
  constructor(
    private readonly mySql: MySql,
    private readonly itemDao: ItemDao,
  ) {}

  async getIdByVirtualId(virtualId: string): Promise<number | null> {
    const connection = await this.mySql.getConnection();

    const [rows] = await connection.query<any[]>(
      'SELECT id FROM combinations WHERE virtual_id = ?',
      [virtualId],
    );

    if (rows?.length) {
      return +rows[0].id;
    }

    return null;
  }

  async getOne(id: number) {
    const connection = await this.mySql.getConnection();

    const [combination] = await connection.query<any[]>(
      'SELECT * FROM combinations WHERE id = ?',
      [id],
    );
    const [combinationItems] = await connection.query<any[]>(
      `SELECT *
       FROM combination_items
                INNER JOIN items
                           ON combination_items.item_id = items.id
       WHERE combination_id = ?
      `,
      [id],
    );

    return this.mapRows(combinationItems, id);
  }

  async create(combinations: string[][], virtualId): Promise<number> {
    const connection = await this.mySql.getConnection();

    const [result] = await connection.query<any>(
      'INSERT INTO combinations (virtual_id) VALUES (?)',
      [virtualId],
    );

    const combinationId = result.insertId;

    // Yes, this can be optimized and executed as a single query. I Know that.)))
    const { rows: items } = await this.itemDao.findAll();
    const itemNameIdMap = new Map(items.map((item) => [item.name, item.id]));
    await Promise.all(
      combinations.map(async (combination, i) => {
        const itemIds = combination.map((combinationNameItem) =>
          itemNameIdMap.get(combinationNameItem),
        );

        const combinationItems = itemIds.map((itemId, j) => ({
          combination_id: combinationId,
          item_id: itemId,
          i,
          j,
        }));

        await connection.query(
          'INSERT INTO combination_items (combination_id, item_id, i, j) VALUES ?',
          [combinationItems.map((item) => Object.values(item))],
        );
      }),
    );

    return combinationId;
  }

  private mapRows(combinationItems: any[], combinationId: number) {
    const combination = [];
    combinationItems.forEach((item: any) => {
      const target: any[] = (combination[item.i] = combination[item.i] || []);
      target[item.j] = item.name;
    });

    return {
      id: combinationId,
      combination,
    };
  }
}
