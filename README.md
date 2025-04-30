# Mini Job Board

A modern job board application built with Next.js 15, TypeScript, and Supabase, featuring a clean and responsive design.

**Live Demo**: [https://mini-job-board-gules.vercel.app/](https://mini-job-board-gules.vercel.app/)

## Architecture Overview

### Tech Stack
- **Frontend**: Next.js 15.3.1 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Backend/Database**: Supabase
- **Authentication**: Supabase Auth
- **Deployment**: Vercel

### Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Job management dashboard
│   ├── jobs/             # Job viewing pages
│   ├── login/            # Authentication
│   ├── signup/           # User registration
│   └── post-job/         # Job posting form
├── components/           # Shared React components
└── lib/                 # Utilities and type definitions
```

### Key Features
- Server-side rendering for better SEO
- Client-side components for interactive features
- Type-safe database operations
- Protected routes with middleware
- Responsive design with Tailwind CSS

## Development Setup

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- Git

### Environment Setup
1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Get your project credentials:
   - Go to Project Settings > API
   - Copy the `Project URL` (for NEXT_PUBLIC_SUPABASE_URL)
   - Copy the `anon` public API key (for NEXT_PUBLIC_SUPABASE_ANON_KEY)
3. Create a `.env.local` file in the project root:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Database Setup
1. Go to Supabase SQL Editor
2. Run the following SQL commands to create the necessary tables and policies:

```sql
create table jobs (
  id bigint primary key generated always as identity,
  title text not null,
  company text not null,
  description text not null,
  location text not null,
  type text not null check (type in ('Full-Time', 'Part-Time', 'Contract')),
  created_by uuid references auth.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Set up RLS policies
alter table jobs enable row level security;

-- Allow public read access
create policy "Allow public read access"
  on jobs for select
  using (true);

-- Allow authenticated users to create jobs
create policy "Allow authenticated users to create jobs"
  on jobs for insert
  with check (auth.uid() = created_by);

-- Allow users to update their own jobs
create policy "Allow users to update their own jobs"
  on jobs for update
  using (auth.uid() = created_by);

-- Allow users to delete their own jobs
create policy "Allow users to delete their own jobs"
  on jobs for delete
  using (auth.uid() = created_by);
```

### Local Development
1. Clone the repository:
```bash
git clone https://github.com/mfsyahrz/mini_job_board.git
cd mini-job-board
```

2. Install dependencies:
```bash
npm install
```

3. Run development server:
```bash
npm run dev
```
The app will be available at `http://localhost:3000`

4. Build for production:
```bash
npm run build
```

5. Start production server:
```bash
npm start
```

### Authentication Setup
1. Go to Supabase Authentication Settings
2. Enable Email provider under Authentication > Providers
3. (Optional) Configure additional providers like Google, GitHub, etc.
4. Test user signup/login flow at `http://localhost:3000/signup`

### Troubleshooting
- If you encounter CORS issues, ensure your site URL is added to Supabase's API Settings
- For auth issues, check if your environment variables are correctly set
- For database errors, verify that the RLS policies are properly configured

## Development Approach

### Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Job management dashboard
│   ├── jobs/             # Job viewing pages
│   ├── login/            # Authentication
│   ├── signup/           # User registration
│   └── post-job/         # Job posting form
├── components/           # Shared React components
└── lib/                 # Utilities and type definitions
```

The project follows a modular architecture with clear separation of concerns:

- **App Router Organization**: Using Next.js 15 App Router for file-based routing and nested layouts
- **Database Layer**: Centralized Supabase client in `lib/supabaseClient.ts` for all database operations
- **Authentication**: Supabase Auth with context provider pattern in `lib/AuthContext.tsx`
- **Type Safety**: TypeScript interfaces for database schema in `lib/database.types.ts`
- **UI Components**: Reusable components in `components/` directory
- **Styling**: Tailwind CSS with custom utility classes in `globals.css`

### Data Flow

#### Job Listing Flow
```
Client          Homepage            Supabase
  │                │                   │
  │    Visit       │                   │
  │───────────────>│                   │
  │                │    Fetch jobs     │
  │                │──────────────────>│
  │                │   Return list     │
  │                │<──────────────────│
  │   Show jobs    │                   │
  │<───────────────│                   │
  │                │                   │
  │  Click job     │    Job Detail    │
  │───────────────────────────────────>│
  │                │   Fetch details   │
  │                │<─────────────────>│
  │  Show details  │                   │
  │<──────────────────────────────────│
```

#### Authentication Flow
```
Client          Auth Page         Supabase Auth      Context
  │                │                   │                │
  │ Login/Signup   │                   │                │
  │───────────────>│                   │                │
  │                │   Credentials     │                │
  │                │──────────────────>│                │
  │                │  Session token    │                │
  │                │<──────────────────│                │
  │                │                   │  Update state  │
  │                │───────────────────────────────────>│
  │                │                   │   Redirect     │
  │<──────────────────────────────────────────────────│
```

#### Job Management Flow
```
Client          Dashboard           Supabase
  │                │                   │
  │  Create job    │                   │
  │───────────────>│                   │
  │                │   Verify auth     │
  │                │──────────────────>│
  │                │    Confirmed      │
  │                │<──────────────────│
  │                │   Save job        │
  │                │──────────────────>│
  │                │   Success/Error   │
  │                │<──────────────────│
  │  Update UI     │                   │
  │<───────────────│                   │
  │                │                   │
  │            Real-time updates       │
  │<───────────────────────────────────│
```

### Implemented Features

#### Public Features
- View all job listings
- Search and filter jobs by location and type
- Detailed view of individual job posts
- User registration and authentication
- Responsive design for all screen sizes

#### Authenticated Features
- Post new job listings
- Edit existing job posts
- Delete job posts
- Dashboard for managing job posts
- Session management

#### Security Features
- Protected routes with middleware
- Row Level Security in database
- Secure authentication flow
- Input validation and sanitization

#### UI/UX Features
- Loading states and error handling
- Responsive design with Tailwind CSS
- Form validation and error messages
- Confirmation dialogs for destructive actions
- Clean and intuitive navigation

## Future Improvements

Given more development time, these areas could be enhanced:

### Features
- Advanced search with filters (salary range, skills, experience level)
- Support job applications
- Email notifications for job applications and updates
- Resume parsing and applicant tracking
- Job application analytics dashboard

### Technical Enhancements
- Schema normalization: Refactor company and location fields into separate tables to reduce duplication and improve query performance
- Integration testing with Cypress or Playwright
- Unit tests for critical business logic
- Automated accessibility testing
- Performance monitoring with analytics
- CI/CD pipeline improvements
- Cursor-based pagination for job listings

### User Experience
- Enable OAuth providers (Google, Facebook, etc.) for login
- Advanced filtering and sorting options
- Localization for multiple languages
- Rich text editor for job descriptions
- Saved job searches and alerts

### Infrastructure
- Caching layer with Redis
- Full-text search with Elasticsearch
- CDN integration for global performance
- Rate limiting and API security enhancements

## License

MIT



