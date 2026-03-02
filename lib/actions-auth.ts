'use server'

import { verifyPassword, setSessionCookie, clearSession, createSession } from './auth'
import { loginSchema } from './schemas'
import { redirect } from 'next/navigation'
import type { ActionResult } from './types'

export async function loginAction(formData: { password: string }): Promise<ActionResult> {
  // Validate with loginSchema
  const result = loginSchema.safeParse(formData)
  if (!result.success) {
    return { success: false, message: 'Password harus diisi' }
  }

  // Call verifyPassword
  const isValid = await verifyPassword(result.data.password)
  if (!isValid) {
    return { success: false, message: 'Password salah' }
  }

  // Set session cookie
  const sessionToken = createSession()
  await setSessionCookie(sessionToken)
  
  return { success: true, message: 'Login berhasil' }
}

export async function logoutAction(): Promise<void> {
  await clearSession()
  redirect('/')
}
