"use client";
import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import {
    Select, SelectItem, 
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
    Pagination,
    Spinner,
} from "@nextui-org/react";

import { PlusIcon } from "@/public/PlusIcon";
import { EyeIcon } from "@/public/EyeIcon";
import { EditIcon } from "@/public/EditIcon";
import { DeleteIcon } from "@/public/DeleteIcon";
import { SearchIcon } from "@/public/SearchIcon";
import { ChevronDownIcon } from "@/public/ChevronDownIcon";
import StudentModal from "@/app/components/studentModal";
import { capitalize } from "@/app/utils/utils";

const columns = [
    { uid: "firstName", name: "First Name", sortable: true },
    { uid: "fatherName", name: "Father's Name" },
    { uid: "lastName", name: "Last Name" },
    { uid: "gender", name: "Gender" },
    { uid: "category", name: "Category" },
    { uid: "cet", name: "CET Score", sortable: true },
    { uid: "pcm", name: "PCM Score", sortable: true },
    { uid: "jee", name: "JEE Score", sortable: true },
    { uid: "mobile", name: "Mobile" },
    { uid: "email", name: "Email" },
    { uid: "college ", name: "College Name" },
    { uid: "address", name: "Address" },
    { uid: "cluster", name: "Cluster" },
    { uid: "actions", name: "Actions" },
];
const INITIAL_VISIBLE_COLUMNS = ["firstName", "fatherName", "lastName", "mobile", "category", "email", "actions"];

