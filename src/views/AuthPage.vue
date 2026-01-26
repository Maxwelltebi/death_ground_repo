<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import AppButton from '../components/ui/AppButton.vue';
import AppInput from '../components/ui/AppInput.vue';

const router = useRouter();
const { signIn, signUp } = useAuth();

const isLogin = ref(true);
const email = ref('');
const password = ref('');
const displayName = ref('');
const error = ref('');
const loading = ref(false);

const handleSubmit = async () => {
  error.value = '';
  loading.value = true;

  try {
    if (isLogin.value) {
      await signIn(email.value, password.value);
    } else {
      await signUp(email.value, password.value, displayName.value);
    }
    router.push('/dashboard');
  } catch (e: any) {
    error.value = e.message || 'An error occurred';
  } finally {
    loading.value = false;
  }
};

const toggleMode = () => {
  isLogin.value = !isLogin.value;
  error.value = '';
};
</script>

<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-header">
        <h1 class="auth-logo">DEATH GROUND</h1>
        <p class="auth-subtitle">THE LINE</p>
      </div>

      <div class="auth-card">
        <h2 class="auth-title">LOGIN / SIGNUP</h2>
        <p class="auth-description">THE SYSTEM REQUIRES COMMITMENT.</p>

        <form class="auth-form" @submit.prevent="handleSubmit">
          <AppInput
            v-if="!isLogin"
            v-model="displayName"
            label="Display Name"
            placeholder="Enter your name"
            :required="!isLogin"
          />

          <AppInput
            v-model="email"
            type="email"
            label="Email"
            placeholder="Enter your email"
            required
          />

          <AppInput
            v-model="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            required
          />

          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <AppButton
            type="submit"
            variant="primary"
            size="lg"
            full-width
            :disabled="loading"
          >
            {{ loading ? 'PROCESSING...' : isLogin ? 'LOGIN' : 'SIGN UP' }}
          </AppButton>

          <button type="button" class="toggle-mode" @click="toggleMode">
            {{ isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login' }}
          </button>
        </form>

        <div class="auth-lock">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"
            />
          </svg>
          <p class="auth-lock-text">RULES ARE SEALED UPON ENTRY.</p>
        </div>
      </div>

      <footer class="auth-footer">
        <a href="#">TERMS OF ENGAGEMENT</a>
        <span>•</span>
        <a href="#">PRIVACY PROTOCOL</a>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
}

.auth-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 1px;
  height: 100%;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
}

.auth-container {
  max-width: 480px;
  width: 100%;
  position: relative;
  z-index: 1;
}

.auth-header {
  text-align: center;
  margin-bottom: 3rem;
}

.auth-logo {
  font-size: 2rem;
  font-weight: 900;
  color: #fff;
  margin: 0 0 0.5rem 0;
  letter-spacing: 0.1em;
}

.auth-subtitle {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
  letter-spacing: 0.2em;
}

.auth-card {
  background: rgba(10, 10, 10, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 3rem;
}

.auth-title {
  font-size: 1.75rem;
  font-weight: 900;
  color: #fff;
  margin: 0 0 0.5rem 0;
  text-align: center;
  letter-spacing: 0.05em;
}

.auth-description {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.5);
  margin: 0 0 2rem 0;
  text-align: center;
  letter-spacing: 0.1em;
}

.auth-form {
  margin-bottom: 2rem;
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

.toggle-mode {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;
  cursor: pointer;
  display: block;
  width: 100%;
  text-align: center;
  margin-top: 1rem;
  transition: color 0.2s ease;
}

.toggle-mode:hover {
  color: #fff;
}

.auth-lock {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.3);
}

.auth-lock svg {
  margin-bottom: 1rem;
}

.auth-lock-text {
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  margin: 0;
}

.auth-footer {
  text-align: center;
  margin-top: 2rem;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
}

.auth-footer a {
  color: rgba(255, 255, 255, 0.4);
  text-decoration: none;
  transition: color 0.2s ease;
}

.auth-footer a:hover {
  color: #fff;
}

@media (max-width: 640px) {
  .auth-card {
    padding: 2rem 1.5rem;
  }
}
</style>
