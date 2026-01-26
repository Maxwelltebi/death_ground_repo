<script setup lang="ts">
interface Props {
  modelValue: string | number;
  type?: string;
  placeholder?: string;
  label?: string;
  error?: string;
  required?: boolean;
  min?: string;
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  required: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: string | number];
}>();
</script>

<template>
  <div class="input-group">
    <label v-if="label" class="input-label">
      {{ label }}
      <span v-if="required" class="required">*</span>
    </label>
    <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :min="min"
      :class="['input', { 'input--error': error }]"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <span v-if="error" class="input-error">{{ error }}</span>
  </div>
</template>

<style scoped>
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

.input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.input:focus {
  outline: none;
  border-color: #fff;
  background: rgba(255, 255, 255, 0.08);
}

.input--error {
  border-color: #ff4444;
}

.input-error {
  display: block;
  font-size: 0.75rem;
  color: #ff4444;
  margin-top: 0.5rem;
}
</style>
