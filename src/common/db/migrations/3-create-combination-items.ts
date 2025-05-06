import { Connection } from 'mysql2/promise';

const migration = () => ({
  up: async (connection: Connection) => {
    await connection.query(`
        CREATE TABLE combination_items
        (
            id   INT AUTO_INCREMENT PRIMARY KEY,
            combination_id INT NOT NULL,
            item_id        INT NOT NULL,
            i        INT NOT NULL,
            j        INT NOT NULL,
            FOREIGN KEY (combination_id) REFERENCES combinations (id) ON DELETE CASCADE,
            FOREIGN KEY (item_id) REFERENCES items (id) ON DELETE CASCADE
        );
    `);
  },
});

export default migration;
