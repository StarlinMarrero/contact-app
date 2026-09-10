import path from 'path';
import type { DataSourceOptions } from 'typeorm';
import { env } from '../../config/env';

const ormconfig: DataSourceOptions = {
  type: 'postgres',
  host: env.DATABASE_HOST,
  port: env.DATABASE_PORT,
  username: env.DATABASE_USERNAME,
  password: env.DATABASE_PASSWORD,
  database: env.DATABASE_DATABASE,
  schema: env.DATABASE_SCHEMA,
  ssl: env.DATABASE_SSL,
  logging: env.DATABASE_LOGGING,
  synchronize: false,
  entities: [path.join(__dirname, '../entities/entity/*.entity.{ts,js}')],
  migrations: [path.join(__dirname, '../migrations/*.{ts,js}')],
};

export default ormconfig;
