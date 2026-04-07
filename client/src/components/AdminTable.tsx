// generic table component reusable for all admin pages
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Box, Text, Flex, SimpleGrid, Button, Badge, useBreakpointValue } from "@chakra-ui/react"
import bgAdmin from '../assets/bgadmin.webp'
import bgAnnuler from '../assets/bg-bouton-annuler.webp'

// definition of a column : a header and a render function
interface Column<T> {
    header: string
    render: (item: T) => React.ReactNode
    hideOnMobile?: boolean
}

interface AdminTableProps<T> {
    columns: Column<T>[]
    data: T[]
    // called when clicking on a header (for sorting)
    onHeaderClick?: (header: string) => void
    // called when clicking on a row
    onRowClick?: (item: T) => void
    // sort system when the array becomes responsive
    currentSortHeader?: string
    currentSortDir?: "asc" | "desc"
}

// Shared cancel button style — dark texture, white text
export const cancelButtonStyle = {
    bgImage: `url(${bgAnnuler})`,
    bgSize: "120%",
    bgPosition: "center",
    bgRepeat: "no-repeat",
    color: "zombieland.white",
    fontWeight: "bold",
    border: "2px solid",
    borderColor: "zombieland.primary",
    borderRadius: "md",
    _hover: { opacity: 0.8, borderColor: "zombieland.cta1orange" }
}

// Shared status badge colors — site palette
export function StatusBadge({ status }: { status: string }) {
    return (
        <Badge
            bg={status === "CONFIRMED" ? "zombieland.successprimary" : "zombieland.warningprimary"}
            color="zombieland.white"
            px={2}
            py={1}
            borderRadius="md"
            fontSize="11px"
            fontWeight="bold"
        >
            {status}
        </Badge>
    )
}

// Card view for mobile — each row becomes a card
function AdminTableCards<T>({ columns, data, onRowClick, onHeaderClick, currentSortHeader, currentSortDir }: AdminTableProps<T>) {
    // Sort buttons — only visible, non-Actions columns
    const sortableColumns = columns.filter(col => !col.hideOnMobile && col.header !== "Actions")
    return (
        <Flex direction="column" gap={4}>
            {/* Sort buttons — 3 columns grid */}
            {onHeaderClick && sortableColumns.length > 0 && (
                <SimpleGrid columns={3} spacing={2} mb={2}>
                    {sortableColumns.map(col => {
                        const isActive = currentSortHeader === col.header
                        return (
                            <Button
                                key={col.header}
                                size="sm"
                                onClick={() => onHeaderClick(col.header)}
                                bgImage={`url(${bgAdmin})`}
                                bgPosition="center"
                                bgSize="120%"
                                bgRepeat="no-repeat"
                                color="zombieland.secondary"
                                fontWeight="bold"
                                fontSize="16px"
                                borderRadius="md"
                                border="2px solid"
                                borderColor={isActive ? "zombieland.cta1orange" : "transparent"}
                                boxShadow={isActive ? "0 0 8px rgba(184, 95, 0, 0.5)" : "none"}
                                _hover={{ opacity: 0.85, borderColor: "zombieland.cta1orange" }}
                                py={3}
                            >
                                {col.header} {isActive ? (currentSortDir === "asc" ? "↑" : "↓") : ""}
                            </Button>
                        )
                    })}
                </SimpleGrid>
            )}

            {/* Cards */}
            {data.map((item, index) => (
                <Box
                    key={index}
                    bgImage={`url(${bgAdmin})`}
                    bgSize="cover"
                    bgPosition="center"
                    bgRepeat="no-repeat"
                    borderRadius="md"
                    border="2px solid"
                    borderColor="zombieland.primary"
                    p={4}
                    cursor={onRowClick ? "pointer" : "default"}
                    transition="all 0.3s ease"
                    _hover={onRowClick ? {
                        borderColor: "zombieland.cta1orange",
                        transform: "translateY(-2px)",
                    } : undefined}
                    onClick={() => onRowClick?.(item)}
                >
                    {columns
                        .filter(col => !col.hideOnMobile)
                        .map((col) => (
                            <Flex
                                key={col.header}
                                justify="space-between"
                                align="center"
                                py={2}
                                borderBottom="1px solid rgba(255,255,255,0.08)"
                                _last={{ borderBottom: "none" }}
                            >
                                <Text
                                    color="zombieland.secondary"
                                    fontWeight="bold"
                                    fontSize="12px"
                                    textTransform="uppercase"
                                    letterSpacing="1px"
                                    minW="60px"
                                    flexShrink={0}
                                >
                                    {col.header}
                                </Text>
                                <Box
                                    color="#1A1A1A"
                                    fontWeight="bold"
                                    px={3}
                                    py={1}
                                    borderRadius="sm"
                                    textAlign="right"
                                    whiteSpace="normal"
                                    wordBreak="break-word"
                                >
                                    {col.render(item)}
                                </Box>
                            </Flex>
                        ))}
                </Box>
            ))}
        </Flex>
    )
}

// Table view for desktop
function AdminTable<T>({ columns, data, onRowClick, onHeaderClick, currentSortHeader, currentSortDir }: AdminTableProps<T>) {
    const isMobile = useBreakpointValue({ base: true, lg: false })

    if (isMobile) {
        return (
            <AdminTableCards
                columns={columns}
                data={data}
                onRowClick={onRowClick}
                onHeaderClick={onHeaderClick}
                currentSortHeader={currentSortHeader}
                currentSortDir={currentSortDir}
            />
        )
    }

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
                            <Th
                                key={col.header}
                                color="#FAEBDC"
                                fontSize={20}
                                cursor={onHeaderClick ? "pointer" : "default"}
                                _hover={onHeaderClick ? {
                                    bg: "rgba(255,255,255,0.05)",
                                    borderColor: "zombieland.cta1orange",
                                } : undefined}
                                onClick={() => onHeaderClick?.(col.header)}
                            >
                                {col.header} {currentSortHeader === col.header ? (currentSortDir === "asc" ? "↑" : "↓") : ""}
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