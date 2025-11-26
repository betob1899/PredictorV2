# Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** in your Supabase dashboard
3. Copy the entire contents of `db/schema.sql`
4. Paste and execute in the SQL Editor
5. Verify tables were created in the **Table Editor**

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Where to find these values:**
- Go to your Supabase project
- Click **Settings** → **API**
- Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- Copy **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4. Run the Application

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Database Schema Verification

After running the SQL script, you should see these tables in Supabase:

- ✅ `users` - User information
- ✅ `sessions` - Time prediction sessions
- ✅ `predictions` - User predictions

## Testing the Application

### As Admin:
1. Click "ADMIN" on the login page
2. Create a new session:
   - Enter session name
   - Enter start time (HH:MM, e.g., 09:00)
   - Enter end time (HH:MM, e.g., 11:30)
   - Click "CREATE"
3. View sessions in the "SESSIONS" tab
4. View predictions in the "PREDICTIONS" tab
5. Select a session and click "SHOW WINNER" to see the winner

### As User:
1. Click "USER" on the login page
2. Fill in your information:
   - First Name
   - Last Name
   - Work Area
   - Select a session
   - Enter time prediction (HH:MM format, e.g., 02:30)
3. Click "SUBMIT"
4. See confirmation message

## Time Format

All times must be in **HH:MM** format (24-hour):
- ✅ Valid: `09:00`, `14:30`, `02:15`
- ❌ Invalid: `9:00`, `14:5`, `25:00`

## Validation Rules

### User Registration
- **No duplicate users**: Cannot register the same user (same first name + last name) twice
- Case-insensitive: "Juan Pérez" and "juan pérez" are considered the same
- Error message: "El usuario [Nombre] [Apellido] ya existe"

### Predictions
- **No duplicate predictions**: Cannot submit the same time prediction for the same session
- If another user already submitted that time, you'll see: "La predicción [HH:MM] ya fue ingresada por otro usuario ([Nombre])"
- Each user can only submit one prediction per session

## Troubleshooting

### "Failed to create user"
- Check your Supabase connection
- Verify environment variables are set correctly
- Check browser console for errors

### "Invalid time format"
- Ensure time is in HH:MM format
- Use leading zeros (09:05, not 9:5)
- Valid range: 00:00 to 23:59

### Database connection errors
- Verify `.env.local` file exists and has correct values
- Restart the dev server after changing environment variables
- Check Supabase project is active

## Deployment to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

Vercel will automatically build and deploy your Next.js application.

