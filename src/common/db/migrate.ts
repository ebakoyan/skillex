import * as fs from 'fs';
import * as path from 'path';
import { MySql } from './mysql';

const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

const migrate = async () => {
  const mysql = new MySql();
  const connection = await mysql.getConnection();

  await connection.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      run_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const [rows] = await connection.query('SELECT name FROM migrations');
  const applied = new Set((rows as any[]).map((row) => row.name));

  const filesNames = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((fileName) => fileName.endsWith('.js'))
    .sort();

  for (const fileName of filesNames) {
    if (applied.has(fileName)) {
      console.log(`Migration ${fileName} already applied`);
      continue;
    }

    const migrationPath = path.join(MIGRATIONS_DIR, fileName);
    const migrationModule = require(migrationPath);
    const migration = migrationModule.default();
    await migration.up(connection);

    await connection.query('INSERT INTO migrations (name) VALUES (?)', [
      fileName,
    ]);

    console.log(`Migrated ${fileName}`);
  }

  process.exit(0);
};

migrate();
