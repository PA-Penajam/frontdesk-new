import Link from "next/link";
import { User, Users } from "lucide-react";
import { MagicCard } from "@/components/ui/magic-card";
import { BlurFade } from "@/components/ui/blur-fade";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <main className="flex w-full max-w-4xl flex-col items-center gap-12">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <BlurFade delay={0.25} inView>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Pengadilan Agama Penajam
            </h1>
          </BlurFade>
          <BlurFade delay={0.35} inView>
            <p className="text-xl text-muted-foreground md:text-2xl">
              Sistem Buku Tamu Digital
            </p>
          </BlurFade>
        </div>

        {/* Action Cards */}
        <div className="grid w-full gap-6 md:grid-cols-2">
          <BlurFade delay={0.5} inView className="h-full">
            <Link href="/buku-tamu" className="block h-full">
              <MagicCard
                className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center transition-transform duration-300 hover:scale-[1.02] border shadow-sm"
                gradientColor="var(--color-primary)"
                gradientOpacity={0.15}
              >
                <div className="rounded-full bg-primary/10 p-4">
                  <User className="h-12 w-12 text-primary" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">Buku Tamu</h2>
                  <p className="text-muted-foreground">
                    Untuk Pejabat dan Instansi Terkait
                  </p>
                </div>
              </MagicCard>
            </Link>
          </BlurFade>

          <BlurFade delay={0.6} inView className="h-full">
            <Link href="/buku-pengunjung" className="block h-full">
              <MagicCard
                className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center transition-transform duration-300 hover:scale-[1.02] border shadow-sm"
                gradientColor="var(--color-primary)"
                gradientOpacity={0.15}
              >
                <div className="rounded-full bg-primary/10 p-4">
                  <Users className="h-12 w-12 text-primary" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">Buku Pengunjung</h2>
                  <p className="text-muted-foreground">
                    Untuk Masyarakat Umum dan Pihak Berperkara
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
