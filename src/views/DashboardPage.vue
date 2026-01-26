<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { useChallenges } from '../composables/useChallenges';
import { useUserProfile } from '../composables/useUserProfile';
import AppButton from '../components/ui/AppButton.vue';
import ChallengeCard from '../components/ui/ChallengeCard.vue';
import CreateChallengeModal from '../components/CreateChallengeModal.vue';

const router = useRouter();
const { signOut } = useAuth();
const {
  activeChallenges,
  completedChallenges,
  failedChallenges,
  fetchChallenges,
  updateChallengeStatus,
} = useChallenges();
const { profile, fetchProfile } = useUserProfile();

const showCreateModal = ref(false);

const pastChallenges = computed(() => [
  ...completedChallenges.value,
  ...failedChallenges.value,
]);

const handleLogout = async () => {
  await signOut();
  router.push('/');
};

const handleComplete = async (challengeId: string) => {
  if (confirm('Are you sure you want to mark this challenge as completed?')) {
    await updateChallengeStatus(challengeId, 'completed');
  }
};

const handleFail = async (challengeId: string) => {
  if (
    confirm(
      'Are you sure you want to admit failure? Your stake will be lost forever.'
    )
  ) {
    await updateChallengeStatus(challengeId, 'failed');
  }
};

onMounted(async () => {
  await fetchChallenges();
  await fetchProfile();
});
</script>

<template>
  <div class="dashboard">
    <nav class="dashboard-nav">
      <div class="container">
        <div class="nav-content">
          <div class="logo">
            <h1>DEATH GROUND</h1>
            <p class="subtitle">THE LINE</p>
          </div>
          <div class="nav-actions">
            <span v-if="profile" class="user-stats">
              {{ profile.total_completed }} SURVIVED / {{ profile.total_failed }} KILLED
            </span>
            <button class="nav-button" @click="handleLogout">LOGOUT</button>
          </div>
        </div>
      </div>
    </nav>

    <div class="dashboard-header">
      <div class="container">
        <h1 class="page-title">OPERATIONS</h1>
        <div class="header-stats">
          <span class="stat">
            {{ activeChallenges.length + pastChallenges.length }} SURVIVED
          </span>
          <span class="stat-divider">/</span>
          <span class="stat stat--danger">{{ failedChallenges.length }} KILLED</span>
        </div>
        <AppButton variant="danger" size="lg" @click="showCreateModal = true">
          CREATE YOUR DEATH GROUND
        </AppButton>
      </div>
    </div>

    <div class="dashboard-content">
      <div class="container">
        <section class="challenges-section">
          <h2 class="section-title">ACTIVE CHALLENGES</h2>

          <div v-if="activeChallenges.length === 0" class="empty-state">
            <p>No active challenges. Create your first Death Ground to begin.</p>
          </div>

          <ChallengeCard
            v-for="challenge in activeChallenges"
            :key="challenge.id"
            :challenge="challenge"
            @complete="handleComplete"
            @fail="handleFail"
          />
        </section>

        <section v-if="pastChallenges.length > 0" class="challenges-section">
          <h2 class="section-title">THE AFTERMATH</h2>

          <ChallengeCard
            v-for="challenge in pastChallenges"
            :key="challenge.id"
            :challenge="challenge"
            :show-actions="false"
          />

          <div class="view-more">
            <button class="view-more-button">VIEW FULL KILL RECORD →</button>
          </div>
        </section>
      </div>
    </div>

    <footer class="dashboard-footer">
      <div class="container">
        <p class="footer-text">COMMITMENT IS IRREVERSIBLE</p>
      </div>
    </footer>

    <CreateChallengeModal
      :is-open="showCreateModal"
      @close="showCreateModal = false"
      @created="fetchChallenges"
    />
  </div>
</template>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: #000;
  color: #fff;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.dashboard-nav {
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

.nav-actions {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.user-stats {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 0.05em;
}

.nav-button {
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

.nav-button:hover {
  color: #fff;
}

.dashboard-header {
  padding: 3rem 0;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.page-title {
  font-size: 3rem;
  font-weight: 900;
  margin: 0 0 1rem 0;
  letter-spacing: 0.1em;
}

.header-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  font-size: 1.125rem;
  font-weight: 600;
  letter-spacing: 0.05em;
}

.stat {
  color: rgba(255, 255, 255, 0.8);
}

.stat--danger {
  color: #ff4444;
}

.stat-divider {
  color: rgba(255, 255, 255, 0.3);
}

.dashboard-content {
  padding: 3rem 0;
}

.challenges-section {
  margin-bottom: 4rem;
}

.section-title {
  font-size: 1rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.5);
  margin: 0 0 2rem 0;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: rgba(255, 255, 255, 0.5);
  font-size: 1.125rem;
}

.view-more {
  text-align: center;
  margin-top: 2rem;
}

.view-more-button {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.view-more-button:hover {
  color: #fff;
}

.dashboard-footer {
  padding: 3rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
}

.footer-text {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.4);
  margin: 0;
  letter-spacing: 0.2em;
}

@media (max-width: 768px) {
  .nav-content {
    flex-direction: column;
    gap: 1rem;
  }

  .page-title {
    font-size: 2rem;
  }

  .header-stats {
    flex-direction: column;
    gap: 0.5rem;
  }

  .stat-divider {
    display: none;
  }
}
</style>
