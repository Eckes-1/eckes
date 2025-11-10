/**
 * 用户登录 API
 * POST /api/auth/login
 */
import type { APIRoute } from 'astro';
import {
  verifyPassword,
  generateSessionId,
  getSessionExpiry,
  createSessionCookie,
  getClientIP,
  getUserAgent,
  errorResponse,
  successResponse,
  isValidEmail,
} from '@/utils/auth-utils';

export const prerender = false; // 标记为 SSR 路由

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // 获取 D1 数据库实例
    const db = (locals.runtime as any)?.env?.DB;
    
    if (!db) {
      return errorResponse('数据库未配置', 500);
    }

    // 解析请求体
    const body = await request.json();
    const { username, password } = body;

    // 验证输入
    if (!username || !password) {
      return errorResponse('用户名和密码不能为空');
    }

    // 查询用户（支持用户名或邮箱登录）
    const query = isValidEmail(username)
      ? 'SELECT * FROM users WHERE email = ? LIMIT 1'
      : 'SELECT * FROM users WHERE username = ? LIMIT 1';

    const result = await db.prepare(query).bind(username).first();

    if (!result) {
      return errorResponse('用户名或密码错误', 401);
    }

    // 验证密码
    const isValid = await verifyPassword(password, result.password_hash);
    if (!isValid) {
      return errorResponse('用户名或密码错误', 401);
    }

    // 生成会话
    const sessionId = generateSessionId();
    const expiresAt = getSessionExpiry(7); // 7天有效期
    const ipAddress = getClientIP(request);
    const userAgent = getUserAgent(request);

    // 创建会话记录
    await db
      .prepare(
        'INSERT INTO sessions (id, user_id, ip_address, user_agent, expires_at) VALUES (?, ?, ?, ?, ?)'
      )
      .bind(
        sessionId,
        result.id,
        ipAddress,
        userAgent,
        expiresAt.toISOString()
      )
      .run();

    // 更新最后登录时间
    await db
      .prepare('UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?')
      .bind(result.id)
      .run();

    // 返回成功响应并设置Cookie
    return new Response(
      JSON.stringify({
        success: true,
        message: '登录成功',
        user: {
          id: result.id,
          username: result.username,
          email: result.email,
          role: result.role,
        },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': createSessionCookie(sessionId),
        },
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    return errorResponse('登录失败，请稍后重试', 500);
  }
};
