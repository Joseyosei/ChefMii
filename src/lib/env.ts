const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
] as const;

type EnvVar = (typeof requiredEnvVars)[number];

function getEnvVar(key: EnvVar): string {
  const value = process.env[key] ?? '';

  if (!value) {
    console.error(`Missing required environment variable: ${key}`);
    return '';
  }

  if (key === 'NEXT_PUBLIC_SUPABASE_URL' && !value.startsWith('https://')) {
    console.error(`${key} must start with https://`);
  }

  return value;
}

export const env = {
  get SUPABASE_URL() {
    return getEnvVar('NEXT_PUBLIC_SUPABASE_URL');
  },
  get SUPABASE_PUBLISHABLE_KEY() {
    return getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  },
} as const;

export function validateEnvironment(): boolean {
  try {
    const allValid = requiredEnvVars.every((key) => {
      const value = process.env[key];
      return value && value.length > 0;
    });

    if (!allValid) {
      console.error(
        'Environment validation failed: Some required variables are missing'
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error('Environment validation error:', error);
    return false;
  }
}
