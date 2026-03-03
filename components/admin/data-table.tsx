"use client"

import * as React from "react"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { buildPathWithParams, cloneSearchParams } from "@/lib/query-params"

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[]
  data: TData[]
  pageCount: number
  currentPage: number
  perPage: number
  totalItems: number
  toolbar?: React.ReactNode
  onDeleteRow?: (id: number) => Promise<void>
  deleteDialogTitle?: string
  deleteDialogDescription?: string
}

function getRowId(value: unknown): number | null {
  if (!value || typeof value !== "object" || !("id" in value)) {
    return null
  }

  const rowId = value.id

  return typeof rowId === "number" ? rowId : null
}

export function DataTable<TData>({
  columns,
  data,
  pageCount,
  currentPage,
  perPage,
  totalItems,
  toolbar,
  onDeleteRow,
  deleteDialogTitle,
  deleteDialogDescription,
}: DataTableProps<TData>) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [isPending, startTransition] = React.useTransition()
  const [deleteRowId, setDeleteRowId] = React.useState<number | null>(null)
  const [isDeleting, setIsDeleting] = React.useState(false)

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount,
  })

  const handlePageChange = React.useCallback(
    (nextPage: number) => {
      if (nextPage < 1 || nextPage > pageCount) {
        return
      }

      startTransition(() => {
        const params = cloneSearchParams(searchParams)
        params.set("page", nextPage.toString())
        router.replace(buildPathWithParams(pathname, params))
      })
    },
    [pageCount, pathname, router, searchParams]
  )

  const handleDelete = React.useCallback(() => {
    if (!onDeleteRow || deleteRowId === null) {
      return
    }

    setIsDeleting(true)

    startTransition(async () => {
      try {
        await onDeleteRow(deleteRowId)
        setDeleteRowId(null)
      } finally {
        setIsDeleting(false)
      }
    })
  }, [deleteRowId, onDeleteRow])

  const handleOpenDeleteDialog = React.useCallback(
    (row: TData) => {
      if (!onDeleteRow) {
        return
      }

      const id = getRowId(row)

      if (id !== null) {
        setDeleteRowId(id)
      }
    },
    [onDeleteRow]
  )

  const startItem = data.length > 0 ? (currentPage - 1) * perPage + 1 : 0
  const endItem = data.length > 0 ? Math.min(currentPage * perPage, totalItems) : 0

  return (
    <div className="space-y-4">
      {toolbar}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => {
                    const isActionsCell = onDeleteRow && cell.column.columnDef.id === "actions"

                    if (isActionsCell) {
                      return (
                        <TableCell key={cell.id}>
                          <Button
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleOpenDeleteDialog(row.original)}
                            disabled={isPending || isDeleting}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Hapus</span>
                          </Button>
                        </TableCell>
                      )
                    }

                    return (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Tidak ada data
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          Menampilkan {startItem} - {endItem} dari {totalItems}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1 || isPending}
          >
            <ChevronLeft className="h-4 w-4" />
            Sebelumnya
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= pageCount || isPending}
          >
            Selanjutnya
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ConfirmDeleteDialog
        open={deleteRowId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteRowId(null)
          }
        }}
        onConfirm={handleDelete}
        title={deleteDialogTitle}
        description={deleteDialogDescription}
        isDeleting={isDeleting}
      />
    </div>
  )
}
