export const dynamic = 'force-dynamic';

import { listTamu } from '@/lib/actions'
import { AdminPageWrapper } from '@/components/admin/admin-page-wrapper'
import { Metadata } from 'next'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ClientTamuTable } from './client-tamu-table'

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

  // Export URL builder
  const exportUrl = (format: 'csv' | 'xlsx' | 'pdf') => {
    const params = new URLSearchParams()
    params.set('jenis', 'tamu')
    params.set('format', format)
    if (search) params.set('search', search)
    if (startDate) params.set('startDate', startDate)
    if (endDate) params.set('endDate', endDate)
    return `/api/export?${params.toString()}`
  }

  const exportActions = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <a href={exportUrl('csv')} target="_blank" rel="noopener noreferrer">
            CSV
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={exportUrl('xlsx')} target="_blank" rel="noopener noreferrer">
            Excel
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={exportUrl('pdf')} target="_blank" rel="noopener noreferrer">
            PDF
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  return (
    <AdminPageWrapper title="Daftar Tamu" actions={exportActions}>
      <ClientTamuTable
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
