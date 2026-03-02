import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'

export async function verifyPassword(input: string): Promise<boolean> {
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH
  if (!adminPasswordHash) {
    return false
  }
  return await bcrypt.compare(input, adminPasswordHash)
}

export function createSession(): string {
  return crypto.randomUUID()
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set('admin-session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 86400, // 24 hours
    path: '/',
    sameSite: 'strict',
  })
}

export async function getSession(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get('admin-session')?.value || null
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('admin-session')
}
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession()
  return !!session && session.trim() !== ''
}