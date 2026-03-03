'use client'


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
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Background Decor */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-slate-50 dark:bg-slate-950 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
        <div className="absolute top-0 left-0 -m-20 h-[300px] w-[300px] rounded-full bg-primary/10 blur-[100px] opacity-70" />
        <div className="absolute bottom-0 right-0 -m-20 h-[300px] w-[300px] rounded-full bg-primary/10 blur-[100px] opacity-70" />
      </div>

      <div className="w-full max-w-2xl space-y-6">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-primary transition-colors font-medium">
            <Link href="/" className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Beranda
            </Link>
          </Button>
        </div>

        <section className="bg-card shadow-xl rounded-xl w-full overflow-hidden border border-border">
          {/* Header Section */}
          <header className="bg-primary dark:bg-primary/90 px-6 sm:px-8 py-6 text-primary-foreground flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <div className="flex-shrink-0 bg-white/20 dark:bg-black/20 p-3 rounded-full shadow-inner flex items-center justify-center">
              <Users className="h-10 w-10 text-white" />
            </div>
            <div className="pt-1">
              <h1 className="text-2xl font-bold tracking-tight text-white">Buku Pengunjung</h1>
              <p className="text-white/90 mt-1 text-sm sm:text-base">
                Silakan isi data diri Anda untuk pendaftaran kunjungan umum.
              </p>
            </div>
          </header>

          <div className="p-6 sm:p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                <div className="space-y-6">
                  {/* Section Title */}
                  <div className="flex items-center gap-2 mb-6 border-b border-border pb-2">
                    <UserCircle2 className="text-primary h-5 w-5" />
                    <h2 className="text-lg font-semibold text-foreground">Informasi Kunjungan</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="nama"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="text-foreground font-medium">Nama Lengkap</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Masukkan nama lengkap Anda"
                              className="h-11 bg-background"
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
                          <FormLabel className="text-foreground font-medium">
                            Nomor HP <span className="text-muted-foreground font-normal text-xs ml-1">(Opsional)</span>
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="08xxxxxxxxxx"
                                type="tel"
                                className="h-11 pl-9 bg-background"
                                {...field}
                                disabled={isSubmitting}
                              />
                            </div>
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
                          <FormLabel className="text-foreground font-medium">Tujuan Kunjungan</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={isSubmitting}
                          >
                            <FormControl>
                              <div className="relative">
                                <Target className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
                                <SelectTrigger className="h-11 pl-9 bg-background">
                                  <SelectValue placeholder="Pilih tujuan" />
                                </SelectTrigger>
                              </div>
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

                    <FormField
                      control={form.control}
                      name="alamat"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="text-foreground font-medium">
                            Alamat <span className="text-muted-foreground font-normal text-xs ml-1">(Opsional)</span>
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <textarea
                                placeholder="Masukkan alamat domisili"
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                {...field}
                                disabled={isSubmitting}
                                rows={3}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex justify-end">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full sm:w-auto min-w-[200px] h-11 text-base font-semibold shadow-md transition-all active:scale-[0.98]"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      'Simpan / Kirim'
                    )}
                  </Button>
                </div>

              </form>
            </Form>
          </div>
        </section>
      </div>
    </div>
  )
}
