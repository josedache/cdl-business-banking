export const PRODUCTION = import.meta.env.PROD;
export const DEVELOPMENT = import.meta.env.DEV;
export const AES_ENCRYPTION_KEY = import.meta.env.VITE_AES_ENCRYPTION_KEY;
export const AES_ENCRYPTION_IV = import.meta.env.VITE_AES_ENCRYPTION_IV;
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
export const CDL_IAGREE_INLINE_JS = import.meta.env.VITE_CDL_IAGREE_INLINE_JS;
export const CDL_IAGREE_INLINE_MODE = import.meta.env
  .VITE_CDL_IAGREE_INLINE_MODE;
export const CDL_IAGREE_INLINE_BASE_URL = import.meta.env
  .VITE_CDL_IAGREE_INLINE_BASE_URL;
export const SENTRY_AUTH_TOKEN = import.meta.env.VITE_SENTRY_AUTH_TOKEN;
export const SENTRY_DSN_TOKEN = import.meta.env.VITE_SENTRY_DSN_TOKEN;
export const SENTRY_PROPAGATION_TARGETS_URLS: string[] =
  import.meta.env.VITE_SENTRY_PROPAGATION_TARGETS_URLS?.split(",");
export const MIXPANEL_TOKEN = import.meta.env.VITE_MIXPANEL_TOKEN;
