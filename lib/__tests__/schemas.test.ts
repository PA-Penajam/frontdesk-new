import { describe, it, expect } from 'vitest';
import { tamuFormSchema, pengunjungFormSchema, loginSchema } from '../schemas';

describe('tamuFormSchema', () => {
  it('should accept valid data', () => {
    const result = tamuFormSchema.safeParse({
      nama: 'John Doe',
      instansi: 'ABC Corp',
      hp: '081234567890',
      tujuan: 'Meeting',
    });
    expect(result.success).toBe(true);
  });

  it('should reject empty nama', () => {
    const result = tamuFormSchema.safeParse({
      nama: '',
      instansi: 'ABC Corp',
      hp: '081234567890',
      tujuan: 'Meeting',
    });
    expect(result.success).toBe(false);
  });
});

describe('pengunjungFormSchema', () => {
  it('should accept valid enum tujuan', () => {
    const result = pengunjungFormSchema.safeParse({
      nama: 'Jane Doe',
      alamat: 'Jl. Contoh No. 123',
      hp: '089876543210',
      tujuan: 'Informasi Perkara',
    });
    expect(result.success).toBe(true);
  });

  it('should reject invalid tujuan value', () => {
    const result = pengunjungFormSchema.safeParse({
      nama: 'Jane Doe',
      alamat: 'Jl. Contoh No. 123',
      hp: '089876543210',
      tujuan: 'Invalid Tujuan',
    });
    expect(result.success).toBe(false);
  });
});

describe('loginSchema', () => {
  it('should reject empty password', () => {
    const result = loginSchema.safeParse({
      password: '',
    });
    expect(result.success).toBe(false);
  });
});
