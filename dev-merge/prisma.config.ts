/**
 * Prisma 7 Configuration File
 * 
 * This file is required for Prisma 7 as the datasource URL
 * is no longer defined in schema.prisma
 * 
 * Place this file in the ROOT of your project (same level as package.json)
 */

import { defineConfig } from 'prisma/config';

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});

