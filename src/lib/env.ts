const requiredEnvVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_PUBLISHABLE_KEY',
] as const;

type EnvVar = typeof requiredEnvVars[number];

function getEnvVar(key: EnvVar): string {
  const value = (typeof process !== 'undefined' ? process.env[key] : undefined) || import.meta.env?.[key];
  
  if (!value) {
    console.error(`Missing required environment variable: ${key}`);
    return '';
  }

  if (key === 'VITE_SUPABASE_URL' && !value.startsWith('https://')) {
    console.error(`${key} must start with https://`);
  }

  return value;
}

export const env = {
  get SUPABASE_URL() {
    return getEnvVar('VITE_SUPABASE_URL');
  },
  get SUPABASE_PUBLISHABLE_KEY() {
    return getEnvVar('VITE_SUPABASE_PUBLISHABLE_KEY');
  },
} as const;

export function validateEnvironment(): boolean {
  try {
    const allValid = requiredEnvVars.every(key => {
      const value = (typeof process !== 'undefined' ? process.env[key] : undefined) || import.meta.env?.[key];
      return value && value.length > 0;
    });
    
    if (!allValid) {
      console.error('Environment validation failed: Some required variables are missing');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Environment validation error:', error);
    return false;
  }
}