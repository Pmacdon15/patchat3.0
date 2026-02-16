-- Profiles table to store user metadata
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- User settings table
CREATE TABLE user_settings (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  allow_private_messages BOOLEAN DEFAULT true NOT NULL,
  max_rooms_allowed INTEGER DEFAULT 3 NOT NULL,
  is_admin BOOLEAN DEFAULT false NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Rooms table
CREATE TABLE rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  is_private BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Messages table for public rooms
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Private messages table
CREATE TABLE private_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Blocks table
CREATE TABLE blocks (
  blocker_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  blocked_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (blocker_id, blocked_id)
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE private_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;

-- Profiles: Public can view profiles, only user can update their own
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- User Settings: Only user can view and update their own settings
CREATE POLICY "User settings are viewable by authenticated users" ON user_settings FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update own settings" ON user_settings FOR UPDATE USING (auth.uid() = user_id);

-- Rooms: Everyone can view public rooms, only owners can delete
CREATE POLICY "Public rooms are viewable by everyone" ON rooms FOR SELECT USING (is_private = false);
CREATE POLICY "Users can create rooms" ON rooms FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Owners can delete rooms" ON rooms FOR DELETE USING (auth.uid() = created_by);

-- Messages: Everyone can view messages in public rooms
CREATE POLICY "Messages are viewable by everyone in the room" ON messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM rooms WHERE id = messages.room_id AND is_private = false)
);
CREATE POLICY "Users can insert messages" ON messages FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Private Messages: Only sender and receiver can view
CREATE POLICY "Users can view their PMs" ON private_messages FOR SELECT USING (
  auth.uid() = sender_id OR auth.uid() = receiver_id
);
CREATE POLICY "Users can send PMs" ON private_messages FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND 
  NOT EXISTS (SELECT 1 FROM blocks WHERE blocker_id = receiver_id AND blocked_id = auth.uid()) AND
  EXISTS (SELECT 1 FROM user_settings WHERE user_id = receiver_id AND allow_private_messages = true)
);

-- Blocks: Only blocker can view and manage their blocks
CREATE POLICY "Blocks are viewable by authenticated users" ON blocks FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can block others" ON blocks FOR INSERT WITH CHECK (auth.uid() = blocker_id);
CREATE POLICY "Users can unblock others" ON blocks FOR DELETE USING (auth.uid() = blocker_id);


-- Insert general room
INSERT INTO rooms (name, is_private) VALUES ('General', false);

-- Trigger to create profile and settings on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  
  INSERT INTO public.user_settings (user_id)
  VALUES (new.id);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Enable real-time for messages and private_messages
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE private_messages;

