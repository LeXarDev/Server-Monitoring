-- Modify users table to support Auth0
ALTER TABLE users
    -- Change id to UUID to match Auth0's format
    ALTER COLUMN id DROP DEFAULT,
    ALTER COLUMN id TYPE VARCHAR(255),
    -- Make password_hash nullable since SSO users won't have passwords
    ALTER COLUMN password_hash DROP NOT NULL,
    -- Add auth provider columns
    ADD COLUMN auth_provider VARCHAR(50),
    ADD COLUMN auth_provider_id VARCHAR(255);

-- Add indexes for auth provider lookups
CREATE INDEX idx_users_auth_provider ON users(auth_provider, auth_provider_id);

-- Update foreign keys in other tables
ALTER TABLE profiles
    DROP CONSTRAINT profiles_user_id_fkey,
    ALTER COLUMN user_id TYPE VARCHAR(255),
    ADD CONSTRAINT profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE servers
    DROP CONSTRAINT servers_user_id_fkey,
    ALTER COLUMN user_id TYPE VARCHAR(255),
    ADD CONSTRAINT servers_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE login_history
    DROP CONSTRAINT login_history_user_id_fkey,
    ALTER COLUMN user_id TYPE VARCHAR(255),
    ADD CONSTRAINT login_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE refresh_tokens
    DROP CONSTRAINT refresh_tokens_user_id_fkey,
    ALTER COLUMN user_id TYPE VARCHAR(255),
    ADD CONSTRAINT refresh_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
