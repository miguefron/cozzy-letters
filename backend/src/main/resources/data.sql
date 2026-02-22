ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'USER';
UPDATE users SET role = 'USER' WHERE role IS NULL;
UPDATE users SET role = 'ADMIN' WHERE email = 'miguefron@gmail.com';


INSERT INTO users (email, display_name, password_hash, role, created_at) VALUES
('admin@cozyletters.dev', 'Admin', '$2b$10$hUtqBS52/9L9v3jaDLcpTO8U7nFjqb.CWYaylNsLMYBZGA4wKw9Ia', 'ADMIN', NOW())
ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, role = EXCLUDED.role;

INSERT INTO users (email, display_name, password_hash, role, created_at) VALUES
('luna@cozyletters.dev', 'Luna Warmheart', '$2b$10$hUtqBS52/9L9v3jaDLcpTO8U7nFjqb.CWYaylNsLMYBZGA4wKw9Ia', 'USER', NOW()),
('oliver@cozyletters.dev', 'Oliver Quill', '$2b$10$hUtqBS52/9L9v3jaDLcpTO8U7nFjqb.CWYaylNsLMYBZGA4wKw9Ia', 'USER', NOW()),
('hazel@cozyletters.dev', 'Hazel Inkwood', '$2b$10$hUtqBS52/9L9v3jaDLcpTO8U7nFjqb.CWYaylNsLMYBZGA4wKw9Ia', 'USER', NOW()),
('cedar@cozyletters.dev', 'Cedar Brightmoss', '$2b$10$hUtqBS52/9L9v3jaDLcpTO8U7nFjqb.CWYaylNsLMYBZGA4wKw9Ia', 'USER', NOW()),
('fern@cozyletters.dev', 'Fern Softglow', '$2b$10$hUtqBS52/9L9v3jaDLcpTO8U7nFjqb.CWYaylNsLMYBZGA4wKw9Ia', 'USER', NOW()),
('jasper@cozyletters.dev', 'Jasper Hearthstone', '$2b$10$hUtqBS52/9L9v3jaDLcpTO8U7nFjqb.CWYaylNsLMYBZGA4wKw9Ia', 'USER', NOW()),
('willow@cozyletters.dev', 'Willow Duskmeadow', '$2b$10$hUtqBS52/9L9v3jaDLcpTO8U7nFjqb.CWYaylNsLMYBZGA4wKw9Ia', 'USER', NOW()),
('ember@cozyletters.dev', 'Ember Clovefield', '$2b$10$hUtqBS52/9L9v3jaDLcpTO8U7nFjqb.CWYaylNsLMYBZGA4wKw9Ia', 'USER', NOW()),
('rowan@cozyletters.dev', 'Rowan Thistlebrook', '$2b$10$hUtqBS52/9L9v3jaDLcpTO8U7nFjqb.CWYaylNsLMYBZGA4wKw9Ia', 'USER', NOW()),
('sage@cozyletters.dev', 'Sage Honeywell', '$2b$10$hUtqBS52/9L9v3jaDLcpTO8U7nFjqb.CWYaylNsLMYBZGA4wKw9Ia', 'USER', NOW())
ON CONFLICT (email) DO NOTHING;
