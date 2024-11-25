-- Create new user with password
CREATE USER admin WITH PASSWORD 'system2001';

-- Grant all privileges on database
GRANT ALL PRIVILEGES ON DATABASE mobtakir_db TO admin;

-- Connect to the database
\c mobtakir_db

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO admin;

-- Grant all privileges on all tables
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admin;

-- Grant all privileges on all sequences
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO admin;

-- Grant all privileges on all functions
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO admin;

-- Make user a superuser (optional, use with caution)
ALTER USER admin WITH SUPERUSER;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
GRANT ALL PRIVILEGES ON TABLES TO admin;

-- Set default privileges for future sequences
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
GRANT ALL PRIVILEGES ON SEQUENCES TO admin;

-- Set default privileges for future functions
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
GRANT ALL PRIVILEGES ON FUNCTIONS TO admin;