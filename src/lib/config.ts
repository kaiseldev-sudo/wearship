export const config = {
  API_URL: import.meta.env.VITE_API_URL || '/api',
  APP_ENV: import.meta.env.MODE || 'development',
} as const;

export default config; 