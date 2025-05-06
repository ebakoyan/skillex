import * as mysql from 'mysql2/promise';
import { Global, Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
@Global()
export class MySql {
  private connection: mysql.Connection;

  public async getConnection() {
    if (this.connection) {
      return this.connection;
    }

    return this.ensureConnection();
  }

  private get config() {
    const {
      MYSQL_USER: user,
      MYSQL_DB: database,
      MYSQL_PORT: port,
      MYSQL_HOST: host,
      MYSQL_PASSWORD: password,
    } = process.env;

    return { host, user, database, password, port: Number.parseInt(port!) };
  }

  private async ensureConnection() {
    const isConnected = await this.isConnected();
    if (!isConnected) {
      this.connection = await mysql.createConnection(this.config);
    }

    return this.connection;
  }

  private async isConnected() {
    if (!this.connection) {
      return false;
    }

    try {
      await this.connection.query('SELECT 1+1 as result');
      return true;
    } catch {
      return false;
    }
  }
}
