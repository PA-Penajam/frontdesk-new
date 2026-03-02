export const dynamic = 'force-dynamic';
import { listTamu } from '@/lib/actions'
import { TamuTable } from '@/components/admin/tamu-table'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Daftar Tamu',
  description: 'Daftar tamu yang berkunjung',
}

export default async function DaftarTamuPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams
  const page = Number(searchParams.page) || 1
  const perPage = 20
  const search = typeof searchParams.search === 'string' ? searchParams.search : undefined
  const startDate = typeof searchParams.startDate === 'string' ? searchParams.startDate : undefined
  const endDate = typeof searchParams.endDate === 'string' ? searchParams.endDate : undefined

  const { data, total, totalPages } = await listTamu({
    jenis_tamu: 'tamu',
    page,
    perPage,
    search,
    startDate,
    endDate,
  })

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Daftar Tamu</h1>
      </div>
      <TamuTable
        data={data}
        pageCount={totalPages}
        page={page}
        perPage={perPage}
        total={total}
      />
    </div>
  )
}
