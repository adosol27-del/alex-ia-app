
import { createClient } from '@supabase/supabase-js';

// Helper to safely get environment variables
const getEnv = (name: string): string | undefined => {
  try {
    return typeof process !== 'undefined' ? process.env[name] : undefined;
  } catch (e) {
    return undefined;
  }
};

const supabaseUrl = getEnv('SUPABASE_URL');
const supabaseAnonKey = getEnv('SUPABASE_ANON_KEY');

/**
 * Initialize the Supabase client.
 * If credentials are missing, we return a Proxy that throws a helpful error 
 * only when a property is accessed. This prevents the "Uncaught Error: supabaseUrl is required"
 * crash on application startup, allowing the UI to render.
 */
export const supabase = (() => {
  if (supabaseUrl && supabaseAnonKey && supabaseUrl !== '' && supabaseAnonKey !== '') {
    return createClient(supabaseUrl, supabaseAnonKey);
  }

  console.warn("Supabase credentials missing. Database features will be unavailable.");

  return new Proxy({} as any, {
    get: (_, prop) => {
      // Allow some basic checks if necessary, otherwise throw
      if (prop === 'then') return undefined;
      throw new Error(
        `Supabase Configuration Error: 'SUPABASE_URL' and 'SUPABASE_ANON_KEY' environment variables are required. ` +
        `Attempted to access: ${String(prop)}`
      );
    }
  });
})();
