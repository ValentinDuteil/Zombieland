// Admin page to see the list of the members, filter them, edit and delete them

import { useEffect, useState } from "react"
import { Box, Text, Button, Flex, Menu, MenuButton, MenuList, MenuItem, Spinner } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import AdminTable from "@/components/AdminTable"
import AdminNavlinkMenu from "@/components/AdminNavlinkMenu"

const AdminMembers = () => {
  const [members, setMembers] = useState([])
  
    return (
        <div>
            <Header />
            <AdminNavlinkMenu />
            <AdminTable />
            <Footer />
        </div>
    )
}