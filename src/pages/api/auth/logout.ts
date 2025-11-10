/**
 * 用户登出 API
 * POST /api/auth/logout
 */
import type { APIRoute } from 'astro';
import {
  getSessionIdFromCookie,
  clearSessionCookie,
  errorResponse,
  successResponse,
} from '@/utils/auth-utils';

export const prerender = false; // 标记为 SSR 路由

export const POST: APIRoute = async ({ request, locals }) => {
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

    // 删除会话
    await db
      .prepare('DELETE FROM sessions WHERE id = ?')
      .bind(sessionId)
      .run();

    // 返回成功响应并清除Cookie
    return new Response(
      JSON.stringify({
        success: true,
        message: '登出成功',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': clearSessionCookie(),
        },
      }
    );
  } catch (error) {
    console.error('Logout error:', error);
    return errorResponse('登出失败，请稍后重试', 500);
  }
};
