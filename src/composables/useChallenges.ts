import { ref, computed } from 'vue';
import { supabase } from '../lib/supabase';

interface Challenge {
  id: string;
  user_id: string;
  title: string;
  stake_amount: number;
  stake_type: string;
  deadline: string;
  status: 'active' | 'completed' | 'failed' | 'withdrawn';
  created_at: string;
  completed_at: string | null;
  metadata: any;
}

interface ChallengeInsert {
  title: string;
  stake_amount: number;
  stake_type?: string;
  deadline: string;
}

interface TransactionInsert {
  challenge_id: string;
  amount: number;
  type: 'stake' | 'refund' | 'loss' | 'withdrawal';
  status: 'pending' | 'completed' | 'failed';
}

const challenges = ref<Challenge[]>([]);
const loading = ref(false);

export function useChallenges() {
  const activeChallenges = computed(() =>
    challenges.value.filter((c) => c.status === 'active')
  );

  const completedChallenges = computed(() =>
    challenges.value.filter((c) => c.status === 'completed')
  );

  const failedChallenges = computed(() =>
    challenges.value.filter((c) => c.status === 'failed')
  );

  const fetchChallenges = async () => {
    loading.value = true;
    try {
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      challenges.value = data || [];
    } finally {
      loading.value = false;
    }
  };

  const createChallenge = async (challenge: ChallengeInsert) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('challenges')
      .insert({
        ...challenge,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;

    await createTransaction({
      challenge_id: data.id,
      amount: challenge.stake_amount,
      type: 'stake',
      status: 'completed',
    });

    await fetchChallenges();
    return data;
  };

  const updateChallengeStatus = async (
    challengeId: string,
    status: 'completed' | 'failed'
  ) => {
    const { error } = await supabase
      .from('challenges')
      .update({
        status,
        completed_at: new Date().toISOString(),
      })
      .eq('id', challengeId);

    if (error) throw error;

    const challenge = challenges.value.find((c) => c.id === challengeId);
    if (challenge) {
      if (status === 'completed') {
        await createTransaction({
          challenge_id: challengeId,
          amount: challenge.stake_amount,
          type: 'refund',
          status: 'completed',
        });
      } else if (status === 'failed') {
        await createTransaction({
          challenge_id: challengeId,
          amount: challenge.stake_amount,
          type: 'loss',
          status: 'completed',
        });
      }
    }

    await fetchChallenges();
  };

  const createTransaction = async (transaction: TransactionInsert) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase.from('transactions').insert({
      ...transaction,
      user_id: user.id,
    });

    if (error) throw error;
  };

  return {
    challenges: computed(() => challenges.value),
    activeChallenges,
    completedChallenges,
    failedChallenges,
    loading: computed(() => loading.value),
    fetchChallenges,
    createChallenge,
    updateChallengeStatus,
  };
}
