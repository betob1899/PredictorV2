# Time Predictor Application

A full-stack TypeScript application built with Next.js 14, Supabase, and Vercel for managing time prediction competitions.

## Features

- **User Registration**: Users can register with their name, work area, and submit time predictions
- **Duplicate Prevention**: 
  - Users cannot register twice (same first name + last name)
  - Predictions cannot be duplicated (same time in same session)
- **Admin Panel**: Administrators can create sessions, set start/end times, and view all predictions
- **Winner Calculation**: Automatically determines the user with the closest prediction to the actual elapsed time
- **Session Management**: Multiple independent sessions with their own predictions and results
- **Real-time Data**: All data stored in Supabase with proper Row Level Security (RLS)
- **Validation**: Strict HH:MM time format validation and duplicate checking

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel
- **Styling**: Tailwind CSS

## Prerequisites

- Node.js 18+ and pnpm (or npm/yarn)
- A Supabase account and project
- A Vercel account (for deployment)

## Setup Instructions

### 1. Clone and Install

```bash
# Install dependencies
pnpm install
# or
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor in your Supabase dashboard
3. Copy and paste the contents of `db/schema.sql` into the SQL Editor
4. Execute the SQL script to create all tables, indexes, and RLS policies

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Get your Supabase credentials:
   - Go to your Supabase project settings
   - Navigate to API settings
   - Copy your Project URL and anon/public key

3. Update `.env.local` with your credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 4. Run Development Server

```bash
pnpm dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The application uses three main tables:

### `users`
- Stores user information (name, work area, role)
- Roles: `user` or `admin`

### `sessions`
- Stores time prediction sessions
- Contains start time, end time, and calculated duration
- Created by admin users

### `predictions`
- Stores user predictions for each session
- One prediction per user per session
- Contains predicted time and calculated difference from actual

## Project Structure

```
├── app/
│   ├── actions/          # Server Actions
│   │   ├── users.ts      # User operations
│   │   ├── sessions.ts   # Session operations
│   │   └── predictions.ts # Prediction operations
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main page
├── components/
│   └── pages/            # Page components
│       ├── login-page.tsx
│       ├── user-dashboard.tsx
│       ├── admin-dashboard.tsx
│       └── winner-screen.tsx
├── lib/
│   └── supabase/         # Supabase clients
│       ├── client.ts     # Browser client
│       └── server.ts     # Server client
├── types/                # TypeScript types
│   ├── index.ts         # Application types
│   └── database.ts      # Database types
├── utils/
│   └── time.ts          # Time utility functions
└── db/
    └── schema.sql       # Database schema
```

## Key Functions

### Time Utilities (`utils/time.ts`)

- `isValidTimeFormat(time: string)`: Validates HH:MM format
- `timeToMinutes(time: string)`: Converts HH:MM to minutes
- `minutesToTime(minutes: number)`: Converts minutes to HH:MM
- `calculateDuration(start: string, end: string)`: Calculates duration between two times
- `calculateDifference(predicted: number, actual: number)`: Calculates absolute difference
- `formatDifference(minutes: number)`: Formats difference for display

### Server Actions

All database operations are handled through Server Actions:

- **Users**: `createUser`, `getAllUsers`, `getUserById`
- **Sessions**: `createSession`, `getAllSessions`, `getSessionById`, `getActiveSessions`
- **Predictions**: `createPrediction`, `getPredictionsBySession`, `calculatePredictionDifferences`, `getSessionWinner`

## Deployment to Vercel

1. Push your code to GitHub
2. Import your project in Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

Vercel will automatically detect Next.js and configure the build settings.

## Security

- Row Level Security (RLS) is enabled on all tables
- Users can only create their own predictions
- Admins have full access to sessions and can view all predictions
- All time inputs are validated for HH:MM format
- Server Actions provide server-side validation

## Testing

To test the application:

1. **As Admin**:
   - Create a new session with start and end times
   - View all sessions and predictions
   - Calculate and view the winner

2. **As User**:
   - Register with your information
   - Select a session
   - Submit a time prediction (HH:MM format)
   - View confirmation

3. **Winner Calculation**:
   - Admin selects a session
   - System calculates differences for all predictions
   - Winner is determined by smallest absolute difference

## Troubleshooting

### Database Connection Issues
- Verify your Supabase URL and keys are correct
- Check that the schema has been applied in Supabase
- Ensure RLS policies are active

### Time Format Errors
- Time must be in HH:MM format (24-hour)
- Valid range: 00:00 to 23:59
- Use leading zeros (e.g., 09:05, not 9:5)

### Build Errors
- Ensure all dependencies are installed
- Check TypeScript errors with `pnpm build`
- Verify environment variables are set

## License

MIT

## Support

For issues or questions, please check the code comments or create an issue in the repository.

