import { LoadStrategy } from '@mikro-orm/core';
import { Migrator } from '@mikro-orm/migrations';
import { defineConfig } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';

export default defineConfig({
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  dbName: process.env.DATABASE_NAME || 'woochelin',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  user: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  debug: process.env.NODE_ENV !== 'production',
  highlighter: new SqlHighlighter(),
  metadataProvider: TsMorphMetadataProvider,
  loadStrategy: LoadStrategy.JOINED,
  extensions: [Migrator],
  migrations: {
    path: './dist/migrations',
    pathTs: './src/migrations',
    tableName: 'mikro_orm_migrations',
    transactional: true,
    disableForeignKeys: false,
    allOrNothing: true,
    dropTables: true,
    safe: false,
    snapshot: true,
  },
  seeder: {
    path: './dist/seeders',
    pathTs: './src/seeders',
  },
  allowGlobalContext: true,
});
