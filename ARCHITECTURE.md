# Death Ground Platform - Architecture Documentation

## Overview

The Death Ground platform is a commitment system where users stake real money on completing tasks. This document explains the architecture, how components connect, and where to make modifications.

## Technology Stack

- **Frontend**: Vue 3 (Composition API) + TypeScript
- **Backend**: Supabase (PostgreSQL + Row Level Security)
- **Routing**: Vue Router
- **Build Tool**: Vite

---

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (buttons, inputs, modals, cards)
│   └── CreateChallengeModal.vue
├── composables/         # State management & business logic
│   ├── useAuth.ts      # Authentication state & operations
│   ├── useChallenges.ts # Challenge CRUD operations
│   └── useUserProfile.ts # User profile data
├── lib/                # Core libraries & configuration
│   └── supabase.ts     # Supabase client initialization
├── router/             # Vue Router configuration
│   └── index.ts        # Route definitions & guards
├── views/              # Page-level components
│   ├── LandingPage.vue
│   ├── AuthPage.vue
│   └── DashboardPage.vue
└── main.ts             # Application entry point
```

---

## Frontend-Backend Connection Points

### 1. Database Connection (`src/lib/supabase.ts`)

**Purpose**: Initialize and export the Supabase client

**Environment Variables Required**:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

**How to Modify**:
```typescript
// To add custom client configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    // Add more auth options here
  },
});
```

---

### 2. Authentication Layer (`src/composables/useAuth.ts`)

**Purpose**: Manages user authentication state and operations

**Key Functions**:
- `initAuth()` - Initialize auth state on app load
- `signInWithGoogle()` - Authenticate using Google OAuth
- `signOut()` - Log out current user

**Backend Connection**:
```typescript
// Google OAuth sign-in
const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
    },
  });
  if (error) throw error;
  return data;
};

// Auth state listener connects to Supabase real-time updates
supabase.auth.onAuthStateChange((_event, session) => {
  user.value = session?.user ?? null;
});
```

**Where Used**:
- `AuthPage.vue` - Google OAuth login
- `DashboardPage.vue` - User info display
- `router/index.ts` - Route protection

**Important Setup**:
Before Google OAuth works, you must configure it in your Supabase dashboard:
1. Go to Authentication > Providers
2. Enable Google provider
3. Add your Google OAuth client ID and secret
4. Add authorized redirect URLs

**How to Modify**:
To add additional OAuth providers:
```typescript
const signInWithGitHub = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
    },
  });
  if (error) throw error;
  return data;
};
```

---

### 3. Challenge Management (`src/composables/useChallenges.ts`)

**Purpose**: Handle all challenge-related database operations

**Key Functions**:
- `fetchChallenges()` - Get all user challenges
- `createChallenge(challenge)` - Create new challenge + transaction
- `updateChallengeStatus(id, status)` - Mark challenge complete/failed

**Backend Connection**:
```typescript
// Fetches from 'challenges' table
const { data } = await supabase
  .from('challenges')
  .select('*')
  .order('created_at', { ascending: false });

// Creates challenge + transaction (two database operations)
await supabase.from('challenges').insert({ ...challenge });
await supabase.from('transactions').insert({ ...transaction });
```

**Database Tables Used**:
- `challenges` - Stores challenge data
- `transactions` - Records financial movements

**Where Used**:
- `DashboardPage.vue` - Display challenges
- `CreateChallengeModal.vue` - Create new challenges
- `ChallengeCard.vue` - Challenge UI with complete/fail actions

**How to Modify**:
To add challenge filtering:
```typescript
const fetchActiveChallenges = async () => {
  const { data, error } = await supabase
    .from('challenges')
    .select('*')
    .eq('status', 'active')
    .order('deadline', { ascending: true });

  if (error) throw error;
  return data;
};
```

---

### 4. User Profile (`src/composables/useUserProfile.ts`)

**Purpose**: Manage user profile data and statistics

**Key Functions**:
- `fetchProfile()` - Get current user's profile

**Backend Connection**:
```typescript
// Fetches from 'user_profiles' table
const { data } = await supabase
  .from('user_profiles')
  .select('*')
  .eq('id', user.id)
  .maybeSingle();
