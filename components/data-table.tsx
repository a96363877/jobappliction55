"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import type { JSX } from "react"

interface Column {
  header: string
  accessorKey: string
}

interface DataTableProps {
  data: any[]
  columns: Column[]
  pageSize?: number
}

export function DataTable({ data, columns, pageSize = 10 }: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState<{
    key: string | null
    direction: "asc" | "desc" | null
  }>({
    key: null,
    direction: null,
  })

  // Calculate pagination
  const totalPages = Math.ceil(data.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize

  // Sort data if needed
  const sortedData = [...data]
  if (sortConfig.key && sortConfig.direction) {
    sortedData.sort((a, b) => {
      if (a[sortConfig.key!] < b[sortConfig.key!]) {
        return sortConfig.direction === "asc" ? -1 : 1
      }
      if (a[sortConfig.key!] > b[sortConfig.key!]) {
        return sortConfig.direction === "asc" ? 1 : -1
      }
      return 0
    })
  }

  // Get current page data
  const currentData = sortedData.slice(startIndex, endIndex)

  // Handle sorting
  const handleSort = (key: string) => {
    let direction: "asc" | "desc" | null = "asc"

    if (sortConfig.key === key) {
      if (sortConfig.direction === "asc") {
        direction = "desc"
      } else if (sortConfig.direction === "desc") {
        direction = null
      }
    }

    setSortConfig({ key, direction })
  }

  // Format cell value based on type
  const formatCellValue = (value: any, key: string) => {
    if (!value) return "-"

    // Format dates
    if (key.includes("date") || key.includes("time") || key.includes("At")) {
      try {
        return new Date(value).toLocaleString("ar-SA")
      } catch (e) {
        return value
      }
    }

    // Format file sizes
    if (key === "fileSize" && typeof value === "number") {
      return `${(value / 1024).toFixed(1)} KB`
    }

    // Format status
    if (key === "status") {
      const statusMap: Record<string, JSX.Element> = {
        pending: <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs">قيد الانتظار</span>,
        approved: <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">مقبول</span>,
        rejected: <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs">مرفوض</span>,
      }
      return statusMap[value] || value
    }

    return value
  }

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead key={index} className="font-medium">
                  <Button
                    variant="ghost"
                    className="p-0 font-medium h-auto hover:bg-transparent"
                    onClick={() => handleSort(column.accessorKey)}
                  >
                    {column.header}
                    {sortConfig.key === column.accessorKey &&
                      (sortConfig.direction === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4 inline" />
                      ) : sortConfig.direction === "desc" ? (
                        <ChevronDown className="ml-1 h-4 w-4 inline" />
                      ) : null)}
                  </Button>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.length > 0 ? (
              currentData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((column, colIndex) => (
                    <TableCell key={colIndex}>{formatCellValue(row[column.accessorKey], column.accessorKey)}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  لا توجد بيانات
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink onClick={() => setCurrentPage(page)} isActive={currentPage === page}>
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
