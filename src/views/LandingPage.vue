<script setup lang="ts">
import { useRouter } from 'vue-router';
import AppButton from '../components/ui/AppButton.vue';

const router = useRouter();

const navigateToAuth = () => {
  router.push('/auth');
};
</script>

<template>
  <div class="landing">
    <div class="landing__nav">
      <div class="container">
        <div class="nav-content">
          <div class="logo">
            <h1>DEATH GROUND</h1>
            <p class="subtitle">THE LINE</p>
          </div>
          <button class="nav-link" @click="navigateToAuth">
            ENTER THE GROUND →
          </button>
        </div>
      </div>
    </div>

    <div class="hero">
      <div class="container">
        <h1 class="hero__title">DEATH GROUND</h1>
        <p class="hero__subtitle">A SYSTEM THAT MAKES FAILURE IRRATIONAL.</p>

        <div class="hero__actions">
          <AppButton variant="primary" size="lg" @click="navigateToAuth">
            CREATE YOUR DEATH GROUND
          </AppButton>
          <AppButton variant="ghost" size="lg">LEARN HOW IT WORKS</AppButton>
        </div>
      </div>
    </div>

    <div class="features">
      <div class="container">
        <div class="features-grid">
          <div class="feature">
            <div class="feature__icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
              </svg>
            </div>
            <div class="feature__content">
              <h3 class="feature__number">01 // BRUTAL TRUTH</h3>
              <p class="feature__description">
                Self-deception is the ultimate luxury. Most systems allow for
                excuses. Here, inaction has a cost you cannot afford to pay.
              </p>
            </div>
          </div>

          <div class="feature">
            <div class="feature__icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"
                />
              </svg>
            </div>
            <div class="feature__content">
              <h3 class="feature__number">02 // MECHANISM</h3>
              <p class="feature__description">
                The Lock. Once a commitment is entered, the exit is sealed.
                Failure triggers an irreversible consequence managed by the
                protocol.
              </p>
            </div>
          </div>

          <div class="feature">
            <div class="feature__icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                />
              </svg>
            </div>
            <div class="feature__content">
              <h3 class="feature__number">03 // AUTHORITY</h3>
              <p class="feature__description">
                No negotiation. No extensions. The system is autonomous.
                Enforcement is cold, absolute, and indifferent to your
                circumstances.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="cta">
      <div class="container">
        <h2 class="cta__title">DEATH GROUND - WHERE ACHIEVERS ARE MADE.</h2>
        <div class="cta__dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>

    <footer class="footer">
      <div class="container">
        <div class="footer__content">
          <div class="footer__left">
            <span>SYSTEM_STATUS: ACTIVE</span>
            <span>LATENCY: 14MS</span>
          </div>
          <div class="footer__right">
            <span>© 2024 DEATH GROUND LABS</span>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.landing {
  min-height: 100vh;
  background: #000;
  color: #fff;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.landing__nav {
  padding: 1.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.nav-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo h1 {
  font-size: 1.25rem;
  font-weight: 900;
  margin: 0;
  letter-spacing: 0.1em;
}

.subtitle {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  margin: 0.25rem 0 0 0;
  letter-spacing: 0.2em;
}

.nav-link {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.nav-link:hover {
  color: #fff;
}

.hero {
  padding: 8rem 0 6rem 0;
  text-align: center;
  position: relative;
}

.hero::before {
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

.hero__title {
  font-size: clamp(3rem, 10vw, 6rem);
  font-weight: 900;
  margin: 0 0 1rem 0;
  letter-spacing: 0.1em;
  line-height: 1;
}

.hero__subtitle {
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 3rem 0;
  letter-spacing: 0.15em;
}

.hero__actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.features {
  padding: 6rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
}

.feature {
  display: flex;
  gap: 1.5rem;
}

.feature__icon {
  width: 60px;
  height: 60px;
  background: rgba(255, 68, 68, 0.1);
  border: 1px solid rgba(255, 68, 68, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ff4444;
  flex-shrink: 0;
}

.feature__content {
  flex: 1;
}

.feature__number {
  font-size: 0.875rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.5);
  margin: 0 0 1rem 0;
  letter-spacing: 0.1em;
}

.feature__description {
  font-size: 0.9375rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  margin: 0;
}

.cta {
  padding: 6rem 0;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.cta__title {
  font-size: clamp(1.5rem, 5vw, 2.5rem);
  font-weight: 900;
  margin: 0 0 2rem 0;
  letter-spacing: 0.05em;
}

.cta__dots {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.cta__dots span {
  width: 8px;
  height: 8px;
  background: #ff4444;
  border-radius: 50%;
}

.footer {
  padding: 2rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer__content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 0.05em;
}

.footer__left {
  display: flex;
  gap: 2rem;
}

@media (max-width: 768px) {
  .hero {
    padding: 4rem 0 3rem 0;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .footer__content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .footer__left {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
