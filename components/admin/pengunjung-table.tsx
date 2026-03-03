'use client'

import * as React from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { deleteTamu } from '@/lib/actions'
import { buildPathWithParams, cloneSearchParams, setOrDeleteParam } from '@/lib/query-params'
import { toast } from 'sonner'
import { Tamu } from '@/lib/types'
import { Trash2, ChevronLeft, ChevronRight, Download } from 'lucide-react'

interface PengunjungTableProps {
  data: Tamu[]
  totalPages: number
  currentPage: number
  totalItems: number
}

export function PengunjungTable({
  data,
  totalPages,
  currentPage,
  totalItems,
}: PengunjungTableProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // State for filters
  const [search, setSearch] = React.useState(searchParams.get('search') || '')
  const [startDate, setStartDate] = React.useState(searchParams.get('startDate') || '')
  const [endDate, setEndDate] = React.useState(searchParams.get('endDate') || '')
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [deleteId, setDeleteId] = React.useState<number | null>(null)

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      const params = cloneSearchParams(searchParams)
      const currentSearch = params.get('search') || ''

      if (search !== currentSearch) {
        setOrDeleteParam(params, 'search', search)
        params.set('page', '1') // Reset to page 1 on search
        router.replace(buildPathWithParams(pathname, params))
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [search, pathname, router, searchParams])

  const handleDateFilter = () => {
    const params = cloneSearchParams(searchParams)
    setOrDeleteParam(params, 'startDate', startDate)
    setOrDeleteParam(params, 'endDate', endDate)

    params.set('page', '1')
    router.replace(buildPathWithParams(pathname, params))
  }

  const handlePageChange = (newPage: number) => {
    const params = cloneSearchParams(searchParams)
    params.set('page', newPage.toString())
    router.replace(buildPathWithParams(pathname, params))
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      const result = await deleteTamu(deleteId)
      if (result.success) {
        toast.success(result.message)
        setDeleteId(null)
      } else {
        toast.error(result.message)
      }
    } catch {
      toast.error('Terjadi kesalahan saat menghapus data')
    } finally {
      setIsDeleting(false)
    }
  }

  // Handle export
  const handleExport = (format: 'csv' | 'xlsx' | 'pdf') => {
    const params = new URLSearchParams()
    params.set('jenis', 'pengunjung')
    params.set('format', format)
    setOrDeleteParam(params, 'search', search)
    setOrDeleteParam(params, 'startDate', startDate)
    setOrDeleteParam(params, 'endDate', endDate)
    window.open(`/api/export?${params.toString()}`, '_blank')
  }

  const columns: ColumnDef<Tamu>[] = React.useMemo(
    () => [
      {
        header: 'No',
        cell: ({ row }) => {
          return (currentPage - 1) * 20 + row.index + 1
        },
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
        header: 'Tujuan',
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
      {
        id: 'actions',
        header: 'Aksi',
        cell: ({ row }) => {
          return (
            <Button
              variant="destructive"
              size="icon"
              className="h-8 w-8"
              onClick={() => setDeleteId(row.original.id)}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Hapus</span>
            </Button>
          )
        },
      },
    ],
    [currentPage]
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: totalPages,
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <Input
            placeholder="Cari nama atau alamat..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-auto"
          />
          <span className="text-muted-foreground">-</span>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-auto"
          />
          <Button variant="secondary" onClick={handleDateFilter}>
            Filter
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport('csv')}>
                CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('xlsx')}>
                Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('pdf')}>
                PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Tidak ada data.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          Menampilkan {data.length > 0 ? (currentPage - 1) * 20 + 1 : 0} -{' '}
          {Math.min(currentPage * 20, totalItems)} dari {totalItems} data
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Sebelumnya
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            Selanjutnya
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Data Pengunjung?</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus data ini?
              Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Menghapus...' : 'Hapus'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
