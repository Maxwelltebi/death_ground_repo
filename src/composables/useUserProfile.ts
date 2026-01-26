import { ref, computed } from 'vue';
import { supabase } from '../lib/supabase';

interface UserProfile {
  id: string;
  display_name: string | null;
  total_staked: number;
  total_completed: number;
  total_failed: number;
  created_at: string;
  updated_at: string;
}

const profile = ref<UserProfile | null>(null);
const loading = ref(false);

export function useUserProfile() {
  const fetchProfile = async () => {
    loading.value = true;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;
      profile.value = data;
    } finally {
      loading.value = false;
    }
  };

  return {
    profile: computed(() => profile.value),
    loading: computed(() => loading.value),
    fetchProfile,
  };
}
