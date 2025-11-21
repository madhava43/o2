=======
# Premium Gym Management System

A comprehensive, modern web application for managing gym operations with role-based access control for Admins, Trainers, and Clients.

## Features

### Authentication & Authorization
- Universal login page with role-based redirects
- JWT-based authentication with bcrypt password hashing
- Secure, protected routes and API validation
- Admin-controlled user creation (no public registration)

### Admin Portal
- Complete dashboard with analytics and statistics
- User management (Create, Edit, Delete users)
- Client and Trainer management
- Diet plan oversight
- Event management
- Enquiry tracking
- System analytics and reporting

### Trainer Portal
- View assigned clients
- Create and manage diet plans
- Track client progress
- Monitor weight logs
- Add training notes

### Client Portal
- View personal profile
- Access diet plans (current and historical)
- Log weight entries
- Track progress with animated charts
- View assigned trainer information
- Download diet plans as PDF

### Premium Homepage
- Professional hero section with call-to-action
- About gym section with premium styling
- Recent events showcase
- Photo & video gallery with lightbox
- Contact form with enquiry submission
- Responsive design across all devices

## Tech Stack

### Frontend
- **Next.js 13** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **shadcn/ui** - Premium UI components
- **Lucide React** - Beautiful icons
- **Recharts** - Data visualization

### Backend
- **Next.js API Routes** - Serverless functions
- **Supabase** - PostgreSQL database with Row Level Security
- **JWT** - Secure authentication tokens
- **bcryptjs** - Password hashing

### Database
- **PostgreSQL** (via Supabase)
- Row Level Security (RLS) enabled
- Comprehensive schema with relationships
- Automated migrations

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Supabase account

### 1. Clone & Install

```bash
git clone <repository-url>
cd premium-gym-management
npm install
```

### 2. Database Setup

1. Create a Supabase project at https://supabase.com
2. Copy your project URL and anon key
3. The database schema has been created with migrations
4. Default admin account is created automatically

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
JWT_SECRET=your-secret-key-for-jwt
```

### 4. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

### 5. Build for Production

```bash
npm run build
npm start
```

## Default Login Credentials

**Admin Account:**
- Email: `admin@gym.com`
- Password: `Admin@123`

Note: Change these credentials immediately after first login in production.

## Project Structure

```
premium-gym-management/
├── app/                      # Next.js App Router
│   ├── (pages)/             # Page routes
│   │   ├── admin/           # Admin portal pages
│   │   ├── trainer/         # Trainer portal pages
│   │   ├── client/          # Client portal pages
│   │   └── login/           # Login page
│   ├── api/                 # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   ├── users/           # User management
│   │   └── enquiries/       # Contact form
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Homepage
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   └── DashboardLayout.tsx  # Shared dashboard layout
├── contexts/                # React contexts
│   └── AuthContext.tsx      # Authentication context
├── lib/                     # Utility libraries
│   ├── auth.ts              # Authentication utilities
│   ├── supabase.ts          # Supabase client
│   └── utils.ts             # Helper functions
├── types/                   # TypeScript type definitions
└── public/                  # Static assets
```

## Database Schema

### Tables

1. **users** - Main authentication and user data
2. **clients** - Extended client information
3. **trainers** - Trainer profiles and details
4. **diet_plans** - Diet plans created by trainers
5. **diet_meals** - Individual meals within diet plans
6. **weight_logs** - Client weight tracking
7. **events** - Gym events and news
8. **enquiries** - Contact form submissions

### Security

- Row Level Security (RLS) enabled on all tables
- Restrictive policies based on user roles
- Admins have full access
- Trainers can only access assigned clients
- Clients can only access their own data

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### User Management (Admin only)
- `GET /api/users` - List all users
- `POST /api/users` - Create new user

### Enquiries
- `POST /api/enquiries` - Submit contact form

## Usage Guide

### For Admins

1. **Login** with admin credentials
2. **Dashboard** shows system statistics
3. **Create Users** - Add new clients or trainers
4. **Manage Clients** - View and edit client information
5. **Assign Trainers** - Link clients with trainers
6. **Monitor Activity** - Track all system activity

### For Trainers

1. **Login** with trainer credentials
2. **View Clients** - See assigned clients
3. **Create Diet Plans** - Design meal plans
4. **Track Progress** - Monitor client weight logs
5. **Add Notes** - Provide feedback to clients

### For Clients

1. **Login** with client credentials
2. **View Profile** - See personal information
3. **Access Diet Plans** - View current and past plans
4. **Log Weight** - Track weight progress
5. **Download Plans** - Export diet plans as PDF

## Deployment

### Vercel (Recommended for Frontend)

1. Push code to GitHub/GitLab
2. Connect repository to Vercel
3. Add environment variables
4. Deploy automatically

### Supabase (Database)

- Already hosted on Supabase
- Automatic backups and scaling
- Built-in security and authentication

## Security Best Practices

1. **Never commit** `.env.local` to version control
2. **Change default** admin password immediately
3. **Use strong passwords** for all accounts
4. **Enable 2FA** on Supabase account
5. **Regular backups** of database
6. **Monitor logs** for suspicious activity
7. **Keep dependencies** updated

## Features Roadmap

- [ ] Payment integration
- [ ] Attendance tracking
- [ ] Exercise library
- [ ] Progress photos
- [ ] Mobile app
- [ ] Email notifications
- [ ] SMS reminders
- [ ] Multi-language support

## Support & Documentation

For issues, questions, or feature requests:
- Check the documentation
- Review the code examples
- Contact support

## License

Proprietary - All rights reserved

## Credits

Built with modern web technologies and best practices for a premium gym management experience.

---

Transform Your Body. Transform Your Life.
>>>>>>> fea7c6c (Initial commit)
