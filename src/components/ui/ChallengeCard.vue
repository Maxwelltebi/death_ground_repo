<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import AppButton from './AppButton.vue';

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

interface Props {
  challenge: Challenge;
  showActions?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showActions: true,
});

const emit = defineEmits<{
  complete: [id: string];
  fail: [id: string];
}>();

const timeRemaining = ref('');
let intervalId: number | null = null;

const updateCountdown = () => {
  const now = new Date().getTime();
  const deadline = new Date(props.challenge.deadline).getTime();
  const distance = deadline - now;

  if (distance < 0) {
    timeRemaining.value = '00:00:00';
    return;
  }

  const hours = Math.floor(distance / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  timeRemaining.value = `${String(hours).padStart(2, '0')}:${String(
    minutes
  ).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const statusMessage = computed(() => {
  if (props.challenge.status === 'active') {
    return 'DEADLINE APPROACHING';
  } else if (props.challenge.status === 'completed') {
    return 'ACHIEVED';
  } else if (props.challenge.status === 'failed') {
    return 'FAILED';
  }
  return '';
});

onMounted(() => {
  if (props.challenge.status === 'active') {
    updateCountdown();
    intervalId = window.setInterval(updateCountdown, 1000);
  }
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});
</script>

<template>
  <div :class="['challenge-card', `challenge-card--${challenge.status}`]">
    <div class="challenge-card__header">
      <div class="challenge-card__icon">
        <svg
          v-if="challenge.status === 'active'"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            d="M12 2C11.172 2 10.5 2.672 10.5 3.5V4.5C10.5 5.328 11.172 6 12 6C12.828 6 13.5 5.328 13.5 4.5V3.5C13.5 2.672 12.828 2 12 2ZM19 11H17C16.172 11 15.5 11.672 15.5 12.5C15.5 13.328 16.172 14 17 14H19C19.828 14 20.5 13.328 20.5 12.5C20.5 11.672 19.828 11 19 11ZM7 11H5C4.172 11 3.5 11.672 3.5 12.5C3.5 13.328 4.172 14 5 14H7C7.828 14 8.5 13.328 8.5 12.5C8.5 11.672 7.828 11 7 11ZM12 8C9.794 8 8 9.794 8 12C8 14.206 9.794 16 12 16C14.206 16 16 14.206 16 12C16 9.794 14.206 8 12 8ZM12 18C11.172 18 10.5 18.672 10.5 19.5V20.5C10.5 21.328 11.172 22 12 22C12.828 22 13.5 21.328 13.5 20.5V19.5C13.5 18.672 12.828 18 12 18Z"
          />
        </svg>
        <svg
          v-else-if="challenge.status === 'completed'"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
        </svg>
        <svg
          v-else-if="challenge.status === 'failed'"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
          />
        </svg>
      </div>
      <div class="challenge-card__info">
        <h3 class="challenge-card__title">{{ challenge.title }}</h3>
        <p class="challenge-card__stake">
          STAKE: ${{ challenge.stake_amount.toLocaleString() }}
          {{ challenge.stake_type.toUpperCase().replace('_', ' ') }}
        </p>
      </div>
      <div class="challenge-card__timer">
        <div class="timer">{{ timeRemaining }}</div>
        <div class="timer-label">{{ statusMessage }}</div>
      </div>
    </div>

    <div v-if="showActions && challenge.status === 'active'" class="challenge-card__actions">
      <AppButton
        variant="secondary"
        size="md"
        full-width
        @click="emit('complete', challenge.id)"
      >
        CONFIRM COMPLETION
      </AppButton>
      <AppButton
        variant="danger"
        size="md"
        full-width
        @click="emit('fail', challenge.id)"
      >
        ADMIT FAILURE
      </AppButton>
    </div>
  </div>
</template>

<style scoped>
.challenge-card {
  background: rgba(20, 20, 20, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2rem;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
}

.challenge-card:hover {
  border-color: rgba(255, 255, 255, 0.2);
  background: rgba(25, 25, 25, 0.9);
}

.challenge-card--completed {
  border-color: rgba(76, 175, 80, 0.3);
}

.challenge-card--failed {
  border-color: rgba(255, 68, 68, 0.3);
}

.challenge-card__header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.challenge-card__icon {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ff4444;
  flex-shrink: 0;
}

.challenge-card--completed .challenge-card__icon {
  color: #4caf50;
}

.challenge-card--failed .challenge-card__icon {
  color: #ff4444;
}

.challenge-card__info {
  flex: 1;
  min-width: 0;
}

.challenge-card__title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 0.5rem 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.challenge-card__stake {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.challenge-card__timer {
  text-align: right;
  flex-shrink: 0;
}

.timer {
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  font-family: 'Courier New', monospace;
  letter-spacing: 0.1em;
}

.timer-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.challenge-card__actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

@media (max-width: 768px) {
  .challenge-card__header {
    flex-wrap: wrap;
  }

  .challenge-card__timer {
    width: 100%;
    text-align: left;
    margin-top: 1rem;
  }

  .challenge-card__actions {
    grid-template-columns: 1fr;
  }
}
</style>
