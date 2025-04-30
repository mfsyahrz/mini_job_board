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
2. Create a `.env.local` file:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Database Setup
Create the following tables in Supabase:

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

### Installation Steps

1. Clone the repository:
```bash
git clone https://github.com/mfsyahrz/mini_job_board.git
cd mini-job-board
```2. Install dependencies:
```bash
npm install
```
3. Run development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

5. Start production server:
```bash
npm start
```

## Development Approach

### Component Architecture
- **Server Components**: Used for static content and initial data fetching
- **Client Components**: Used for interactive features and forms
- **Shared Components**: Reusable UI elements like ConfirmDialog

### State Management
- Local state with React hooks for form handling
- Supabase real-time subscriptions for auth state
- Server-side state management with Next.js App Router

### Authentication Flow
1. User signs up/logs in using Supabase Auth
2. JWT tokens stored securely in cookies
3. Protected routes handled by middleware
4. User state managed through AuthContext

### Data Fetching Strategy
- Server-side fetching for initial page loads
- Client-side fetching for dynamic updates
- Error boundaries for graceful error handling

## Production Considerations

### Performance
- Static page generation where possible
- Dynamic routes for user-specific content
- Image optimization with Next.js Image
- Tailwind CSS for minimal CSS bundle

### Security
- Environment variables for sensitive data
- Row Level Security in Supabase
- Protected API routes
- Type-safe database operations

### SEO
- Server-side rendering for better indexing
- Dynamic metadata for job listings
- Semantic HTML structure

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



