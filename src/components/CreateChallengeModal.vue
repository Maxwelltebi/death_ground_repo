<script setup lang="ts">
import { ref } from 'vue';
import { useChallenges } from '../composables/useChallenges';
import AppModal from './ui/AppModal.vue';
import AppInput from './ui/AppInput.vue';
import AppButton from './ui/AppButton.vue';

interface Props {
  isOpen: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  close: [];
  created: [];
}>();

const { createChallenge } = useChallenges();

const title = ref('');
const stakeAmount = ref<number>(0);
const stakeType = ref('personal_loss');
const deadline = ref('');
const error = ref('');
const loading = ref(false);

const minDeadline = () => {
  const now = new Date();
  now.setHours(now.getHours() + 1);
  return now.toISOString().slice(0, 16);
};

const handleSubmit = async () => {
  error.value = '';

  if (!title.value || !stakeAmount.value || !deadline.value) {
    error.value = 'All fields are required';
    return;
  }

  if (stakeAmount.value <= 0) {
    error.value = 'Stake amount must be greater than 0';
    return;
  }

  const deadlineDate = new Date(deadline.value);
  const now = new Date();
  if (deadlineDate <= now) {
    error.value = 'Deadline must be in the future';
    return;
  }

  loading.value = true;

  try {
    await createChallenge({
      title: title.value,
      stake_amount: stakeAmount.value,
      stake_type: stakeType.value,
      deadline: deadlineDate.toISOString(),
    });

    title.value = '';
    stakeAmount.value = 0;
    deadline.value = '';
    emit('created');
    emit('close');
  } catch (e: any) {
    error.value = e.message || 'Failed to create challenge';
  } finally {
    loading.value = false;
  }
};

const handleClose = () => {
  if (!loading.value) {
    title.value = '';
    stakeAmount.value = 0;
    deadline.value = '';
    error.value = '';
    emit('close');
  }
};
</script>

<template>
  <AppModal :is-open="isOpen" title="CREATE DEATH GROUND" @close="handleClose">
    <form class="create-form" @submit.prevent="handleSubmit">
      <div class="form-description">
        <p>
          Once created, this commitment cannot be reversed. Failure will result
          in permanent loss of your stake.
        </p>
      </div>

      <AppInput
        v-model="title"
        label="Challenge Title"
        placeholder="e.g., 48H DEEP WORK SPRINT"
        required
      />

      <AppInput
        v-model="stakeAmount"
        type="number"
        label="Stake Amount ($)"
        placeholder="500"
        required
      />

      <div class="input-group">
        <label class="input-label">
          Stake Type
          <span class="required">*</span>
        </label>
        <select v-model="stakeType" class="input select">
          <option value="personal_loss">Personal Loss</option>
          <option value="public_donation">Public Donation</option>
          <option value="charity">Charity Donation</option>
        </select>
      </div>

      <AppInput
        v-model="deadline"
        type="datetime-local"
        label="Deadline"
        :min="minDeadline()"
        required
      />

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <div class="form-actions">
        <AppButton
          type="button"
          variant="ghost"
          size="md"
          full-width
          :disabled="loading"
          @click="handleClose"
        >
          CANCEL
        </AppButton>
        <AppButton
          type="submit"
          variant="danger"
          size="md"
          full-width
          :disabled="loading"
        >
          {{ loading ? 'CREATING...' : 'LOCK IN COMMITMENT' }}
        </AppButton>
      </div>

      <div class="form-warning">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
        </svg>
        <p>This action is irreversible. There are no extensions.</p>
      </div>
    </form>
  </AppModal>
</template>

<style scoped>
.create-form {
  max-width: 100%;
}

.form-description {
  background: rgba(255, 68, 68, 0.1);
  border: 1px solid rgba(255, 68, 68, 0.3);
  padding: 1rem;
  margin-bottom: 2rem;
}

.form-description p {
  margin: 0;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
}

.input-group {
  margin-bottom: 1.5rem;
}

.input-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.required {
  color: #ff4444;
}

.input {
  width: 100%;
  padding: 0.875rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.2s ease;
}

.select {
  cursor: pointer;
}

.select option {
  background: #0a0a0a;
  color: #fff;
}

.input:focus {
  outline: none;
  border-color: #fff;
  background: rgba(255, 255, 255, 0.08);
}

.error-message {
  background: rgba(255, 68, 68, 0.1);
  border: 1px solid rgba(255, 68, 68, 0.3);
  color: #ff4444;
  padding: 1rem;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  text-align: center;
}

.form-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.form-warning {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.5);
}

.form-warning svg {
  flex-shrink: 0;
  color: #ff4444;
}

.form-warning p {
  margin: 0;
  font-size: 0.75rem;
  line-height: 1.4;
}

@media (max-width: 640px) {
  .form-actions {
    grid-template-columns: 1fr;
  }
}
</style>
