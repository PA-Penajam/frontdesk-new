'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import * as z from 'zod'

import { tamuFormSchema } from '@/lib/schemas'
import { createTamu } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default function BukuTamuPage() {
  const form = useForm<z.infer<typeof tamuFormSchema>>({
    resolver: zodResolver(tamuFormSchema),
    defaultValues: {
      nama: '',
      instansi: '',
      hp: '',
      tujuan: '',
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = form

  const onSubmit = async (data: z.infer<typeof tamuFormSchema>) => {
    try {
      const result = await createTamu(data)

      if (result.success) {
        toast.success('Data berhasil disimpan!')
        reset()
      } else {
        toast.error(result.message || 'Terjadi kesalahan saat menyimpan data')
        // If the error is related to a specific field, we could set it here
        // But for now, we'll just show a toast
      }
    } catch (error) {
      toast.error('Terjadi kesalahan sistem')
      console.error(error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold text-slate-900">
            Buku Tamu
          </CardTitle>
          <CardDescription className="text-slate-600">
            Silakan isi form di bawah ini untuk Pejabat/Instansi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="nama">
                Nama Lengkap <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nama"
                placeholder="Masukkan nama lengkap"
                {...register('nama')}
                className={errors.nama ? 'border-red-500' : ''}
              />
              {errors.nama && (
                <p className="text-sm text-red-500">{errors.nama.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="instansi">Instansi (Opsional)</Label>
              <Input
                id="instansi"
                placeholder="Nama instansi / perusahaan"
                {...register('instansi')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hp">Nomor HP (Opsional)</Label>
              <Input
                id="hp"
                placeholder="08xxxxxxxxxx"
                type="tel"
                {...register('hp')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tujuan">
                Tujuan Kunjungan <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="tujuan"
                placeholder="Jelaskan tujuan kunjungan Anda"
                className={`min-h-[100px] ${
                  errors.tujuan ? 'border-red-500' : ''
                }`}
                {...register('tujuan')}
              />
              {errors.tujuan && (
                <p className="text-sm text-red-500">{errors.tujuan.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                'Simpan Data'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