```

**Database Tables Used**:
- `user_profiles` - User statistics (auto-updated by triggers)

**Where Used**:
- `DashboardPage.vue` - Display user stats

**How to Modify**:
To update profile display name:
```typescript
const updateDisplayName = async (newName: string) => {
  const { error } = await supabase
    .from('user_profiles')
    .update({ display_name: newName })
    .eq('id', user.value?.id);

  if (error) throw error;
  await fetchProfile();
};
```

---

## Database Schema

### Tables

#### `challenges`
Stores user commitments with financial stakes.

**Columns**:
- `id` (uuid) - Primary key
- `user_id` (uuid) - References auth.users
- `title` (text) - Challenge description
- `stake_amount` (numeric) - Money at stake
- `stake_type` (text) - Type of stake
- `deadline` (timestamptz) - Completion deadline
- `status` (text) - active | completed | failed | withdrawn
- `created_at` (timestamptz) - Creation timestamp
- `completed_at` (timestamptz) - Completion/failure timestamp
- `metadata` (jsonb) - Additional data

**Row Level Security**:
- Users can only view/edit their own challenges
- Enforced by `auth.uid() = user_id` policies

#### `transactions`
Tracks all financial movements.

**Columns**:
- `id` (uuid) - Primary key
- `user_id` (uuid) - References auth.users
- `challenge_id` (uuid) - Related challenge
- `amount` (numeric) - Transaction amount
- `type` (text) - stake | refund | loss | withdrawal
- `status` (text) - pending | completed | failed
- `created_at` (timestamptz) - Transaction timestamp
- `metadata` (jsonb) - Payment processor info

#### `user_profiles`
Extended user information and statistics.

**Columns**:
- `id` (uuid) - References auth.users
- `display_name` (text) - User's display name
- `total_staked` (numeric) - Current active stakes
- `total_completed` (integer) - Successful challenges
- `total_failed` (integer) - Failed challenges
- `created_at` (timestamptz) - Profile creation
- `updated_at` (timestamptz) - Last update

**Auto-Updates**:
Stats are automatically updated via database triggers when challenge status changes.

---

## Adding New Features

### Example: Add Challenge Comments

#### 1. Create Database Migration

Create new migration via Supabase MCP tool:

```sql
CREATE TABLE IF NOT EXISTS challenge_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id uuid REFERENCES challenges(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  comment text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE challenge_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view comments on their challenges"
  ON challenge_comments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM challenges
      WHERE challenges.id = challenge_comments.challenge_id
      AND challenges.user_id = auth.uid()
    )
  );
```

#### 2. Create Composable

Create `src/composables/useComments.ts`:

```typescript
import { ref } from 'vue';
import { supabase } from '../lib/supabase';

export function useComments(challengeId: string) {
  const comments = ref([]);

  const fetchComments = async () => {
    const { data } = await supabase
      .from('challenge_comments')
      .select('*')
      .eq('challenge_id', challengeId)
      .order('created_at', { ascending: true });

    comments.value = data || [];
  };

  const addComment = async (comment: string) => {
    const { data: { user } } = await supabase.auth.getUser();

    await supabase.from('challenge_comments').insert({
      challenge_id: challengeId,
      user_id: user.id,
      comment,
    });

    await fetchComments();
  };

  return { comments, fetchComments, addComment };
}
```

#### 3. Use in Components

In `ChallengeCard.vue`:

```vue
<script setup>
import { onMounted } from 'vue';
import { useComments } from '../composables/useComments';

const props = defineProps<{ challenge: Challenge }>();
const { comments, fetchComments, addComment } = useComments(props.challenge.id);

onMounted(() => {
  fetchComments();
});
</script>

