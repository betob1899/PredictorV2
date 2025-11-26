# Database Initialization Script

## Instructions

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy the entire contents of `db/schema.sql`
5. Paste into the SQL Editor
6. Click **Run** or press `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)

## Verification

After running the script, verify the following:

### Tables Created
- ✅ `users` table exists
- ✅ `sessions` table exists
- ✅ `predictions` table exists

### Policies Created
- ✅ RLS is enabled on all tables
- ✅ Policies are active

### Functions Created
- ✅ `update_updated_at_column()` function exists
- ✅ `get_session_winner()` function exists

## Testing the Schema

You can test by running these queries in the SQL Editor:

```sql
-- Test user creation
INSERT INTO users (first_name, last_name, work_area, role)
VALUES ('Test', 'User', 'Testing', 'user')
RETURNING *;

-- Test session creation (replace user_id with actual ID)
INSERT INTO sessions (name, start_time, end_time, actual_duration_minutes, created_by)
VALUES ('Test Session', '09:00', '11:30', 150, 'your-user-id-here')
RETURNING *;
```

If these queries work, your schema is set up correctly!

