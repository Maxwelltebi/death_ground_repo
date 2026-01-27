<script setup lang="ts">
import { ref } from 'vue';
import { useAuth } from '../composables/useAuth';
import AppButton from '../components/ui/AppButton.vue';

const { signInWithGoogle } = useAuth();

const error = ref('');
const loading = ref(false);

const handleGoogleSignIn = async () => {
  error.value = '';
  loading.value = true;

  try {
    await signInWithGoogle();
  } catch (e: any) {
    error.value = e.message || 'An error occurred';
    loading.value = false;
  }
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

        <div class="auth-form">
          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <AppButton
            variant="primary"
            size="lg"
            full-width
            :disabled="loading"
            @click="handleGoogleSignIn"
          >
            <div class="google-button-content">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {{ loading ? 'CONNECTING...' : 'CONTINUE WITH GOOGLE' }}
            </div>
          </AppButton>
        </div>

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

.google-button-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.google-button-content svg {
  flex-shrink: 0;
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
