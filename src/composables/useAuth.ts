import { ref, computed } from 'vue';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

const user = ref<User | null>(null);
const loading = ref(true);

export function useAuth() {
  const isAuthenticated = computed(() => !!user.value);

  const initAuth = async () => {
    loading.value = true;
    try {
      const { data } = await supabase.auth.getSession();
      user.value = data.session?.user ?? null;

      supabase.auth.onAuthStateChange((_event, session) => {
        (async () => {
          user.value = session?.user ?? null;
        })();
      });
    } finally {
      loading.value = false;
    }
  };

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return {
    user: computed(() => user.value),
    isAuthenticated,
    loading: computed(() => loading.value),
    initAuth,
    signInWithGoogle,
    signOut,
  };
}
