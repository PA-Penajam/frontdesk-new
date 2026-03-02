'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import { createPengunjung } from '@/lib/actions'
import { pengunjungFormSchema, type PengunjungFormInput } from '@/lib/schemas'

export default function BukuPengunjungPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<PengunjungFormInput>({
    resolver: zodResolver(pengunjungFormSchema),
    defaultValues: {
      nama: '',
      alamat: '',
      hp: '',
      tujuan: undefined,
    },
  })

  const onSubmit = async (data: PengunjungFormInput) => {
    setIsSubmitting(true)
    try {
      const result = await createPengunjung(data)

      if (result.success) {
        toast.success('Data berhasil disimpan!')
        form.reset()
      } else {
        toast.error(result.message || 'Gagal menyimpan data')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan pada sistem')
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Buku Pengunjung</CardTitle>
          <CardDescription className="text-center">
            Silakan isi data diri Anda (Masyarakat Umum)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Nama */}
            <div className="space-y-2">
              <Label htmlFor="nama">Nama Lengkap <span className="text-red-500">*</span></Label>
              <Input
                id="nama"
                placeholder="Masukkan nama lengkap"
                {...form.register('nama')}
                disabled={isSubmitting}
              />
              {form.formState.errors.nama && (
                <p className="text-sm text-red-500">{form.formState.errors.nama.message}</p>
              )}
            </div>

            {/* Alamat */}
            <div className="space-y-2">
              <Label htmlFor="alamat">Alamat</Label>
              <Input
                id="alamat"
                placeholder="Masukkan alamat rumah"
                {...form.register('alamat')}
                disabled={isSubmitting}
              />
              {form.formState.errors.alamat && (
                <p className="text-sm text-red-500">{form.formState.errors.alamat.message}</p>
              )}
            </div>

            {/* HP */}
            <div className="space-y-2">
              <Label htmlFor="hp">Nomor HP / WhatsApp</Label>
              <Input
                id="hp"
                placeholder="08xxxxxxxxxx"
                {...form.register('hp')}
                disabled={isSubmitting}
              />
              {form.formState.errors.hp && (
                <p className="text-sm text-red-500">{form.formState.errors.hp.message}</p>
              )}
            </div>

            {/* Tujuan */}
            <div className="space-y-2">
              <Label htmlFor="tujuan">Tujuan Kunjungan <span className="text-red-500">*</span></Label>
              <Controller
                name="tujuan"
                control={form.control}
                render={({ field }) => (
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id="tujuan">
                      <SelectValue placeholder="Pilih tujuan..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Informasi Perkara">Informasi Perkara</SelectItem>
                      <SelectItem value="Pengaduan">Pengaduan</SelectItem>
                      <SelectItem value="Pendaftaran Perkara">Pendaftaran Perkara</SelectItem>
                      <SelectItem value="Menghadiri Sidang">Menghadiri Sidang</SelectItem>
                      <SelectItem value="Pengambilan Produk">Pengambilan Produk</SelectItem>
                      <SelectItem value="Lainnya">Lainnya</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {form.formState.errors.tujuan && (
                <p className="text-sm text-red-500">{form.formState.errors.tujuan.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
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