export default function TableComponent() {
    const [filterValue, setFilterValue] = useState("");
    const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [data, setData] = useState(null);
    const [sortDescriptor, setSortDescriptor] = useState({ column: "firstName", direction: "ascending" });
    const [page, setPage] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("view");
    const [selectedUser, setSelectedUser] = useState(null);
    const [title, setTitle] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({ category: "", gender: "", pcm: "", cet: "", jee: "", hsc: "", address: "" });
    const [clusters, setClusters] = useState([]);



    useEffect(() => {
        fetchStudents();
        fetchClusters();
    }, [page, rowsPerPage]);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/students', {
                params: {
                    page,
                    limit: rowsPerPage,
                    ...filters,
                    search: filterValue
                }
            });
            setData(response.data);
        } catch (error) {
            console.error("Error fetching students:", error);
        } finally {
            setLoading(false);
        }
    };
    const fetchClusters = async () => {
        try {
            setLoading(true);
            const res = await axios.get('/api/cluster',);
            setClusters(res.data);
        } catch (error) {
            console.error("Error fetching clusters:", error);
        } finally {
            setLoading(false);
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
    const handleTitleChange = (e) => setTitle(e.target.value);

    const handleClusterData = async () => {
        try {
            setLoading(true);
            setError("");
            await axios.post("/api/cluster", { title, filters });
            setTitle("");
            console.log("Data clustered and saved successfully!");
        } catch (error) {
            console.error("Error clustering data:", error);
            setError("Failed to cluster data");
        } finally {
            setLoading(false);
        }
    };


    const handleFilterChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

    const handleSearch = async () => {
        setPage(1);
        await fetchStudents();
    };

    const deleteStudent = async (_id) => {
        try {
            await axios.delete(`/api/students?_id=${_id}`);
            fetchStudents();
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

    const handleFilterReset = () => setFilters({ category: "", gender: "", pcm: "", cet: "", jee: "", hsc: "", address: "", search: "" });

    const handleSelectionChange = (e) => {
        const value = e.target.value || ''; // Use an empty string as the default value
        filters.cluster = value;
      };

    const filteredItems = useMemo(() => {
        let filteredUsers = data?.students || [];
        if (hasSearchFilter) {
            filteredUsers = filteredUsers.filter((user) =>
                (user.firstName && user.firstName.toLowerCase().includes(filterValue.toLowerCase())) ||
                (user.lastName && user.lastName.toLowerCase().includes(filterValue.toLowerCase()))
            );
        }
        return filteredUsers;
    }, [data?.students, filterValue]);

    const items = useMemo(() => data?.students || [], [data]);

    const renderCell = (user, columnKey) => {
        switch (columnKey) {
            case "firstName":
            case "lastName":
            case "fatherName":
            case "mobile":
            case "gmail":
            case "college":
            case "cluster":
            case "category":
            case "cet":
            case "pcm":
            case "jee":
            case "address":
            case "gender":
                return user[columnKey];
            case "actions":
                return (
                    <div className="relative flex items-center gap-2">
                        <Button isIconOnly color="primary" variant="light" onPress={() => openModal("view", user)}>
                            <EyeIcon className="h-4 w-4" />
                        </Button>
                        <Button isIconOnly color="warning" variant="light" onPress={() => openModal("edit", user)}>
                            <EditIcon className="h-4 w-4" />
                        </Button>
                        <Button isIconOnly color="danger" variant="light" onPress={() => deleteStudent(user._id)}>
                            <DeleteIcon className="h-4 w-4" />
                        </Button>
                    </div>
                );
            default:
                return user[columnKey];
        }
    };

    const openModal = (mode, user = null) => {
        setModalMode(mode);
        setSelectedUser(user);
        setModalOpen(true);
    };

console.log(selectedUser);
    const topContent = (
        <div className="flex flex-col gap-4 w-100">
            <div className="mx-auto w-100 flex justify-between">
                <div className="justify-between">
                    <div className="flex justify-between gap-4 my-3">
                    <Input
                        aria-label="Filter by category"
                        placeholder="Filter by category"
                        value={filters.category}
                        onChange={handleFilterChange}
                        name="category"
                        variant="bordered"
                        size="sm"
                        classNames={{
                            base: "w-full sm:max-w-[44%]",
                            inputWrapper: "border-1",
                        }}
                    />
                    <Input
                        aria-label="Filter by address"
                        placeholder="Filter by address"
                        value={filters.address}
                        onChange={handleFilterChange}
                        name="address"
                        variant="bordered"
                        size="sm"
                        classNames={{
                            base: "w-full sm:max-w-[44%]",
                            inputWrapper: "border-1",
                        }}
                    />
                    <Input
                        aria-label="Filter by Gender"
                        placeholder="Filter by Gender"
                        value={filters.gender}
                        onChange={handleFilterChange}
                        name="gender"
                        variant="bordered"
                        size="sm"
                        classNames={{
                            base: "w-full sm:max-w-[44%]",
                            inputWrapper: "border-1",
                        }}
                    />
                    <Input
                        aria-label="Filter by College Name "
                        placeholder="Filter by College Name"
                        value={filters.college}
                        onChange={handleFilterChange}
                        name="college"
                        variant="bordered"
                        size="sm"
                        classNames={{
                            base: "w-full sm:max-w-[44%]",
                            inputWrapper: "border-1",
                        }}
                    />
                    <Input
                        aria-label="Filter by PCM"
                        placeholder="Filter by PCM"
                        value={filters.pcm}
                        onChange={handleFilterChange}
                        name="pcm"
                        variant="bordered"
                        size="sm"
                        classNames={{
                            base: "w-full sm:max-w-[44%]",
                            inputWrapper: "border-1",
                        }}
                    />
                    </div>                    
                    <div className="flex gap-4 my-3 items-center">
                        <Select  
                          label="select cluster"
                          variant="bordered"
                          placeholder="Select an cluster"
                          selectedKeys={filters.cluster}
                          className="max-w-xs"
                          size="sm"
                          onChange={handleSelectionChange}
                          >
                                {clusters && clusters.map((cluster) => (
                                    <SelectItem key={cluster._id}>
                                        {cluster._id}
                                    </SelectItem>
                                ))}

                        </Select>

                    <Input
                        aria-label="Filter by CET"
                        placeholder="Filter by CET"
                        value={filters.cet}
                        onChange={handleFilterChange}
                        name="cet"
                        variant="bordered"
                        size="sm"
                        classNames={{
                            base: "w-full sm:max-w-[44%]",
                            inputWrapper: "border-1",
                        }}
                    />
                    <Input
                        aria-label="Filter by JEE"
                        placeholder="Filter by JEE"
                        value={filters.jee}
                        onChange={handleFilterChange}
                        name="jee"
                        variant="bordered"
                        size="sm"
                        classNames={{
                            base: "w-full sm:max-w-[44%]",
                            inputWrapper: "border-1",
                        }}
                    />
                    <Input
                        aria-label="Filter by HSC"
                        placeholder="Filter by HSC"
                        value={filters.hsc}
                        onChange={handleFilterChange}
                        name="hsc"
                        variant="bordered"
                        size="sm"
                        classNames={{
                            base: "w-full sm:max-w-[44%]",
                            inputWrapper: "border-1",
                        }}
                    />
                    </div>
                </div>

            </div>
            <div className="flex gap-5  items-center justify-center">
                <Input
                    type="text"
                    id="title"
                    value={title}
                    onChange={handleTitleChange}
                    placeholder="Enter a title"
                    size="sm"
                    variant="bordered"
                />
                <Button onClick={handleClusterData} className="bg-foreground text-background" size="sm" disabled={loading}>
                    {loading ? "Clustering data..." : "Cluster Data"}
                </Button>

                {error && <p>{error}</p>}
            </div>
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
                    <Button color="primary" onClick={handleSearch}
                        className="bg-foreground text-background"
                        size="sm">
                        Search
                    </Button>
                    <Button
                        color="secondary"
                        className="bg-foreground text-background"
                        size="sm"
                        onClick={handleFilterReset}>
                        Reset Filters
                    </Button>
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
                        className="bg-transparent outline-none text-default-400 text-small" value={rowsPerPage}
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

    const closeModal = () => setModalOpen(false);
    const bottomContent = (
        <div className="py-2 px-2 flex justify-between items-center">
            <Pagination
                showControls
                classNames={{
                    cursor: "bg-foreground text-background",
                }}
                color="default"
                page={page}
                total={pages}
                variant="light"
                onChange={setPage}
            />
        </div>
    );


    return (
        <div>

            <Table
                aria-label="Student Table"
                sortDescriptor={sortDescriptor}
                bottomContent={bottomContent}
                bottomContentPlacement="outside"
                onSortChange={setSortDescriptor}
                selectedKeys={selectedUser}
                onSelectionChange={setSelectedUser}
                topContent={topContent}
                topContentPlacement="outside"
                selectionMode="multiple"
            >
                <TableHeader columns={headerColumns}>
                    {(column) => (
                        <TableColumn
                            key={column.uid}
                            allowsSorting={column.sortable}
                            sortDescriptor={sortDescriptor}
                            onSortChange={setSortDescriptor}
                        >
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody items={filteredItems}>
                    {(user) => (
                        <TableRow key={user._id}>
                            {(columnKey) => (
                                <TableCell key={columnKey}>
                                    {renderCell(user, columnKey)}
                                </TableCell>
                            )}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            {modalOpen && (
                <StudentModal
                    isOpen={modalOpen}
                    mode={modalMode}
                    user={selectedUser}
                    onClose={closeModal}
                    onUserChange={handleClusterData}
                />
            )}
        </div>
    );
}

