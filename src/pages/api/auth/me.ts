/**
 * 获取当前用户信息 API
 * GET /api/auth/me
 */
import type { APIRoute } from 'astro';
import {
  getSessionIdFromCookie,
  errorResponse,
  successResponse,
} from '@/utils/auth-utils';

export const prerender = false; // 标记为 SSR 路由

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    // 获取 D1 数据库实例
    const db = (locals.runtime as any)?.env?.DB;
    
    if (!db) {
      return errorResponse('数据库未配置', 500);
    }

    // 获取会话ID
    const cookieHeader = request.headers.get('Cookie');
    const sessionId = getSessionIdFromCookie(cookieHeader);

    if (!sessionId) {
      return errorResponse('未登录', 401);
    }

    // 查询会话
    const session = await db
      .prepare('SELECT * FROM sessions WHERE id = ? AND expires_at > CURRENT_TIMESTAMP LIMIT 1')
      .bind(sessionId)
      .first();

    if (!session) {
      return errorResponse('会话已过期，请重新登录', 401);
    }

    // 查询用户信息
    const user = await db
      .prepare('SELECT id, username, email, role, avatar, bio, created_at FROM users WHERE id = ? LIMIT 1')
      .bind(session.user_id)
      .first();

    if (!user) {
      return errorResponse('用户不存在', 404);
    }

    return successResponse({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    return errorResponse('获取用户信息失败', 500);
  }
};
