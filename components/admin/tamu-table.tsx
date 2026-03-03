'use client'

import * as React from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { toast } from 'sonner'
import { Search, Trash2, ChevronLeft, ChevronRight, Download } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { deleteTamu } from '@/lib/actions'
import { buildPathWithParams, cloneSearchParams, setOrDeleteParam } from '@/lib/query-params'
import { Tamu } from '@/lib/types'

interface TamuTableProps {
  data: Tamu[]
  pageCount: number
  page: number
  perPage: number
  total: number
}

export function TamuTable({
  data,
  pageCount,
  page,
  perPage,
  total,
}: TamuTableProps) {
  "use no memo"

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [isPending, startTransition] = React.useTransition()

  // Search state
  const [search, setSearch] = React.useState(searchParams.get('search') || '')
  
  // Date filter state
  const [startDate, setStartDate] = React.useState(searchParams.get('startDate') || '')
  const [endDate, setEndDate] = React.useState(searchParams.get('endDate') || '')

  // Debounce search
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = cloneSearchParams(searchParams)
      const normalizedSearch = search.trim()
      const currentSearch = (params.get('search') || '').trim()

      if (normalizedSearch !== currentSearch) {
        setOrDeleteParam(params, 'search', normalizedSearch)
        params.set('page', '1') // Reset to page 1 on search
        router.replace(buildPathWithParams(pathname, params))
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [search, router, pathname, searchParams])

  // Handle date filter
  const handleDateFilter = () => {
    const params = cloneSearchParams(searchParams)
    setOrDeleteParam(params, 'startDate', startDate)
    setOrDeleteParam(params, 'endDate', endDate)

    params.set('page', '1')
    router.replace(buildPathWithParams(pathname, params))
  }

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    const params = cloneSearchParams(searchParams)
    params.set('page', newPage.toString())
    router.replace(buildPathWithParams(pathname, params))
  }

  // Handle delete
  const handleDelete = React.useCallback(async (id: number) => {
    startTransition(async () => {
      const result = await deleteTamu(id)
      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    })
  }, [startTransition])

  // Handle export
  const handleExport = (format: 'csv' | 'xlsx' | 'pdf') => {
    const params = new URLSearchParams()
    params.set('jenis', 'tamu')
    params.set('format', format)
    setOrDeleteParam(params, 'search', search)
    setOrDeleteParam(params, 'startDate', startDate)
    setOrDeleteParam(params, 'endDate', endDate)
    window.open(`/api/export?${params.toString()}`, '_blank')
  }

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
        accessorKey: 'instansi',
        header: 'Instansi',
        cell: ({ row }) => row.original.instansi || '-',
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
          return new Intl.DateTimeFormat('id-ID', {
            dateStyle: 'long',
            timeStyle: 'short',
          }).format(new Date(row.original.tanggal))
        },
      },
      {
        id: 'actions',
        header: 'Aksi',
        cell: ({ row }) => {
          return (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive" size="icon" className="h-8 w-8">
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Hapus</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Apakah anda yakin?</DialogTitle>
                  <DialogDescription>
                    Tindakan ini tidak dapat dibatalkan. Data tamu ini akan dihapus permanen dari database.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Batal</Button>
                  </DialogClose>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(row.original.id)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Hapus
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )
        },
      },
    ],
    [page, perPage, handleDelete]
  )

  // eslint-disable-next-line react-hooks/incompatible-library -- useReactTable is a known incompatible API
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount,
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari nama atau instansi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
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
          </div>
        </div>
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
          Menampilkan {(page - 1) * perPage + 1} -{' '}
          {Math.min(page * perPage, total)} dari {total} data
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1 || isPending}
          >
            <ChevronLeft className="h-4 w-4" />
            Sebelumnya
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= pageCount || isPending}
          >
            Selanjutnya
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
