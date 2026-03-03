export const dynamic = 'force-dynamic';

import { listTamu } from '@/lib/actions'
import { AdminPageWrapper } from '@/components/admin/admin-page-wrapper'
import { Metadata } from 'next'
import { ClientPengunjungTable } from './client-pengunjung-table'

export const metadata: Metadata = {
  title: 'Daftar Pengunjung',
  description: 'Daftar pengunjung yang berkunjung',
}

export default async function DaftarPengunjungPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams
  const page = Number(searchParams.page) || 1
  const perPage = 20
  const search = typeof searchParams.search === 'string' ? searchParams.search : undefined
  const startDate = typeof searchParams.startDate === 'string' ? searchParams.startDate : undefined
  const endDate = typeof searchParams.endDate === 'string' ? searchParams.endDate : undefined

  const { data, total, totalPages } = await listTamu({
    jenis_tamu: 'pengunjung',
    page,
    perPage,
    search,
    startDate,
    endDate,
  })

  // Build export URL for server-rendered links
  const exportUrl = (format: 'csv' | 'xlsx' | 'pdf') => {
    const params = new URLSearchParams()
    params.set('jenis', 'pengunjung')
    params.set('format', format)
    if (search) params.set('search', search)
    if (startDate) params.set('startDate', startDate)
    if (endDate) params.set('endDate', endDate)
    return `/api/export?${params.toString()}`
  }

  const exportActions = (
    <div className="flex gap-2">
      <a
        href={exportUrl('csv')}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-3"
      >
        CSV
      </a>
      <a
        href={exportUrl('xlsx')}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-3"
      >
        Excel
      </a>
      <a
        href={exportUrl('pdf')}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-3"
      >
        PDF
      </a>
    </div>
  )

  return (
    <AdminPageWrapper title="Daftar Pengunjung" actions={exportActions}>
      <ClientPengunjungTable
        data={data}
        pageCount={totalPages}
        page={page}
        perPage={perPage}
        total={total}
        search={search}
        startDate={startDate}
        endDate={endDate}
      />
    </AdminPageWrapper>
  )
}
