export const config = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1',
  APP_ENV: import.meta.env.MODE || 'development',
} as const;

export default config; 