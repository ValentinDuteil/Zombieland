// generic table component reusable for all admin pages
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer } from "@chakra-ui/react"
import bgAdmin from '../assets/bgadmin.webp'



// definition of a column : a header and a render function
interface Column<T> {
    header: string
    render: (item: T) => React.ReactNode
}

interface AdminTableProps<T> {
    columns: Column<T>[]
    data: T[]
    // called when clicking on a header (for sorting)
    onHeaderClick?: (header: string) => void
    // called when clicking on a row
    onRowClick?: (item: T) => void
}

function AdminTable<T>({ columns, data, onRowClick, onHeaderClick }: AdminTableProps<T>) {
    return (
        <TableContainer
            bg="rgba(255,255,255,0.06)"
            borderRadius="md"
            border="2px solid"
            borderColor="zombieland.primary"
        >
            <Table variant="unstyled">
                <Thead>
                    <Tr borderBottom="1px solid #333">
                        {columns.map((col) => (
                            <Th key={col.header} color="#FAEBDC"
                                cursor={onHeaderClick ? "pointer" : "default"}
                                _hover={onHeaderClick ? {
                                    bg: "rgba(255,255,255,0.05)",
                                    borderColor: "zombieland.cta1orange",
                                } : undefined}
                                onClick={() => onHeaderClick?.(col.header)}
                                >
                                    {col.header}
                            </Th>
                        ))}
                    </Tr>
                </Thead>
                <Tbody>
                    {data.map((item, index) => (
                        <Tr
                            key={index}
                            borderBottom="1px solid #222"
                            transition="all 0.3s ease"
                            cursor={onRowClick ? "pointer" : "default"}
                            _hover={onRowClick ? {
                                bg: "rgba(255,255,255,0.05)",
                                borderColor: "zombieland.cta1orange",
                            } : undefined}
                            onClick={() => onRowClick?.(item)}
                        >
                            {columns.map((col) => (
                                <Td
                                    key={col.header}
                                    color="#1A1A1A"
                                    fontWeight="bold"
                                    bgImage={`url(${bgAdmin})`}
                                    bgSize="cover"
                                    bgPosition="center"
                                    border="1px solid #444"
                                >
                                    {col.render(item)}
                                </Td>
                            ))}
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </TableContainer>
    )
}

export default AdminTable