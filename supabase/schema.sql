-- 1. CLEANUP (Wipe the slate clean)
DROP TABLE IF EXISTS blocks, private_messages, messages, rooms, user_settings, profiles CASCADE;

-- 2. TABLES
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  email TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE user_settings (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  allow_private_messages BOOLEAN DEFAULT true NOT NULL,
  max_rooms_allowed INTEGER DEFAULT 3 NOT NULL,
  is_admin BOOLEAN DEFAULT false NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_by UUID REFERENCES profiles(id) ON DELETE CASCADE,
  is_private BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE private_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE blocks (
  blocker_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  blocked_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (blocker_id, blocked_id)
);

-- 3. ENABLE RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE private_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;

-- 4. POLICIES (Simplified & Hardened)

-- Profiles
CREATE POLICY "Profiles viewable by authenticated" ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Settings
CREATE POLICY "Users view own settings" ON user_settings FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users update own settings" ON user_settings FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Rooms
CREATE POLICY "Public rooms viewable by authenticated" ON rooms FOR SELECT TO authenticated USING (is_private = false);
CREATE POLICY "Users create rooms" ON rooms FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

-- Messages
CREATE POLICY "Messages viewable in public rooms" ON messages FOR SELECT TO authenticated 
  USING (EXISTS (SELECT 1 FROM rooms WHERE id = messages.room_id AND is_private = false));
CREATE POLICY "Users insert messages" ON messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Private Messages
CREATE POLICY "Users view own PMs" ON private_messages FOR SELECT TO authenticated USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users send PMs" ON private_messages FOR INSERT TO authenticated WITH CHECK (
    auth.uid() = sender_id AND 
    NOT EXISTS (SELECT 1 FROM blocks WHERE blocker_id = receiver_id AND blocked_id = auth.uid()) AND
    EXISTS (SELECT 1 FROM user_settings WHERE user_id = receiver_id AND allow_private_messages = true)
);

-- Blocks
CREATE POLICY "Users manage own blocks" ON blocks FOR ALL TO authenticated USING (auth.uid() = blocker_id);

-- 5. THE FAIL-SAFE TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, email, avatar_url)
  VALUES (
    new.id, 
    -- Fallback for username if metadata is missing
    COALESCE(new.raw_user_meta_data->>'username', 'user_' || substr(new.id::text, 1, 8)), 
    COALESCE(new.raw_user_meta_data->>'full_name', 'New User'), 
    new.email, 
    new.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  
  INSERT INTO public.user_settings (user_id) 
  VALUES (new.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach Trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();