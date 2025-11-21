/*
  # Gym Management System Database Schema

  ## Overview
  Complete database schema for a premium gym management system with role-based access control.

  ## New Tables
  
  ### 1. `users` (Main authentication table)
    - `id` (uuid, primary key) - Unique user identifier
    - `email` (text, unique) - User login email
    - `password_hash` (text) - Bcrypt hashed password
    - `role` (text) - User role: 'admin', 'trainer', or 'client'
    - `full_name` (text) - User's full name
    - `phone` (text) - Contact number
    - `status` (text) - Account status: 'active' or 'inactive'
    - `created_at` (timestamptz) - Account creation timestamp
    - `updated_at` (timestamptz) - Last update timestamp

  ### 2. `clients` (Extended client information)
    - `id` (uuid, primary key)
    - `user_id` (uuid, foreign key) - References users table
    - `assigned_trainer_id` (uuid, foreign key) - Assigned trainer
    - `height` (numeric) - Height in cm
    - `current_weight` (numeric) - Current weight in kg
    - `target_weight` (numeric) - Goal weight in kg
    - `medical_notes` (text) - Medical history/conditions
    - `emergency_contact` (text) - Emergency contact details
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  ### 3. `trainers` (Extended trainer information)
    - `id` (uuid, primary key)
    - `user_id` (uuid, foreign key) - References users table
    - `specialization` (text) - Training specialization
    - `experience_years` (integer) - Years of experience
    - `bio` (text) - Trainer biography
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  ### 4. `diet_plans` (Diet plans created by trainers)
    - `id` (uuid, primary key)
    - `client_id` (uuid, foreign key) - Client receiving plan
    - `trainer_id` (uuid, foreign key) - Trainer who created plan
    - `title` (text) - Diet plan title
    - `start_date` (date) - Plan start date
    - `end_date` (date) - Plan end date
    - `status` (text) - 'active' or 'completed'
    - `notes` (text) - General notes about the plan
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  ### 5. `diet_meals` (Individual meals within diet plans)
    - `id` (uuid, primary key)
    - `diet_plan_id` (uuid, foreign key) - Parent diet plan
    - `meal_title` (text) - Meal name (e.g., Breakfast, Lunch)
    - `meal_time` (time) - Scheduled meal time
    - `food_items` (text) - List of food items
    - `calories` (integer) - Total calories
    - `notes` (text) - Meal-specific notes
    - `sort_order` (integer) - Display order
    - `created_at` (timestamptz)

  ### 6. `weight_logs` (Client weight tracking)
    - `id` (uuid, primary key)
    - `client_id` (uuid, foreign key) - Client logging weight
    - `weight` (numeric) - Weight in kg
    - `log_date` (date) - Date of measurement
    - `notes` (text) - Optional notes
    - `created_at` (timestamptz)

  ### 7. `events` (Gym events and news)
    - `id` (uuid, primary key)
    - `title` (text) - Event title
    - `description` (text) - Event description
    - `event_date` (date) - Date of event
    - `image_url` (text) - Featured image URL
    - `gallery_urls` (text[]) - Array of gallery image URLs
    - `status` (text) - 'upcoming' or 'completed'
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  ### 8. `enquiries` (Contact form submissions)
    - `id` (uuid, primary key)
    - `name` (text) - Enquirer's name
    - `email` (text) - Contact email
    - `phone` (text) - Contact phone
    - `interest_type` (text) - Type of interest (personal training, diet, etc.)
    - `preferred_trainer` (text) - Preferred trainer name (optional)
    - `message` (text) - Enquiry message
    - `status` (text) - 'new', 'contacted', or 'resolved'
    - `created_at` (timestamptz)

  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Restrictive policies based on user roles
  - Admin has full access
  - Trainers can only access their assigned clients
  - Clients can only access their own data
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'trainer', 'client')),
  full_name text NOT NULL,
  phone text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assigned_trainer_id uuid REFERENCES users(id) ON DELETE SET NULL,
  height numeric,
  current_weight numeric,
  target_weight numeric,
  medical_notes text DEFAULT '',
  emergency_contact text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create trainers table
CREATE TABLE IF NOT EXISTS trainers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  specialization text DEFAULT '',
  experience_years integer DEFAULT 0,
  bio text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create diet_plans table
CREATE TABLE IF NOT EXISTS diet_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  trainer_id uuid NOT NULL REFERENCES trainers(id) ON DELETE CASCADE,
  title text NOT NULL,
  start_date date NOT NULL,
  end_date date,
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed')),
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create diet_meals table
CREATE TABLE IF NOT EXISTS diet_meals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  diet_plan_id uuid NOT NULL REFERENCES diet_plans(id) ON DELETE CASCADE,
  meal_title text NOT NULL,
  meal_time time NOT NULL,
  food_items text NOT NULL,
  calories integer DEFAULT 0,
  notes text DEFAULT '',
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create weight_logs table
CREATE TABLE IF NOT EXISTS weight_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  weight numeric NOT NULL,
  log_date date NOT NULL DEFAULT CURRENT_DATE,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  event_date date NOT NULL,
  image_url text,
  gallery_urls text[] DEFAULT '{}',
  status text DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'completed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create enquiries table
CREATE TABLE IF NOT EXISTS enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  interest_type text NOT NULL,
  preferred_trainer text,
  message text NOT NULL,
  status text DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'resolved')),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE diet_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE diet_meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE weight_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Admins can insert users"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

CREATE POLICY "Admins can update users"
  ON users FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete users"
  ON users FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

-- RLS Policies for clients table
CREATE POLICY "Admins can view all clients"
  ON clients FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

CREATE POLICY "Trainers can view assigned clients"
  ON clients FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u 
      JOIN trainers t ON t.user_id = u.id
      WHERE u.id = auth.uid() AND t.id = assigned_trainer_id
    )
  );

CREATE POLICY "Clients can view own profile"
  ON clients FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all clients"
  ON clients FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

CREATE POLICY "Trainers can update assigned clients"
  ON clients FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u 
      JOIN trainers t ON t.user_id = u.id
      WHERE u.id = auth.uid() AND t.id = assigned_trainer_id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users u 
      JOIN trainers t ON t.user_id = u.id
      WHERE u.id = auth.uid() AND t.id = assigned_trainer_id
    )
  );

-- RLS Policies for trainers table
CREATE POLICY "Admins can manage trainers"
  ON trainers FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

CREATE POLICY "Trainers can view own profile"
  ON trainers FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "All authenticated can view trainers"
  ON trainers FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for diet_plans table
CREATE POLICY "Admins can view all diet plans"
  ON diet_plans FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

CREATE POLICY "Trainers can view own diet plans"
  ON diet_plans FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trainers t WHERE t.id = trainer_id AND t.user_id = auth.uid()
    )
  );

CREATE POLICY "Clients can view own diet plans"
  ON diet_plans FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM clients c WHERE c.id = client_id AND c.user_id = auth.uid()
    )
  );

CREATE POLICY "Trainers can create diet plans"
  ON diet_plans FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trainers t WHERE t.id = trainer_id AND t.user_id = auth.uid()
    )
  );

CREATE POLICY "Trainers can update own diet plans"
  ON diet_plans FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trainers t WHERE t.id = trainer_id AND t.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trainers t WHERE t.id = trainer_id AND t.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all diet plans"
  ON diet_plans FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

-- RLS Policies for diet_meals table
CREATE POLICY "Users can view meals of accessible diet plans"
  ON diet_meals FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM diet_plans dp
      JOIN clients c ON c.id = dp.client_id
      JOIN trainers t ON t.id = dp.trainer_id
      WHERE dp.id = diet_plan_id
      AND (
        c.user_id = auth.uid() OR
        t.user_id = auth.uid() OR
        EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin')
      )
    )
  );

CREATE POLICY "Trainers can manage meals in own diet plans"
  ON diet_meals FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM diet_plans dp
      JOIN trainers t ON t.id = dp.trainer_id
      WHERE dp.id = diet_plan_id AND t.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM diet_plans dp
      JOIN trainers t ON t.id = dp.trainer_id
      WHERE dp.id = diet_plan_id AND t.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all diet meals"
  ON diet_meals FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

-- RLS Policies for weight_logs table
CREATE POLICY "Admins can view all weight logs"
  ON weight_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

CREATE POLICY "Trainers can view assigned clients' weight logs"
  ON weight_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM clients c
      JOIN trainers t ON t.id = c.assigned_trainer_id
      WHERE c.id = client_id AND t.user_id = auth.uid()
    )
  );

CREATE POLICY "Clients can view own weight logs"
  ON weight_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM clients c WHERE c.id = client_id AND c.user_id = auth.uid()
    )
  );

CREATE POLICY "Clients can insert own weight logs"
  ON weight_logs FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM clients c WHERE c.id = client_id AND c.user_id = auth.uid()
    )
  );

CREATE POLICY "Clients can update own weight logs"
  ON weight_logs FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM clients c WHERE c.id = client_id AND c.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM clients c WHERE c.id = client_id AND c.user_id = auth.uid()
    )
  );

CREATE POLICY "Clients can delete own weight logs"
  ON weight_logs FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM clients c WHERE c.id = client_id AND c.user_id = auth.uid()
    )
  );

-- RLS Policies for events table
CREATE POLICY "Anyone can view events"
  ON events FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage events"
  ON events FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

-- RLS Policies for enquiries table
CREATE POLICY "Anyone can insert enquiries"
  ON enquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view all enquiries"
  ON enquiries FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

CREATE POLICY "Admins can update enquiries"
  ON enquiries FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id);
CREATE INDEX IF NOT EXISTS idx_clients_trainer_id ON clients(assigned_trainer_id);
CREATE INDEX IF NOT EXISTS idx_trainers_user_id ON trainers(user_id);
CREATE INDEX IF NOT EXISTS idx_diet_plans_client_id ON diet_plans(client_id);
CREATE INDEX IF NOT EXISTS idx_diet_plans_trainer_id ON diet_plans(trainer_id);
CREATE INDEX IF NOT EXISTS idx_diet_meals_plan_id ON diet_meals(diet_plan_id);
CREATE INDEX IF NOT EXISTS idx_weight_logs_client_id ON weight_logs(client_id);
CREATE INDEX IF NOT EXISTS idx_weight_logs_date ON weight_logs(log_date);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);
