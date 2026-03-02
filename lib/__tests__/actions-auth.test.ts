import { describe, it, expect, vi, beforeEach } from 'vitest'
import { loginAction, logoutAction } from '../actions-auth'
import { verifyPassword, setSessionCookie, createSession, clearSession } from '../auth'

// Mock dependencies
vi.mock('@/lib/auth', () => ({
  verifyPassword: vi.fn(),
  setSessionCookie: vi.fn(),
  createSession: vi.fn(),
  clearSession: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    set: vi.fn(),
    get: vi.fn(),
    delete: vi.fn(),
  })),
}))

describe('auth server actions', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks()
  })

  describe('loginAction', () => {
    it('should return success true with correct password', async () => {
      // Arrange
      const mockVerifyPassword = verifyPassword as vi.Mock
      const mockCreateSession = createSession as vi.Mock
      const mockSetSessionCookie = setSessionCookie as vi.Mock
      
      mockVerifyPassword.mockResolvedValue(true)
      mockCreateSession.mockReturnValue('test-session-token')
      mockSetSessionCookie.mockResolvedValue()

      // Act
      const result = await loginAction({ password: 'correct-password' })

      // Assert
      expect(result.success).toBe(true)
      expect(result.message).toBe('Login berhasil')
      expect(mockVerifyPassword).toHaveBeenCalledWith('correct-password')
      expect(mockCreateSession).toHaveBeenCalled()
      expect(mockSetSessionCookie).toHaveBeenCalledWith('test-session-token')
    })

    it('should return success false with incorrect password', async () => {
      // Arrange
      const mockVerifyPassword = verifyPassword as vi.Mock
      const mockCreateSession = createSession as vi.Mock
      const mockSetSessionCookie = setSessionCookie as vi.Mock
      
      mockVerifyPassword.mockResolvedValue(false)

      // Act
      const result = await loginAction({ password: 'wrong-password' })

      // Assert
      expect(result.success).toBe(false)
      expect(result.message).toBe('Password salah')
      expect(mockVerifyPassword).toHaveBeenCalledWith('wrong-password')
      expect(mockCreateSession).not.toHaveBeenCalled()
      expect(mockSetSessionCookie).not.toHaveBeenCalled()
    })

    it('should return error if password is empty', async () => {
      // Arrange & Act
      const result = await loginAction({ password: '' })

      // Assert
      expect(result.success).toBe(false)
      expect(result.message).toContain('Password')
    })
  })

  describe('logoutAction', () => {
    it('should call clearSession and redirect', async () => {
      // Arrange
      const redirect = (await import('next/navigation')).redirect as vi.Mock
      const mockClearSession = clearSession as vi.Mock
      
      mockClearSession.mockResolvedValue()

      // Act
      await logoutAction()

      // Assert
      expect(mockClearSession).toHaveBeenCalled()
      expect(redirect).toHaveBeenCalledWith('/')
    })
  })
})
