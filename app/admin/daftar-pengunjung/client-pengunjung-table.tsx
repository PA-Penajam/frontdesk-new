'use client'

import * as React from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { DataTable } from '@/components/admin/data-table'
import { DataTableToolbar } from '@/components/admin/data-table-toolbar'
import { deleteTamu } from '@/lib/actions'
import { Tamu } from '@/lib/types'
import { ColumnDef } from '@tanstack/react-table'
import { buildPathWithParams, cloneSearchParams } from '@/lib/query-params'

interface ClientPengunjungTableProps {
  data: Tamu[]
  pageCount: number
  page: number
  perPage: number
  total: number
  search?: string
  startDate?: string
  endDate?: string
}

export function ClientPengunjungTable({
  data,
  pageCount,
  page,
  perPage,
  total,
  search,
  startDate,
  endDate,
}: ClientPengunjungTableProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const columns: ColumnDef<Tamu>[] = React.useMemo(
    () => [
      {
        id: 'no',
        header: 'No',
        cell: ({ row }) => (page - 1) * perPage + row.index + 1,
      },
      {
        accessorKey: 'nama',
        header: 'Nama',
      },
      {
        accessorKey: 'alamat',
        header: 'Alamat',
        cell: ({ row }) => row.original.alamat || '-',
      },
      {
        accessorKey: 'hp',
        header: 'HP',
        cell: ({ row }) => row.original.hp || '-',
      },
      {
        accessorKey: 'tujuan',
        header: 'Keperluan',
      },
      {
        accessorKey: 'tanggal',
        header: 'Tanggal',
        cell: ({ row }) => {
          const date = new Date(row.original.tanggal)
          return new Intl.DateTimeFormat('id-ID', {
            dateStyle: 'long',
            timeStyle: 'short',
          }).format(date)
        },
      },
    ],
    [page, perPage]
  )

  const handleSearchChange = (value: string) => {
    const params = cloneSearchParams(searchParams)
    if (value) {
      params.set('search', value)
    } else {
      params.delete('search')
    }
    params.set('page', '1')
    router.replace(buildPathWithParams(pathname, params))
  }

  const handleDateChange = (start: string, end: string) => {
    const params = cloneSearchParams(searchParams)
    if (start) {
      params.set('startDate', start)
    } else {
      params.delete('startDate')
    }
    if (end) {
      params.set('endDate', end)
    } else {
      params.delete('endDate')
    }
    params.set('page', '1')
    router.replace(buildPathWithParams(pathname, params))
  }

  const handleDelete = async (id: number) => {
    await deleteTamu(id)
  }

  const toolbar = (
    <DataTableToolbar
      searchValue={search || ''}
      onSearchChange={handleSearchChange}
      searchPlaceholder="Cari nama atau alamat..."
      startDate={startDate || ''}
      endDate={endDate || ''}
      onDateChange={handleDateChange}
    />
  )

  return (
    <DataTable
      columns={columns}
      data={data}
      pageCount={pageCount}
      currentPage={page}
      perPage={perPage}
      totalItems={total}
      toolbar={toolbar}
      onDeleteRow={handleDelete}
      deleteDialogTitle="Hapus Data Pengunjung?"
      deleteDialogDescription="Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan."
    />
  )
}
