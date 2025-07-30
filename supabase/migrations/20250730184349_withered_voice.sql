/*
  # Create votes table for hostel election

  1. New Tables
    - `votes`
      - `id` (uuid, primary key)
      - `user_email` (text, unique)
      - `house_number` (integer, 1-4)
      - `preferences` (text array, candidate names in rank order)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `votes` table
    - Add policy for authenticated users to insert their own votes
    - Add policy for authenticated users to read their own votes
*/

CREATE TABLE IF NOT EXISTS votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email text UNIQUE NOT NULL,
  house_number integer NOT NULL CHECK (house_number >= 1 AND house_number <= 4),
  preferences text[] NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Policy for users to insert their own votes
CREATE POLICY "Users can insert their own vote"
  ON votes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.jwt()->>'email' = user_email);

-- Policy for users to read their own votes
CREATE POLICY "Users can read their own vote"
  ON votes
  FOR SELECT
  TO authenticated
  USING (auth.jwt()->>'email' = user_email);

-- Policy for admin access (you can modify the email condition)
CREATE POLICY "Admin can read all votes"
  ON votes
  FOR SELECT
  TO authenticated
  USING (auth.jwt()->>'email' LIKE '%@adypu.edu.in');

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_votes_user_email ON votes(user_email);
CREATE INDEX IF NOT EXISTS idx_votes_house_number ON votes(house_number);
CREATE INDEX IF NOT EXISTS idx_votes_created_at ON votes(created_at);