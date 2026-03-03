'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Loader2, ArrowLeft, Users, UserCircle2, MapPin, Phone, Target } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import { createPengunjung } from '@/lib/actions'
import { pengunjungFormSchema, type PengunjungFormInput } from '@/lib/schemas'

export default function BukuPengunjungPage() {
  const form = useForm<PengunjungFormInput>({
    resolver: zodResolver(pengunjungFormSchema),
    defaultValues: {
      nama: '',
      alamat: '',
      hp: '',
      tujuan: undefined,
    },
  })

  const { isSubmitting } = form.formState

  const onSubmit = async (data: PengunjungFormInput) => {
    try {
      const result = await createPengunjung(data)

      if (result.success) {
        toast.success('Data intervensi berhasil disimpan!', {
          description: "Terima kasih atas kedatangan Anda."
        })
        form.reset()
      } else {
        toast.error('Gagal menyimpan data', {
          description: result.message || 'Silakan coba lagi beberapa saat.'
        })
      }
    } catch (error) {
      toast.error('Terjadi kesalahan sistem', {
        description: "Mohon maaf atas ketidaknyamanan ini."
      })
      console.error(error)
    }
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px]">
        <div className="absolute top-0 left-0 -m-20 h-[300px] w-[300px] rounded-full bg-primary/20 blur-[100px] opacity-50" />
        <div className="absolute bottom-0 right-0 -m-20 h-[300px] w-[300px] rounded-full bg-primary/20 blur-[100px] opacity-30" />
      </div>

      <div className="w-full max-w-lg space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-full shadow-sm bg-background border hover:bg-muted/50">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Kembali</span>
            </Link>
          </Button>
          <div className="flex-1"></div>
        </div>

        <Card className="shadow-xl border-t-4 border-t-primary bg-card/70 backdrop-blur-xl">
          <CardHeader className="text-center space-y-3 pb-8">
            <div className="mx-auto bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-2">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight">
              Buku Pengunjung
            </CardTitle>
            <CardDescription className="text-base">
              Pendaftaran Kunjungan untuk Masyarakat Umum
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                <FormField
                  control={form.control}
                  name="nama"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <UserCircle2 className="h-4 w-4 text-muted-foreground" />
                        Nama Lengkap
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Masukkan nama lengkap Anda"
                          className="h-11 bg-background/50 focus-visible:bg-background"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="alamat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        Alamat <span className="text-muted-foreground font-normal text-xs ml-1">(Opsional)</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Masukkan alamat domisili"
                          className="h-11 bg-background/50 focus-visible:bg-background"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        Nomor HP <span className="text-muted-foreground font-normal text-xs ml-1">(Opsional)</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="08xxxxxxxxxx"
                          type="tel"
                          className="h-11 bg-background/50 focus-visible:bg-background"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tujuan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        Tujuan Kunjungan
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isSubmitting}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11 bg-background/50 focus-visible:bg-background">
                            <SelectValue placeholder="Pilih tujuan kunjungan" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Informasi Perkara">Informasi Perkara</SelectItem>
                          <SelectItem value="Pengaduan">Pengaduan</SelectItem>
                          <SelectItem value="Pendaftaran Perkara">Pendaftaran Perkara</SelectItem>
                          <SelectItem value="Menghadiri Sidang">Menghadiri Sidang</SelectItem>
                          <SelectItem value="Pengambilan Produk">Pengambilan Produk</SelectItem>
                          <SelectItem value="Lainnya">Lainnya</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-12 text-base font-semibold shadow-md transition-transform active:scale-[0.98]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    'Kirim Buku Pengunjung'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
