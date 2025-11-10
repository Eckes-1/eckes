-- Eckes Blog 数据库结构
-- 创建时间: 2025-11-10
-- 用于 Cloudflare D1 数据库

-- ========================================
-- 用户表
-- ========================================
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK(role IN ('user', 'admin')),
  avatar TEXT,
  bio TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login_at DATETIME
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- ========================================
-- 会话表（用于用户登录状态管理）
-- ========================================
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);

-- ========================================
-- 文章元数据表（扩展静态文章的动态数据）
-- ========================================
CREATE TABLE IF NOT EXISTS posts_meta (
  slug TEXT PRIMARY KEY,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_posts_meta_published ON posts_meta(published);
CREATE INDEX IF NOT EXISTS idx_posts_meta_featured ON posts_meta(featured);

-- ========================================
-- 评论表（如果需要自建评论系统）
-- ========================================
CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_slug TEXT NOT NULL,
  user_id INTEGER,
  parent_id INTEGER,
  content TEXT NOT NULL,
  author_name TEXT,
  author_email TEXT,
  author_website TEXT,
  ip_address TEXT,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'spam', 'deleted')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_comments_post_slug ON comments(post_slug);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_status ON comments(status);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);

-- ========================================
-- 操作日志表（记录管理员操作）
-- ========================================
CREATE TABLE IF NOT EXISTS admin_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  details TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_admin_logs_user_id ON admin_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_action ON admin_logs(action);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON admin_logs(created_at);

-- ========================================
-- 设置表（存储系统设置）
-- ========================================
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  type TEXT DEFAULT 'string' CHECK(type IN ('string', 'number', 'boolean', 'json')),
  description TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- 插入默认数据
-- ========================================

-- 插入默认管理员账户（密码: admin123，需要在实际使用前修改）
-- 注意：这个密码哈希是 bcrypt 加密的 "admin123"
-- 生产环境请立即修改！
INSERT OR IGNORE INTO users (username, email, password_hash, role) 
VALUES ('admin', 'admin@example.com', '$2a$10$rOqJ5gXdJ5p3nWzQmGxO2.PqKZQz5YP1CqWxO9Z5gXdJ5p3nWzQmG', 'admin');

-- 插入默认设置
INSERT OR IGNORE INTO settings (key, value, type, description) VALUES
('site_maintenance', 'false', 'boolean', '网站维护模式开关'),
('max_login_attempts', '5', 'number', '最大登录尝试次数'),
('session_lifetime', '7', 'number', '会话有效期（天）');

-- ========================================
-- 视图（方便数据查询）
-- ========================================

-- 用户统计视图
CREATE VIEW IF NOT EXISTS user_stats AS
SELECT 
  u.id,
  u.username,
  u.email,
  u.role,
  COUNT(DISTINCT c.id) as comment_count,
  COUNT(DISTINCT s.id) as active_sessions,
  u.created_at,
  u.last_login_at
FROM users u
LEFT JOIN comments c ON u.id = c.user_id AND c.status = 'approved'
LEFT JOIN sessions s ON u.id = s.user_id AND s.expires_at > CURRENT_TIMESTAMP
GROUP BY u.id;

-- 文章统计视图
CREATE VIEW IF NOT EXISTS post_stats AS
SELECT 
  pm.slug,
  pm.views,
  pm.likes,
  pm.published,
  pm.featured,
  COUNT(DISTINCT c.id) as comment_count,
  pm.created_at,
  pm.updated_at
FROM posts_meta pm
LEFT JOIN comments c ON pm.slug = c.post_slug AND c.status = 'approved'
GROUP BY pm.slug;
