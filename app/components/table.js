"use client";
import React, { useState, useMemo } from "react";
import useSWR from "swr";
import axios from "axios";
import {
    Table,
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
    Spinner,
} from "@nextui-org/react";
import { PlusIcon } from "@/public/PlusIcon";
import { EyeIcon } from "@/public/EyeIcon";
import { EditIcon } from "@/public/EditIcon";
import { DeleteIcon } from "@/public/DeleteIcon";
import { SearchIcon } from "@/public/SearchIcon";
import { ChevronDownIcon } from "@/public/ChevronDownIcon";
import { capitalize } from "@/app/utils/utils";
import StudentModal from "@/app/components/studentModal";

const columns = [
    { uid: "firstName", name: "First Name", sortable: true },
    { uid: "fatherName", name: "Father's Name" },
    { uid: "lastName", name: "Last Name" },
    { uid: "Gender", name: "Gender" },
    { uid: "category", name: "Category" },
    { uid: "cet", name: "CET Score", sortable: true },
    { uid: "pcm", name: "PCM Score", sortable: true },
    { uid: "jee", name: "JEE Score", sortable: true },
    { uid: "mobile", name: "Mobile" },
    { uid: "gmail", name: "Email" },
    { uid: "address", name: "Address" },
    { uid: "actions", name: "Actions" },
];
const INITIAL_VISIBLE_COLUMNS = ["firstName", "fatherName", "lastName", "mobile", "category", "email", "actions"];

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function TableComponent() {
    const [filterValue, setFilterValue] = useState("");
    const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
    const [rowsPerPage, setRowsPerPage] = useState(15);
    const [data, setData] = useState(null);
    const [sortDescriptor, setSortDescriptor] = useState({
        column: "name",
        direction: "ascending",
    });
    const [page, setPage] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("view");
    const [selectedUser, setSelectedUser] = useState(null);
    const [title, setTitle] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        category: "",
        Gender: "",
        pcm: "",
        cet: "",
        jee: "",
        hsc: "",
        address: "",
    });

    const handleTitleChange = (e) => setTitle(e.target.value);

    const handleClusterData = async () => {
        try {
            setLoading(true);
            setError("");

            const filteredItems = data?.students || [];
            await axios.post("/api/cluster", {
                data: filteredItems,
                title,
            });

            setTitle("");
            console.log("Data clustered and saved successfully!");
        } catch (error) {
            console.error("Error clustering data:", error);
            setError("Failed to cluster data");
        } finally {
            setLoading(false);
        }
    };

    const { isLoading } = useSWR(`/api/students?page=${page}`, fetcher, {
        keepPreviousData: true,
        onSuccess: setData,
    });

    const handleFilterChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

    const handleSearch = async () => {
        try {
            const response = await axios.get("/api/students", {
                params: filters,
            });
            setData(response.data);
        } catch (error) {
            console.error("Error fetching students:", error);
        }
    };

    const deleteStudent = async (_id) => {
        try {
            await axios.delete(`/api/students?_id=${_id}`);
        } catch (error) {
            console.error("Error deleting student:", error);
        }
    };

    const pages = useMemo(() => (data?.total > 0 ? Math.ceil(data.total / rowsPerPage) : 0), [data?.total, rowsPerPage]);

    const onRowsPerPageChange = (e) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    };

    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = useMemo(() => {
        if (visibleColumns === "all") return columns;
        return columns.filter((column) => visibleColumns.has(column.uid));
    }, [visibleColumns]);

    const handleFilterReset = () => setFilters({ category: "", Gender: "", pcm: "", cet: "", jee: "", hsc: "", address: "" });

    const filteredItems = useMemo(() => {
        let filteredUsers = data?.students || [];

        if (hasSearchFilter) {
            filteredUsers = filteredUsers.filter((user) =>
                user.firstName.toLowerCase().includes(filterValue.toLowerCase()) ||
                user.lastName.toLowerCase().includes(filterValue.toLowerCase())
            );
        }
        return filteredUsers;
    }, [data?.students, filterValue]);

    const items = useMemo(() => data?.students || [], [data?.students]);

    const sortedItems = useMemo(() => {
        return [...items].sort((a, b) => {
            const first = a[sortDescriptor.column];
            const second = b[sortDescriptor.column];
            const cmp = first < second ? -1 : first > second ? 1 : 0;
            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);

    const renderCell = (user, columnKey) => {
        const cellValue = user[columnKey];
        switch (columnKey) {
            case "actions":
                return (
                    <div className="relative flex items-center gap-2">
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
                        <span
                            className="text-lg text-default-400 cursor-pointer active:opacity-50"
                            onClick={() => deleteStudent(user._id)}
                        >
                            <DeleteIcon />
                        </span>
                    </div>
                );
            default:
                return cellValue;
        }
    };

    const onSearchChange = (value) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue("");
        }
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setSelectedUser(null);
    };

    const handleModalSubmit = () => handleModalClose();

    const topContent = (
        <div className="flex flex-col gap-4">
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
                            <Button endContent={<ChevronDownIcon className="text-small" />} size="sm" variant="flat">
                                Columns
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            disallowEmptySelection
                            aria-label="Table Columns"
                            closeOnSelect={false}
                            selectedKeys={visibleColumns}
                            selectionMode="multiple"
                            onSelectionChange={setVisibleColumns}
                            className="overflow-y-auto"
                        >
                            {columns.map((column) => (
                                <DropdownItem key={column.uid} className="capitalize ">
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
                <span className="text-default-400 text-small">Total {data?.total} users</span>
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

    const bottomContent = (
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
        </div>
    );

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
            <div>
                <h2>Student Filters</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <div>
                        <Input
                            label="Category"
                            name="category"
                            value={filters.category}
                            onChange={handleFilterChange}
                            placeholder="Enter category"
                            size="sm"
                        />
                    </div>
                    <div>
                        <Input
                            label="Gender"
                            name="Gender"
                            value={filters.Gender}
                            onChange={handleFilterChange}
                            placeholder="Enter gender"
                            size="sm"
                        />
                    </div>
                    <div>
                        <Input
                            label="PCM Range (e.g., 100,200)"
                            name="pcm"
                            value={filters.pcm}
                            onChange={handleFilterChange}
                            placeholder="Enter PCM range"
                            size="sm"
                        />
                    </div>
                    <div>
                        <Input
                            label="CET Range (e.g., 50,80)"
                            name="cet"
                            value={filters.cet}
                            onChange={handleFilterChange}
                            placeholder="Enter CET range"
                            size="sm"
                        />
                    </div>
                    <div>
                        <Input
                            label="JEE Range (e.g., 20,60)"
                            name="jee"
                            value={filters.jee}
                            onChange={handleFilterChange}
                            placeholder="Enter JEE range"
                            size="sm"
                        />
                    </div>
                    <div>
                        <Input
                            label="HSC Range (e.g., 60,90)"
                            name="hsc"
                            value={filters.hsc}
                            onChange={handleFilterChange}
                            placeholder="Enter HSC range"
                            size="sm"
                        />
                    </div>
                    <div>
                        <Input
                            name="address"
                            label="Address"
                            value={filters.address}
                            onChange={handleFilterChange}
                            placeholder="Filter by address"
                        />
                    </div>
                </div>
                <div className="my-4">
                    <Button className="bg-foreground text-background" onClick={handleSearch} auto size="sm">
                        Search
                    </Button>
                </div>
                <div className="flex gap-5 my-4">
                        <label htmlFor="title"></label>
                        <Input
                            type="text"
                            id="title"
                            value={title}
                            onChange={handleTitleChange}
                            placeholder="Enter a title"
                            label="Title for the new dataset"
                            size="sm"
                            variant="bordered"
                        />
                    <Button onClick={handleClusterData} className="bg-foreground text-background" size="sm" disabled={loading}>
                        {loading ? "Clustering data..." : "Cluster Data"}
                    </Button>
                    
                    {error && <p>{error}</p>}
                </div>
            </div>
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
                sortDescriptor={sortDescriptor}
                topContent={topContent}
                topContentPlacement="outside"
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
                <TableBody
                    emptyContent={"No users found"}
                    items={sortedItems}
                    loadingContent={<Spinner />}
                    loadingState={isLoading ? "loading" : "idle"}
                >
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