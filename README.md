# Hostel Election Voting System (EVM)

A full-stack web application for conducting hostel elections with ranked voting system.

## Features

- **Google Authentication** with domain restriction (@adypu.edu.in)
- **House-based Voting** (Houses 1-4) with specific candidates
- **Ranked Preference Voting** system
- **Duplicate Vote Prevention** 
- **Real-time Vote Storage** in Supabase
- **Admin Panel** with CSV export functionality
- **Responsive Design** with Tailwind CSS

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Supabase (Database + Authentication)
- **Routing**: React Router
- **Icons**: Lucide React

## Setup Instructions

### 1. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. In your Supabase dashboard, go to Settings > API to get your:
   - Project URL
   - Anon public key
3. Enable Google OAuth:
   - Go to Authentication > Providers
   - Enable Google provider
   - Add your OAuth credentials
4. Run the migration to create the votes table:
   - Go to SQL Editor in Supabase
   - Copy and paste the contents of `supabase/migrations/create_votes_table.sql`
   - Execute the query

### 2. Environment Variables

1. Copy `.env.example` to `.env`
2. Fill in your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### 3. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add your domain to authorized domains
6. Add redirect URIs:
   - `https://your-project.supabase.co/auth/v1/callback`
   - `http://localhost:5173` (for development)

### 4. Run the Application

```bash
npm install
npm run dev
```

## House Candidates

- **House 1**: Ayush Shukla, Sanket Jha, Abhijeet, Atharv Paharia, Gopi Raman Thakur, Shubh Arya
- **House 2**: Ankit Singh, Ashu Choudhary, Pushkar Sharma, Siddharth Pareek  
- **House 3**: Devansh Saini, Divyansh Choudhary
- **House 4**: Giddalur Jaya Geethika, Isha Singh, Neha Sharma, Nitya Jain

## Usage

1. **Login**: Students sign in with their @adypu.edu.in Google account
2. **House Selection**: Choose their house (1-4)
3. **Voting**: Rank candidates in order of preference
4. **Submit**: Vote is stored securely in Supabase
5. **Admin**: Access `/admin` route to view results and export CSV

## Security Features

- Email domain validation (@adypu.edu.in only)
- Row Level Security (RLS) in database
- One vote per user enforcement
- Secure authentication via Supabase Auth

## Database Schema

```sql
votes (
  id uuid PRIMARY KEY,
  user_email text UNIQUE NOT NULL,
  house_number integer NOT NULL,
  preferences text[] NOT NULL,
  created_at timestamptz DEFAULT now()
)
```

## Admin Panel

Access the admin panel at `/admin` to:
- View voting statistics
- See all submitted votes
- Download results as CSV file

The admin panel is accessible to any authenticated user with a valid @adypu.edu.in email.