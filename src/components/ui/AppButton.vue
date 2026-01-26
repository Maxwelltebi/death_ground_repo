<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  fullWidth?: boolean;
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  fullWidth: false,
});
</script>

<template>
  <button
    :class="[
      'btn',
      `btn-${variant}`,
      `btn-${size}`,
      { 'btn-full': fullWidth },
    ]"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<style scoped>
.btn {
  font-family: 'Inter', system-ui, sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
}

.btn-md {
  padding: 0.875rem 2rem;
  font-size: 0.875rem;
}

.btn-lg {
  padding: 1rem 2.5rem;
  font-size: 1rem;
}

.btn-full {
  width: 100%;
}

.btn-primary {
  background: #fff;
  color: #000;
}

.btn-primary:hover:not(:disabled) {
  background: #f0f0f0;
  transform: translateY(-1px);
}

.btn-secondary {
  background: transparent;
  color: #fff;
  border: 2px solid #fff;
}

.btn-secondary:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
}

.btn-danger {
  background: transparent;
  color: #ff4444;
  border: 2px solid #ff4444;
}

.btn-danger:hover:not(:disabled) {
  background: rgba(255, 68, 68, 0.1);
  transform: translateY(-1px);
}

.btn-ghost {
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-ghost:hover:not(:disabled) {
  color: #fff;
  border-color: rgba(255, 255, 255, 0.4);
}
</style>
