"use client"
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { ChevronDownIcon } from "@/public/ChevronDownIcon";

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

import { statusOptions } from "@/app/utils/data";
import { capitalize } from "@/app/utils/utils";
import { PlusIcon } from "@/public/PlusIcon";
import { EyeIcon } from "@/public/EyeIcon";
import { EditIcon } from "@/public/EditIcon";
import { DeleteIcon } from "@/public/DeleteIcon";
import { SearchIcon } from "@/public/SearchIcon";
import FacultyModal from "./facultyModal";

const statusColorMap = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

const columns = [
  { uid: "firstName", name: "First Name", sortable: true },
  { uid: "fatherName", name: "Father's Name" },
  { uid: "lastName", name: "Last Name" },
  { uid: "gender", name: "Gender" },
  { uid: "department", name: "Department" },
  { uid: "role", name: "Role" },
  { uid: "email", name: "Email" },
  { uid: "mobile", name: "Mobile" },
  { uid: "actions", name: "Actions" },
];
const INITIAL_VISIBLE_COLUMNS = ["firstName", "fatherName", "lastName", "mobile", "email", "actions"];

export default function FacultyTable() {
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState(new Set());
  const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "name",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("view"); // 'view', 'edit', or 'add'
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [faculty, setFaculty] = useState([]);

  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    try {
      const response = await axios.get('/api/faculty');
      setFaculty(response.data);

    } catch (error) {
      console.error('Error fetching faculty:', error);
    }
  };


  const deleteFaculty = async (_id) => {
    try {
      await axios.delete(`/api/faculty?_id=${_id}`);
      fetchFaculty();
    } catch (error) {
      console.error("Error deleting faculty:", error);
    }
  };

  const pages = Math.ceil(faculty.length / rowsPerPage);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) => visibleColumns.has(column.uid));
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredFaculty = [...faculty];

    if (hasSearchFilter) {
      filteredFaculty = filteredFaculty.filter((member) => {
        console.log("Checking member:", member); // Add this line
        return (
          (member.firstName && member.firstName.toLowerCase().includes(filterValue.toLowerCase())) ||
          (member.lastName && member.lastName.toLowerCase().includes(filterValue.toLowerCase())) ||
          (member.email && member.email.toLowerCase().includes(filterValue.toLowerCase())) ||
          (member.mobile && member.mobile.toLowerCase().includes(filterValue.toLowerCase()))
        );
      });
    }
    filteredFaculty = filteredFaculty.filter((member) => member.department !== "Central");

    return filteredFaculty;
  }, [faculty, filterValue]);

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

  const renderCell = React.useCallback((facultyMember, columnKey) => {
    const cellValue = facultyMember[columnKey];
    switch (columnKey) {
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="View">
              <span
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                onClick={() => {
                  setModalMode("view");
                  setSelectedFaculty(facultyMember);
                  setModalOpen(true);
                }}
              >
                <EyeIcon />
              </span>
            </Tooltip>
            <Tooltip content="Edit">
              <span
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                onClick={() => {
                  setModalMode("edit");
                  setSelectedFaculty(facultyMember);
                  setModalOpen(true);
                }}
              >
                <EditIcon />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete">
              <span
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                onClick={() => deleteFaculty(facultyMember._id)}
              >
                <DeleteIcon />
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
    setSelectedFaculty(null);
  };

  const handleModalSubmit = async () => {
    if (modalMode === "add") {
      try {
        const response = await axios.post("/api/faculty", selectedFaculty);
        if (response.status === 200 || response.status === 201) {
          setFaculty([...faculty, response.data]);
          console.log("Faculty added successfully");
        } else {
          console.error("Failed to add faculty");
        }
      } catch (error) {
        console.error("Error adding faculty:", error);
      }
    } else if (modalMode === "edit") {
    }
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
                <span className="text-default-400 text-small">Total {faculty.length} users</span>
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
    faculty.length,
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
  }, [selectedKeys, items.length, page, pages]);

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
        aria-label="Faculty table with custom cells, pagination and sorting"
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
        <TableBody emptyContent={"No faculty members found"} items={sortedItems}>
          {(facultyMember) => (
            <TableRow key={facultyMember._id}>
              {(columnKey) => <TableCell>{renderCell(facultyMember, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <FacultyModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        mode={modalMode}
        faculty={selectedFaculty}
        onSubmit={handleModalSubmit}
        fetch = {fetchFaculty}
      />
    </>
  );
}

