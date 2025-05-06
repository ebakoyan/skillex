import { Injectable } from '@nestjs/common';
import { NUMBER_TO_LETTER_MAP } from '../../common/utils/constants';
import { CombinationDao } from '../../common/db/dao/combination.dao';
import { ItemDao } from '../../common/db/dao/item.dao';

@Injectable()
export class CombinationService {
  constructor(
    private readonly combinationDao: CombinationDao,
    private readonly itemDao: ItemDao,
  ) {}

  async upsertOne(numbers: number[], length: number) {
    const virtualKey = `${numbers.join('-')}-length-${length}`;
    let combinationId: number | null = null;

    combinationId = await this.combinationDao.getIdByVirtualId(virtualKey);
    if (combinationId) {
      return this.combinationDao.getOne(combinationId);
    }

    const combination = this.generateCombinations(numbers, length);
    await Promise.all(
      combination
        .flat()
        .map(async (combinationItem) =>
          this.itemDao.upsertOne(combinationItem),
        ),
    );

    combinationId = await this.combinationDao.create(combination, virtualKey);

    return this.combinationDao.getOne(combinationId);
  }

  generateCombinations(numbers: number[], length: number) {
    return this.makeValidCombinations(this.buildItems(numbers), length);
  }

  private buildItems(numbers: number[]): string[] {
    return numbers
      .map((number, index) => {
        const letter = NUMBER_TO_LETTER_MAP.get(index + 1) as string;
        const targetResult: string[] = [];

        for (let i = 1; i <= number; i++) {
          targetResult.push(`${letter}${i}`);
        }

        return targetResult;
      })
      .flat();
  }

  private makeValidCombinations(items: string[], length: number): string[][] {
    const result: string[][] = [];

    const backtrack = (start: number, path: string[]) => {
      if (path.length === length) {
        result.push([...path]);

        return;
      }

      for (let i = start; i < items.length; i++) {
        if (path.some((p) => p[0] === items[i][0])) {
          continue;
        }

        path.push(items[i]);
        backtrack(i + 1, path);
        path.pop();
      }
    };

    backtrack(0, []);

    return result;
  }
}
