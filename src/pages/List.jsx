import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  FiEdit,
  FiCopy,
  FiPrinter,
  FiTrash2,
  FiRefreshCw,
  FiChevronUp,
  FiChevronDown,
} from "react-icons/fi";
import { Button } from "../../src/components/ui/button";
import { FaSortUp, FaSortDown } from "react-icons/fa";

const tagData = [
  {
    title: "vv",
    createdBy: "Amitesh Sinha",
    dateCreated: "15-07-2025",
    dateModified: "15-07-2025",
    modifiedBy: "Admin",
  },
  {
    title: "vv",
    createdBy: "Amitesh Sinha",
    dateCreated: "12-07-2025",
    dateModified: "12-07-2025",
    modifiedBy: "user",
  },
  {
    title: "vv",
    createdBy: "Amitesh Sinha",
    dateCreated: "09-07-2025",
    dateModified: "09-07-2025",
    modifiedBy: "Admin",
  },
  {
    title: "vv",
    createdBy: "Amitesh Sinha",
    dateCreated: "08-07-2025",
    dateModified: "08-07-2025",
    modifiedBy: "Admin",
  },
  {
    title: "vv",
    createdBy: "Amitesh Sinha",
    dateCreated: "07-07-2025",
    dateModified: "07-07-2025",
    modifiedBy: "Admin",
  },
  // Add more data as per your list...
];
function List() {
  const [tagList, setTagList] = useState(tagData);
  const [openDropdown, setOpenDropdown] = useState(null);

  const SortableHeader = ({ label, columnKey }) => (
    <TableHead className="relative text-black dark:text-white">
      <div
        className="flex items-center gap-1 cursor-pointer"
        onClick={() =>
          setOpenDropdown((prev) => (prev === columnKey ? null : columnKey))
        }
      >
        {label}
        <div className="flex flex-col">
          <FaSortUp className="text-xs -mb-1" />
          <FaSortDown className="text-xs -mt-1" />
        </div>
      </div>

      {openDropdown === columnKey && (
        <div className="absolute z-10 mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow rounded p-2 w-36">
          <div className="hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 text-sm cursor-pointer">
            Sort Ascending
          </div>
          <div className="hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 text-sm cursor-pointer">
            Sort Descending
          </div>
          <div className="hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 text-sm cursor-pointer">
            Clear Sort
          </div>
        </div>
      )}
    </TableHead>
  );
  return (
    <div className="p-6 bg-white dark:bg-black rounded-lg shadow-md w-full">
      {/* Header Row with Refresh */}
      <div className="flex items-center gap-4 mb-4">
        <h2 className="text-2xl font-bold text-black dark:text-white">
          Saved Templates
        </h2>
        <Button
          className="p-2 rounded bg-gray-100 dark:bg-zinc-800 hover:bg-gray-400 dark:hover:bg-zinc-700"
          title="Refresh"
        >
          <FiRefreshCw className="text-xl text-black dark:text-white" />
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border dark:border-gray-800">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100 dark:bg-zinc-900 text-black dark:text-white">
              <SortableHeader label="Title" columnKey="title" />
              <SortableHeader label="Created By" columnKey="createdBy" />
              <SortableHeader label="Date Created" columnKey="dateCreated" />
              <SortableHeader label="Date Modified" columnKey="dateModified" />
              <SortableHeader label="Modified By" columnKey="modifiedBy" />
              <TableHead>Edit</TableHead>
              <TableHead>Clone</TableHead>
              <TableHead>Print</TableHead>
              <TableHead>Delete</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {tagList.map((tag, idx) => (
              <TableRow key={idx}>
                <TableCell>{tag.title}</TableCell>
                <TableCell>{tag.createdBy}</TableCell>
                <TableCell>{tag.dateCreated}</TableCell>
                <TableCell>{tag.dateModified}</TableCell>
                <TableCell>{tag.modifiedBy}</TableCell>

                <TableCell >
                  <Button className="flex items-center gap-1 px-2 py-1 text-sm rounded bg-gray-300 hover:bg-gray-600 text-black transition">
                    <FiEdit className="text-sm" />
                    Edit
                  </Button>
                </TableCell>

                <TableCell>
                  <Button className="flex items-center gap-1 px-2 py-1 text-sm rounded bg-gray-300 hover:bg-gray-400 text-black transition">
                    <FiCopy className="text-sm" />
                    Clone
                  </Button>
                </TableCell>

                <TableCell>
                  <Button className="flex items-center gap-1 px-2 py-1 text-sm rounded bg-gray-300 hover:bg-gray-400 text-black transition">
                    <FiPrinter className="text-sm" />
                    Print
                  </Button>
                </TableCell>

                <TableCell>
                  <Button className="flex items-center gap-1 px-2 py-1 text-sm rounded bg-gray-300 hover:bg-gray-400 text-black transition">
                    <FiTrash2 className="text-sm" />
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default List;
