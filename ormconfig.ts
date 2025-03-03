import { DataSource } from 'typeorm';
import config from './src/config';

const dataSource = new DataSource({
  type: 'postgres',
  host: config.DB.HOST,
  port: config.DB.PORT,
  username: config.DB.USER,
  password: config.DB.PASSWORD,
  database: config.DB.NAME,
  synchronize: true,
  logging: false,
  entities: ['src/packages/database/models/*.ts'],
  migrations: ['src/packages/database/migrations/*.ts'],
});

export default dataSource;
