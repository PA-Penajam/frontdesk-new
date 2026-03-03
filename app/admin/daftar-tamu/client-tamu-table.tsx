'use client'

import * as React from 'react'

import { DataTable } from '@/components/admin/data-table'

import { deleteTamu } from '@/lib/actions'
import { Tamu } from '@/lib/types'
import { ColumnDef } from '@tanstack/react-table'


interface ClientTamuTableProps {
  data: Tamu[]
  pageCount: number
  page: number
  perPage: number
  total: number
  search?: string
  startDate?: string
  endDate?: string
}

export function ClientTamuTable({
  data,
  pageCount,
  page,
  perPage,
  total,

}: ClientTamuTableProps) {


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
        id: 'alamatInstansi',
        header: 'Alamat/Instansi',
        cell: ({ row }) => {
          const alamat = row.original.alamat
          const instansi = row.original.instansi
          if (alamat && instansi) {
            return `${alamat} (${instansi})`
          }
          return alamat || instansi || '-'
        },
      },
      {
        accessorKey: 'tujuan',
        header: 'Keperluan',
      },
      {
        accessorKey: 'tanggal',
        header: 'Tanggal',
        cell: ({ row }) => {
          return new Intl.DateTimeFormat('id-ID', {
            dateStyle: 'long',
            timeStyle: 'short',
          }).format(new Date(row.original.tanggal))
        },
      },
    ],
    [page, perPage]
  )



  const handleDelete = async (id: number) => {
    await deleteTamu(id)
  }


  return (
    <DataTable
      columns={columns}
      data={data}
      pageCount={pageCount}
      currentPage={page}
      perPage={perPage}
      totalItems={total}
      onDeleteRow={handleDelete}
      deleteDialogTitle="Apakah anda yakin?"
      deleteDialogDescription="Tindakan ini tidak dapat dibatalkan. Data tamu ini akan dihapus permanen dari database."
    />
  )
}
