import { Connection } from 'mysql2/promise';

const migration = () => ({
  up: async (connection: Connection) => {
    await connection.query(`
        CREATE TABLE responses
        (
            id           INT AUTO_INCREMENT PRIMARY KEY,
            combination_id INT NOT NULL,
            FOREIGN KEY (combination_id) REFERENCES combinations (id) ON DELETE CASCADE,
            request_body JSON NOT NULL
        );

    `);
  },
});

export default migration;
