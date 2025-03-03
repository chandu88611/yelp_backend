import dataSource from '../../../ormconfig';

export const getConnection = async () => {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
    console.log('✅ Database connected successfully!');
  }
  return dataSource;
};