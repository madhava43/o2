# Quick Setup Guide

## Step-by-Step Setup

### 1. Supabase Configuration

1. Go to https://supabase.com and create a new project
2. Wait for project to be provisioned
3. Go to Project Settings > API
4. Copy:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public key** (long JWT token)

### 2. Environment Setup

Create `.env.local` file in project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
JWT_SECRET=create-a-random-secret-key
```

To generate a secure JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Database Schema

The database schema is already created via migrations. You need to run the migration in your Supabase project:

1. Go to Supabase Dashboard > SQL Editor
2. Copy the content from the migration file (shown in the project)
3. Execute the SQL

Or use the Supabase MCP tool if available.

### 4. Create Admin User

After running migrations, insert the default admin:

```sql
INSERT INTO users (email, password_hash, role, full_name, phone, status)
VALUES (
  'admin@gym.com',
  -- Password: Admin@123 (hashed with bcrypt)
  '$2a$10$rK8qK5X5xK5X5xK5X5xK5Ou5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y',
  'admin',
  'System Administrator',
  '+1234567890',
  'active'
) ON CONFLICT (email) DO NOTHING;
```

**IMPORTANT**: The password hash above is a placeholder. You should:
1. Create a real bcrypt hash for your password
2. Or login and change it immediately after first login

To create a proper hash:
```bash
node -e "console.log(require('bcryptjs').hashSync('Admin@123', 10))"
```

### 5. Install Dependencies

```bash
npm install
```

### 6. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

### 7. Login

Use the admin credentials:
- Email: `admin@gym.com`
- Password: `Admin@123`

### 8. Create Test Users

Once logged in as admin:

1. Click "Create User" button
2. Add a trainer:
   - Email: `trainer@gym.com`
   - Password: `Trainer@123`
   - Role: Trainer

3. Add a client:
   - Email: `client@gym.com`
   - Password: `Client@123`
   - Role: Client

### 9. Test All Portals

**Admin Portal:**
- Login as admin@gym.com
- Should redirect to /admin
- Can create users, view stats

**Trainer Portal:**
- Login as trainer@gym.com
- Should redirect to /trainer
- Can view clients (once assigned)

**Client Portal:**
- Login as client@gym.com
- Should redirect to /client
- Can view profile, diet plans, weight logs

## Troubleshooting

### Issue: "Invalid Supabase URL"
- Make sure `.env.local` has correct values
- Restart dev server after changing env vars

### Issue: "Login fails"
- Check if admin user was created in database
- Verify password hash is correct
- Check browser console for errors

### Issue: "Cannot create users"
- Verify you're logged in as admin
- Check Supabase RLS policies are active
- Check JWT token is valid

### Issue: "Build fails"
- Make sure all dependencies are installed
- Check TypeScript errors: `npm run typecheck`
- Verify environment variables are set

## Production Deployment

### Vercel Deployment

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `JWT_SECRET`
4. Deploy

### Environment Variables in Production

Never use default values in production:
- Generate strong JWT_SECRET
- Use production Supabase instance
- Enable all security features

## Security Checklist

- [ ] Changed default admin password
- [ ] Set strong JWT_SECRET
- [ ] Enabled Supabase RLS policies
- [ ] Removed test accounts
- [ ] Configured CORS properly
- [ ] Set up SSL/HTTPS
- [ ] Regular database backups
- [ ] Monitor error logs

## Next Steps

1. Customize branding and colors
2. Add your gym's information
3. Upload real events and gallery images
4. Configure email notifications
5. Set up analytics
6. Add payment integration

## Support

If you encounter issues:
1. Check this guide
2. Review README.md
3. Check Supabase logs
4. Inspect browser console
5. Review API responses

---

Happy Gym Management! 🏋️
