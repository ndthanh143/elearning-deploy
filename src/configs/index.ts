export const configs = {
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
  API_URL: import.meta.env.VITE_API_URL || '',
  API_AUTH_URL: import.meta.env.VITE_API_AUTH_URL || '',
  CLIENT_URL: import.meta.env.VITE_CLIENT_URL || '',
  INVITE_SECRET_KEY: import.meta.env.VITE_INVITE_SECRET_KEY || '',
  VITE_API_UPLOAD_VIDEO: import.meta.env.VITE_API_UPLOAD_VIDEO || '',
  VITE_ADMIN_AUTH_CLIENT_ID: import.meta.env.VITE_ADMIN_AUTH_CLIENT_ID || '',
  VITE_ADMIN_AUTH_CLIENT_SECRET: import.meta.env.VITE_ADMIN_AUTH_CLIENT_SECRET || '',
}
