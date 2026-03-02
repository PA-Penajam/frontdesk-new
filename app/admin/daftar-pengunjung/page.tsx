export const dynamic = 'force-dynamic';
import { listTamu } from '@/lib/actions'
import { PengunjungTable } from '@/components/admin/pengunjung-table'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; startDate?: string; endDate?: string }>
}) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const search = params.search || ''
  const startDate = params.startDate
  const endDate = params.endDate

  const { data, total, totalPages } = await listTamu({
    jenis_tamu: 'pengunjung',
    page,
    perPage: 20,
    search,
    startDate,
    endDate,
  })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Daftar Pengunjung</h1>
      <PengunjungTable
        data={data}
        totalPages={totalPages}
        currentPage={page}
        totalItems={total}
      />
    </div>
  )
}
