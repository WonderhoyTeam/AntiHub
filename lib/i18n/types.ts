export type Locale = 'en' | 'zh';

export interface Translations {
  common: {
    loading: string;
    error: string;
    success: string;
    confirm: string;
    cancel: string;
    save: string;
    delete: string;
    edit: string;
    add: string;
    search: string;
    filter: string;
    export: string;
    import: string;
    refresh: string;
    close: string;
    back: string;
    next: string;
    previous: string;
    submit: string;
    reset: string;
  };
  nav: {
    dashboard: string;
    accounts: string;
    analytics: string;
    playground: string;
    settings: string;
    help: string;
    profile: string;
  };
  user: {
    profile: string;
    logout: string;
    guest: string;
    notLoggedIn: string;
  };
  dashboard: {
    title: string;
    sharedQuotaPool: string;
    quotaTrend: string;
    sharedPoolModels: string;
  };
  accounts: {
    title: string;
    addAccount: string;
    accountName: string;
    accountType: string;
    status: string;
    actions: string;
    deleteConfirm: string;
    enabled: string;
    disabled: string;
    manage: string;
  };
  analytics: {
    title: string;
    usage: string;
    statistics: string;
  };
  playground: {
    title: string;
  };
  settings: {
    title: string;
    language: string;
    theme: string;
    general: string;
  };
  help: {
    title: string;
    documentation: string;
    support: string;
  };
}

export type TranslationKey = {
  [K in keyof Translations]: {
    [P in keyof Translations[K]]: `${K}.${P & string}`;
  }[keyof Translations[K]];
}[keyof Translations];
