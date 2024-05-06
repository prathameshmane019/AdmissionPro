"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

import {
    Table,
    Tooltip,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Chip,
    User,
    Pagination,
} from "@nextui-org/react";
import { PlusIcon } from "@/public/PlusIcon";
import { EyeIcon } from "@/public/EyeIcon";
import { EditIcon } from "@/public/EditIcon";
import { DeleteIcon } from "@/public/DeleteIcon";
import { SearchIcon } from "@/public/SearchIcon";
import { ChevronDownIcon } from "@/public/ChevronDownIcon";
import { statusOptions } from "@/app/utils/data";
import { capitalize } from "@/app/utils/utils";
import StudentModal from "@/app/components/studentModal";

const statusColorMap = {
    active: "success",
    paused: "danger",
    vacation: "warning",
};

const columns = [
    { uid: "firstName", name: "First Name", sortable: true },
    { uid: "fatherName", name: "Father's Name", },
    { uid: "lastName", name: "Last Name" },
    { uid: "Gender", name: "Gender" },
    { uid: "category", name: "Category" },
    { uid: "disability", name: "Disability" },
    { uid: "cet", name: "CET Score", sortable: true },
    { uid: "pcm", name: "PCM Score", sortable: true },
    { uid: "jee", name: "JEE Score", sortable: true },
    { uid: "mobile", name: "Mobile" },
    { uid: "parentMobile", name: "Parent's Mobile" },
    { uid: "gmail", name: "Email" },
    { uid: "actions", name: "Actions" },
];
const INITIAL_VISIBLE_COLUMNS = ["firstName", "fatherName", "lastName", "mobile", "category", "email", "actions"];

