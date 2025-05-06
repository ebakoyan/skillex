import { Connection } from 'mysql2/promise';

const migration = () => ({
  up: async (connection: Connection) => {
    await connection.query(`
        CREATE TABLE combinations
        (
            id INT AUTO_INCREMENT PRIMARY KEY,
            virtual_id VARCHAR(256) NOT NULL UNIQUE
        );
    `);
  },
});

export default migration;
