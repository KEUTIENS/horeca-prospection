-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Companies table (for multi-tenant support)
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  billing_contact JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin','manager','rep')),
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  locale TEXT DEFAULT 'fr',
  is_active BOOLEAN DEFAULT TRUE,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_company ON users(company_id);
CREATE INDEX idx_users_role ON users(role);

-- Refresh tokens table
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);

-- Prospects table
CREATE TABLE IF NOT EXISTS prospects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('hotel','restaurant','traiteur','ecole','hopital','autre')),
  address TEXT,
  postal_code TEXT,
  city TEXT,
  country TEXT DEFAULT 'France',
  phone TEXT,
  email TEXT,
  website TEXT,
  manager_name TEXT,
  opening_hours JSONB,
  status TEXT CHECK (status IN ('to_visit','in_progress','converted','lost')) DEFAULT 'to_visit',
  note_avg NUMERIC(3,2) DEFAULT 0,
  visits_count INTEGER DEFAULT 0,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  geom GEOGRAPHY(Point, 4326),
  google_place_id TEXT,
  source JSONB,
  ai_enriched_at TIMESTAMPTZ,
  ai_score NUMERIC(3,2),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_prospects_company ON prospects(company_id);
CREATE INDEX idx_prospects_type ON prospects(type);
CREATE INDEX idx_prospects_status ON prospects(status);
CREATE INDEX idx_prospects_city ON prospects(city);
CREATE INDEX idx_prospects_geom ON prospects USING GIST(geom);
CREATE INDEX idx_prospects_created_by ON prospects(created_by);

-- Tours table (must be created before visits)
CREATE TABLE IF NOT EXISTS tours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT,
  date DATE NOT NULL,
  status TEXT CHECK (status IN ('planned','in_progress','completed','cancelled')) DEFAULT 'planned',
  total_distance_km NUMERIC(10,2),
  total_duration_minutes INTEGER,
  route_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tours_user ON tours(user_id);
CREATE INDEX idx_tours_date ON tours(date);
CREATE INDEX idx_tours_status ON tours(status);

-- Visits table
CREATE TABLE IF NOT EXISTS visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_id UUID REFERENCES prospects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  tour_id UUID REFERENCES tours(id) ON DELETE SET NULL,
  visited_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER,
  objective TEXT,
  summary TEXT,
  score INTEGER CHECK (score BETWEEN 1 AND 5),
  signed_by TEXT,
  signature_data TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_visits_prospect ON visits(prospect_id);
CREATE INDEX idx_visits_user ON visits(user_id);
CREATE INDEX idx_visits_tour ON visits(tour_id);
CREATE INDEX idx_visits_date ON visits(visited_at);

-- Tour steps table
CREATE TABLE IF NOT EXISTS tour_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id UUID REFERENCES tours(id) ON DELETE CASCADE,
  prospect_id UUID REFERENCES prospects(id) ON DELETE CASCADE,
  step_order INTEGER NOT NULL,
  eta TIMESTAMPTZ,
  distance_from_previous_km NUMERIC(10,2),
  duration_from_previous_minutes INTEGER,
  status TEXT CHECK (status IN ('pending','done','skipped')) DEFAULT 'pending',
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tour_steps_tour ON tour_steps(tour_id);
CREATE INDEX idx_tour_steps_order ON tour_steps(tour_id, step_order);

-- Attachments table
CREATE TABLE IF NOT EXISTS attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_type TEXT CHECK (owner_type IN ('visit','prospect')) NOT NULL,
  owner_id UUID NOT NULL,
  url TEXT NOT NULL,
  filename TEXT NOT NULL,
  mime_type TEXT,
  size_bytes INTEGER,
  uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_attachments_owner ON attachments(owner_type, owner_id);

-- Notes table
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_id UUID REFERENCES prospects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notes_prospect ON notes(prospect_id);
CREATE INDEX idx_notes_user ON notes(user_id);

-- Events/Audit log table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  entity_type TEXT,
  entity_id UUID,
  action TEXT NOT NULL,
  metadata JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_events_user ON events(user_id);
CREATE INDEX idx_events_entity ON events(entity_type, entity_id);
CREATE INDEX idx_events_created ON events(created_at);

-- AI enrichment queue table
CREATE TABLE IF NOT EXISTS ai_enrichment_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_id UUID REFERENCES prospects(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('pending','processing','completed','failed')) DEFAULT 'pending',
  priority INTEGER DEFAULT 0,
  attempts INTEGER DEFAULT 0,
  last_error TEXT,
  result JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_queue_status ON ai_enrichment_queue(status);
CREATE INDEX idx_ai_queue_prospect ON ai_enrichment_queue(prospect_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prospects_updated_at BEFORE UPDATE ON prospects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_visits_updated_at BEFORE UPDATE ON visits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tours_updated_at BEFORE UPDATE ON tours
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update prospect statistics after visit
CREATE OR REPLACE FUNCTION update_prospect_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE prospects
  SET 
    visits_count = (SELECT COUNT(*) FROM visits WHERE prospect_id = NEW.prospect_id),
    note_avg = (SELECT AVG(score) FROM visits WHERE prospect_id = NEW.prospect_id AND score IS NOT NULL)
  WHERE id = NEW.prospect_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_prospect_stats_after_visit
  AFTER INSERT OR UPDATE ON visits
  FOR EACH ROW EXECUTE FUNCTION update_prospect_stats();



