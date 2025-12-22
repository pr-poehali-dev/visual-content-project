CREATE TABLE IF NOT EXISTS videos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'video',
    category VARCHAR(50) DEFAULT 'videos',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_visible BOOLEAN DEFAULT true
);

CREATE INDEX idx_videos_category ON videos(category);
CREATE INDEX idx_videos_visible ON videos(is_visible);