<template>
  <!-- Add comments section to card -->
  <div class="comments">
    <div v-for="comment in comments" :key="comment.id">
      {{ comment.comment }}
    </div>
  </div>
</template>
```

---

## Security Considerations

### Row Level Security (RLS)

All database tables have RLS enabled. This means:

1. **Users can only access their own data**
   - Enforced at database level, not application level
   - Cannot be bypassed by frontend manipulation

2. **Authentication required for all operations**
   - Unauthenticated requests are automatically rejected

3. **Policy structure**:
   ```sql
   -- Read policy
   CREATE POLICY "name" ON table FOR SELECT
     TO authenticated
     USING (auth.uid() = user_id);

   -- Write policy
   CREATE POLICY "name" ON table FOR INSERT
     TO authenticated
     WITH CHECK (auth.uid() = user_id);
   ```

### Best Practices

1. **Never expose sensitive data in frontend**
   - Use `VITE_SUPABASE_ANON_KEY`, not service role key
   - Service role key bypasses RLS (never use in browser)

2. **Always validate on backend**
   - Frontend validation is UX, not security
   - Database constraints + RLS = actual security

3. **Use typed queries**
   - TypeScript types prevent common errors
   - Auto-completion reduces bugs

---

## Environment Setup

### Required Environment Variables

Create `.env` file in project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Getting Credentials

1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy "Project URL" → `VITE_SUPABASE_URL`
4. Copy "anon public" key → `VITE_SUPABASE_ANON_KEY`

---

## Common Modifications

### Change Challenge Status Options

Edit interface in `useChallenges.ts`:

```typescript
status: 'active' | 'completed' | 'failed' | 'withdrawn' | 'paused';
```

Then update database constraint:

```sql
ALTER TABLE challenges DROP CONSTRAINT challenges_status_check;
ALTER TABLE challenges ADD CONSTRAINT challenges_status_check
  CHECK (status IN ('active', 'completed', 'failed', 'withdrawn', 'paused'));
```

### Add Real-Time Updates

In `useChallenges.ts`:

```typescript
const subscribeToChanges = () => {
  const channel = supabase
    .channel('challenges')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'challenges',
        filter: `user_id=eq.${user.id}`,
      },
      (payload) => {
        fetchChallenges(); // Refresh on any change
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
```

### Customize Stake Types

Edit `CreateChallengeModal.vue`:

```vue
<select v-model="stakeType">
  <option value="personal_loss">Personal Loss</option>
  <option value="public_donation">Public Donation</option>
  <option value="charity">Charity Donation</option>
  <option value="anti_charity">Anti-Charity (donate to cause you oppose)</option>
</select>
```

---

## Testing Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create `.env` with your Supabase credentials

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

---

## Troubleshooting

### Authentication Issues

**Problem**: User not staying logged in
**Solution**: Check `persistSession: true` in `lib/supabase.ts`

### RLS Policy Errors

**Problem**: "Row level security policy" error
**Solution**: Verify policies exist and use `auth.uid()` correctly

### Type Errors

**Problem**: TypeScript complaining about database types
**Solution**: Update interface definitions in composables

### CORS Errors

**Problem**: Requests blocked by CORS
**Solution**: Supabase handles CORS automatically; check URL is correct

---

## Deployment

### Vercel / Netlify

1. Connect repository
2. Add environment variables in dashboard
3. Build command: `npm run build`
4. Output directory: `dist`

### Environment Variables in Production

Set these in your hosting platform:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

---

## Additional Resources

- [Vue 3 Composition API Docs](https://vuejs.org/guide/introduction.html)
- [Supabase JavaScript Client Docs](https://supabase.com/docs/reference/javascript/introduction)
- [Vue Router Docs](https://router.vuejs.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## Support & Contribution

For questions about the architecture or modifications, refer to:
1. This documentation
2. Code comments in composables
3. Supabase dashboard (for database schema)

Keep code modular and follow existing patterns for consistency.
