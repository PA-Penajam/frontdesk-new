import Link from 'next/link';
import { User, Users, ChevronRight } from 'lucide-react';
import { MagicCard } from '@/components/ui/magic-card';
import { BlurFade } from '@/components/ui/blur-fade';

export default function Home() {
  return (
    <div className="relative min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Dynamic Background Pattern */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]" />
      </div>

      <main className="flex w-full max-w-5xl flex-col items-center gap-16 relative z-10">
        {/* Banner/Hero Section */}
        <div className="text-center space-y-6 max-w-3xl">
          <BlurFade delay={0.1} inView>
            <div className="inline-flex items-center rounded-full border px-3 py-1 mb-4 text-sm font-medium">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
              Layanan Digital 24/7
            </div>
          </BlurFade>
          
          <BlurFade delay={0.25} inView>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Pengadilan Agama <br className="hidden sm:block" />
              <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                Penajam
              </span>
            </h1>
          </BlurFade>
          
          <BlurFade delay={0.35} inView>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Sistem Buku Tamu Digital terintegrasi untuk memberikan pelayanan prima yang mandiri, efisien, dan transparan.
            </p>
          </BlurFade>
        </div>

        {/* Action Cards */}
        <div className="grid w-full gap-8 md:grid-cols-2">
          {/* Card Tamu */}
          <BlurFade delay={0.5} inView className="h-full">
            <Link href="/buku-tamu" className="block h-full group focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent rounded-xl">
              <MagicCard
                className="flex h-full flex-col justify-between gap-6 p-8 transition-transform duration-500 hover:-translate-y-2 border border-border/50 shadow-sm hover:shadow-xl dark:hover:shadow-primary/5 cursor-pointer rounded-xl bg-card/50 backdrop-blur-sm"
                gradientColor="var(--color-primary)"
                gradientOpacity={0.1}
              >
                <div className="flex items-start justify-between">
                  <div className="rounded-2xl border bg-background p-4 shadow-sm transition-colors group-hover:bg-primary/5 group-hover:border-primary/20">
                    <User className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
                  </div>
                  <ChevronRight className="h-6 w-6 text-muted-foreground/50 transition-all group-hover:translate-x-1 group-hover:text-primary" />
                </div>
                
                <div className="space-y-3 mt-4 text-left">
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">Buku Tamu</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Pendaftaran kedatangan untuk Pejabat, Tamu Kenegaraan, dan Perwakilan Instansi Terkait.
                  </p>
                </div>
              </MagicCard>
            </Link>
          </BlurFade>

          {/* Card Pengunjung */}
          <BlurFade delay={0.6} inView className="h-full">
            <Link href="/buku-pengunjung" className="block h-full group focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent rounded-xl">
              <MagicCard
                className="flex h-full flex-col justify-between gap-6 p-8 transition-transform duration-500 hover:-translate-y-2 border border-border/50 shadow-sm hover:shadow-xl dark:hover:shadow-primary/5 cursor-pointer rounded-xl bg-card/50 backdrop-blur-sm"
                gradientColor="var(--color-primary)"
                gradientOpacity={0.1}
              >
                <div className="flex items-start justify-between">
                  <div className="rounded-2xl border bg-background p-4 shadow-sm transition-colors group-hover:bg-primary/5 group-hover:border-primary/20">
                    <Users className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
                  </div>
                  <ChevronRight className="h-6 w-6 text-muted-foreground/50 transition-all group-hover:translate-x-1 group-hover:text-primary" />
                </div>

                <div className="space-y-3 mt-4 text-left">
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">Buku Pengunjung</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Pendaftaran kunjungan untuk Masyarakat Umum, Pihak Berperkara, dan Layanan PTSP.
                  </p>
                </div>
              </MagicCard>
            </Link>
          </BlurFade>
        </div>
      </main>
    </div>
  );
}
