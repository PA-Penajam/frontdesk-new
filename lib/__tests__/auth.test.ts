import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  verifyPassword,
  createSession,
  isAuthenticated,
  getSession,
  clearSession,
  setSessionCookie,
} from '../auth'
import { cookies } from 'next/headers'

// Mock the cookies function from next/headers
vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))

describe('auth module', () => {
  describe('verifyPassword', () => {
    it('should return true for correct password', async () => {
      // Pre-generated bcrypt hash for "testpassword"
      process.env.ADMIN_PASSWORD_HASH = '$2b$10$V8EVJi4eSqhS4OopPILIJehuk.4BNV52V1OcM4NIq5VAZQD.qGLfm'

      const result = await verifyPassword('testpassword')
      expect(result).toBe(true)
    })

    it('should return false for wrong password', async () => {
      process.env.ADMIN_PASSWORD_HASH = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'

      const result = await verifyPassword('wrongpassword')
      expect(result).toBe(false)
    })
  })

  describe('createSession', () => {
    it('should return a non-empty string UUID', async () => {
      const session = createSession()
      expect(typeof session).toBe('string')
      expect(session).not.toBe('')
      // Basic UUID format check
      expect(session).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
    })
  })

  describe('isAuthenticated', () => {
    it('should return false when no cookie set', async () => {
      ;(cookies as vi.Mock).mockReturnValue({
        get: vi.fn().mockReturnValue(null),
      })

      const result = await isAuthenticated()
      expect(result).toBe(false)
    })

    it('should return true when session cookie is present', async () => {
      ;(cookies as vi.Mock).mockReturnValue({
        get: vi.fn().mockReturnValue({ value: 'valid-session-token' }),
      })

      const result = await isAuthenticated()
      expect(result).toBe(true)
    })
  })

  describe('session cookie functions', () => {
    it('should set and get session cookie', async () => {
      const mockSet = vi.fn()
      const mockGet = vi.fn().mockReturnValue({ value: 'test-session' })
      ;(cookies as vi.Mock).mockReturnValue({
        set: mockSet,
        get: mockGet,
      })

      await setSessionCookie('test-session')
      const session = await getSession()

      expect(mockSet).toHaveBeenCalled()
      expect(session).toBe('test-session')
    })

    it('should clear session cookie', async () => {
      const mockDelete = vi.fn()
      ;(cookies as vi.Mock).mockReturnValue({
        delete: mockDelete,
      })

      await clearSession()
      expect(mockDelete).toHaveBeenCalled()
    })
  })
})