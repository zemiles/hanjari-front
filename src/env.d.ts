/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 개발 모드는 기본으로 MSW 목업을 켠다. 'false'면 끄고 실제 API(로컬 8080)로 간다 */
  readonly VITE_USE_MOCK?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