export default function TableComponent() {
    const [filterValue, setFilterValue] = useState("");
    const [selectedKeys, setSelectedKeys] = useState(new Set());
    const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
    const [statusFilter, setStatusFilter] = useState("all");
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [sortDescriptor, setSortDescriptor] = useState({
        column: "name", // Change default sorting column here
        direction: "ascending",
    });
    const [page, setPage] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("view"); // 'view', 'edit', or 'add'
    const [selectedUser, setSelectedUser] = useState(null);
    const [users, setUsers] = useState([]);
    


    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/students');
            const data = await response.json();
            setUsers(data.students);
            console.log(students);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    

    const deleteStudent = async (_id) => {
        try {
            console.log("deleting");
          await axios.delete(`/api/students?_id=${_id}`);
        } catch (error) {
          console.error("Error deleting department:", error);
        }
      };

    const pages = Math.ceil(users.length / rowsPerPage);

    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = React.useMemo(() => {
        if (visibleColumns === "all") return columns;

        return columns.filter((column) => visibleColumns.has(column.uid));
    }, [visibleColumns]);

    const filteredItems = React.useMemo(() => {
        let filteredUsers = [...users];

        if (hasSearchFilter) {
            filteredUsers = filteredUsers.filter((user) =>(
                user.firstName.toLowerCase().includes(filterValue.toLowerCase()) || user.lastName.toLowerCase().includes(filterValue.toLowerCase()))
            );
        }
        if (statusFilter !== "all" && statusFilter.size !== statusOptions.length) {
            filteredUsers = filteredUsers.filter((user) =>
                statusFilter.has(user.status)
            );
        }
        return filteredUsers;
    }, [users, filterValue, statusFilter]);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    const sortedItems = React.useMemo(() => {
        return [...items].sort((a, b) => {
            const first = a[sortDescriptor.column];
            const second = b[sortDescriptor.column];
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);

    const renderCell = React.useCallback((user, columnKey) => {
        const cellValue = user[columnKey];
        switch (columnKey) {
            case "name":
                return (
                    <User
                        avatarProps={{ radius: "full", size: "sm", src: user.avatar }}
                        classNames={{
                            description: "text-default-500",
                        }}
                        description={user.email}
                        name={cellValue}
                    >
                        {user.email}
                    </User>
                );
            case "role":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-small capitalize">{cellValue}</p>
                        <p className="text-bold text-tiny capitalize text-default-500">{user.team}</p>
                    </div>
                );
            case "status":
                return (
                    <Chip
                        className="capitalize border-none gap-1 text-default-600"
                        color={statusColorMap[user.status]}
                        size="sm"
                        variant="dot"
                    >
                        {cellValue}
                    </Chip>
                );
            case "actions":
                return (
                    <div className="relative flex items-center gap-2">
                        <Tooltip content="Details">
                            <span
                                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                                onClick={() => {
                                    setModalMode("view");
                                    setSelectedUser(user);
                                    setModalOpen(true);
                                }}
                            >
                                <EyeIcon />
                            </span>
                        </Tooltip>
                        <Tooltip content="Edit user">
                            <span
                                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                                onClick={() => {
                                    setModalMode("edit");
                                    setSelectedUser(user);
                                    setModalOpen(true);
                                }}
                            >
                                <EditIcon />
                            </span>
                        </Tooltip>
                        <Tooltip color="danger" content="Delete user">
                            <span
                                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                                onClick={()=> deleteStudent(user._id)}
                            >  <DeleteIcon />
                            </span>
                        </Tooltip>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

    const onRowsPerPageChange = React.useCallback((e) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    const onSearchChange = React.useCallback((value) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue("");
        }
    }, []);

    const handleModalClose = () => {
        setModalOpen(false);
        setSelectedUser(null);
    };

    const handleModalSubmit = () => {
        console.log("Modal submit:", modalMode, selectedUser);
        handleModalClose();
    };

    const topContent = React.useMemo(() => {
        return (
            <div className="flex flex-col gap-4 ">
                <div className="flex justify-between gap-3 items-end">
                    <Input
                        isClearable
                        classNames={{
                            base: "w-full sm:max-w-[44%]",
                            inputWrapper: "border-1",
                        }}
                        placeholder="Search by name..."
                        size="sm"
                        startContent={<SearchIcon className="text-default-300" />}
                        value={filterValue}
                        variant="bordered"
                        onClear={() => setFilterValue("")}
                        onValueChange={onSearchChange}
                    />
                    <div className="flex gap-3">
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button
                                    endContent={<ChevronDownIcon className="text-small" />}
                                    size="sm"
                                    variant="flat"
                                >
                                    Status
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={statusFilter}
                                selectionMode="multiple"
                                onSelectionChange={setStatusFilter}
                            >
                                {statusOptions.map((status) => (
                                    <DropdownItem key={status.uid} className="capitalize">
                                        {capitalize(status.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button
                                    endContent={<ChevronDownIcon className="text-small" />}
                                    size="sm"
                                    variant="flat"
                                >Columns
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={visibleColumns}
                                selectionMode="multiple"
                                onSelectionChange={setVisibleColumns}
                            >
                                {columns.map((column) => (
                                    <DropdownItem key={column.uid} className="capitalize">
                                        {capitalize(column.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        <Button
                            className="bg-foreground text-background"
                            endContent={<PlusIcon />}
                            size="sm"
                            onClick={() => {
                                setModalMode("add");
                                setModalOpen(true);
                            }}
                        >
                            Add New
                        </Button>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">Total {users.length} users</span>
                    <label className="flex items-center text-default-400 text-small">
                        Rows per page:
                        <select
                            className="bg-transparent outline-none text-default-400 text-small"
                            onChange={onRowsPerPageChange}
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                        </select>
                    </label>
                </div>
            </div>
        );
    }, [
        filterValue,
        statusFilter,
        visibleColumns,
        onSearchChange,
        onRowsPerPageChange,
        users.length,
        hasSearchFilter,
    ]);

    const bottomContent = React.useMemo(() => {
        const selectedKeysText = selectedKeys === "all" ?
            "All items selected" :
            `${selectedKeys.size} of ${items.length} selected`;

        return (
            <div className="py-2 px-2 flex justify-between items-center">
                <Pagination
                    showControls
                    classNames={{
                        cursor: "bg-foreground text-background",
                    }}
                    color="default"
                    isDisabled={hasSearchFilter}
                    page={page}
                    total={pages}
                    variant="light"
                    onChange={setPage}
                />
                <span className="text-small text-default-400">
                    {selectedKeysText}
                </span>
            </div>
        );
    }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

    const classNames = {
        wrapper: ["max-h-[382px]", "max-w-3xl"],
        th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
        td: [
            "group-data-[first=true]:first:before:rounded-none",
            "group-data-[first=true]:last:before:rounded-none",
            "group-data-[middle=true]:before:rounded-none",
            "group-data-[last=true]:first:before:rounded-none",
            "group-data-[last=true]:last:before:rounded-none",
        ],
    };

    return (
        <>
            <Table
                isCompact
                removeWrapper
                aria-label="Example table with custom cells, pagination and sorting"
                bottomContent={bottomContent}
                bottomContentPlacement="outside"
                checkboxesProps={{
                    classNames: {
                        wrapper: "after:bg-foreground after:text-background text-background ",
                    },
                }}
                classNames={classNames}
                selectedKeys={selectedKeys}
                sortDescriptor={sortDescriptor}
                topContent={topContent}
                topContentPlacement="outside"
                onSelectionChange={setSelectedKeys}
                onSortChange={setSortDescriptor}
            >
                <TableHeader columns={headerColumns}>
                    {(column) => (
                        <TableColumn
                            key={column.uid}
                            align={column.uid === "actions" ? "center" : "start"}
                            allowsSorting={column.sortable}
                        >
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody emptyContent={"No users found"} items={sortedItems}>
                    {(item) => (
                        <TableRow key={item._id}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <StudentModal
                isOpen={modalOpen}
                onClose={handleModalClose}
                mode={modalMode}
                user={selectedUser}
                onSubmit={handleModalSubmit}
            />
        </>
    );
}
