/// <reference types="astro/client" />
/// <reference path="../.astro/types.d.ts" />
/// <reference types="@astrojs/cloudflare" />

interface ImportMetaEnv {
  readonly MEILI_MASTER_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Cloudflare Runtime 类型定义
declare namespace App {
  interface Locals {
    runtime: {
      env: {
        DB: D1Database;
        KV: KVNamespace;
      };
    };
  }
}
