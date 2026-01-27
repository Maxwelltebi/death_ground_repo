# Death Ground - Commitment Platform

A commitment system where users stake real money on completing their tasks. When users complete their challenges, they can withdraw their money. If they fail or admit failure, they lose their stake.

## Technology Stack

- **Frontend**: Vue 3 (Composition API) + TypeScript
- **Backend**: Supabase (PostgreSQL + Authentication + Row Level Security)
- **Build Tool**: Vite
- **Routing**: Vue Router

## Getting Started

### Prerequisites

- Node.js 16+ installed
- A Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Get these values from your Supabase project:
- Go to Project Settings > API
- Copy "Project URL" and "anon public" key

4. Run the development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base components (buttons, inputs, modals)
│   └── CreateChallengeModal.vue
├── composables/         # Vue composables for state & logic
│   ├── useAuth.ts      # Authentication
│   ├── useChallenges.ts # Challenge management
│   └── useUserProfile.ts # User profile
├── lib/                # Core configuration
│   └── supabase.ts     # Supabase client
├── router/             # Vue Router setup
├── types/              # TypeScript types
├── views/              # Page components
└── main.ts             # App entry point
```

## Architecture

For detailed information about the architecture and how to modify the platform, see [ARCHITECTURE.md](./ARCHITECTURE.md).

Key connection points:
- **Authentication**: `src/composables/useAuth.ts`
- **Challenges**: `src/composables/useChallenges.ts`
- **Database**: PostgreSQL via Supabase with Row Level Security
- **Types**: `src/types/database.ts`

## Features

- User authentication (Google OAuth)
- Create challenges with monetary stakes
- Real-time countdown timers
- Complete or fail challenges
- Track statistics (completed vs failed)
- Automatic transaction recording
- Secure data with Row Level Security

## Database Schema

The platform uses three main tables:

1. **challenges** - User commitments with stakes
2. **transactions** - Financial movement tracking
3. **user_profiles** - User stats and info

All tables are protected with Row Level Security, ensuring users can only access their own data.

## Development

### Adding New Features

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed instructions on:
- Adding new database tables
- Creating new composables
- Implementing new UI components
- Modifying existing features

### Code Style

- Modular, single-responsibility components
- TypeScript for type safety
- Composition API with `<script setup>`
- Scoped styles in Vue components

## Security

- All database access is protected by Row Level Security
- Authentication required for all operations
- Users can only access their own data
- Environment variables for sensitive data

## License

See LICENSE file for details.
