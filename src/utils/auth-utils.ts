/**
 * 认证相关工具函数
 * 用于处理密码加密、会话管理等
 */

/**
 * 生成密码哈希
 * 注意：这是一个简化版本，生产环境建议使用 bcrypt 或其他更安全的算法
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * 验证密码
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

/**
 * 生成会话ID
 */
export function generateSessionId(): string {
  return crypto.randomUUID();
}

/**
 * 生成会话过期时间
 * @param days 天数，默认7天
 */
export function getSessionExpiry(days: number = 7): Date {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + days);
  return expiry;
}

/**
 * 从请求中获取会话ID
 */
export function getSessionIdFromCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  
  const cookies = cookieHeader.split(';').map(c => c.trim());
  const sessionCookie = cookies.find(c => c.startsWith('session='));
  
  if (!sessionCookie) return null;
  
  return sessionCookie.split('=')[1];
}

/**
 * 创建会话Cookie
 */
export function createSessionCookie(sessionId: string, maxAge: number = 7 * 24 * 60 * 60): string {
  return `session=${sessionId}; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}; Path=/`;
}

/**
 * 清除会话Cookie
 */
export function clearSessionCookie(): string {
  return 'session=; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Path=/';
}

/**
 * 验证邮箱格式
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 验证用户名格式
 * 3-20个字符，只能包含字母、数字、下划线
 */
export function isValidUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
}

/**
 * 验证密码强度
 * 至少8个字符，包含大小写字母和数字
 */
export function isValidPassword(password: string): boolean {
  if (password.length < 8) return false;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  return hasUpperCase && hasLowerCase && hasNumber;
}

/**
 * 获取客户端IP地址
 */
export function getClientIP(request: Request): string {
  return request.headers.get('CF-Connecting-IP') 
    || request.headers.get('X-Forwarded-For')?.split(',')[0]
    || request.headers.get('X-Real-IP')
    || 'unknown';
}

/**
 * 获取User Agent
 */
export function getUserAgent(request: Request): string {
  return request.headers.get('User-Agent') || 'unknown';
}

/**
 * 检查是否为管理员
 */
export function isAdmin(role: string): boolean {
  return role === 'admin';
}

/**
 * API 响应辅助函数
 */
export function jsonResponse(data: any, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * 错误响应
 */
export function errorResponse(message: string, status: number = 400): Response {
  return jsonResponse({ error: message }, status);
}

/**
 * 成功响应
 */
export function successResponse(data: any = {}, message?: string): Response {
  return jsonResponse({
    success: true,
    ...data,
    ...(message && { message }),
  });
}
