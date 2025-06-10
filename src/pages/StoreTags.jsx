import React from "react";
import {
  FiRefreshCw,
  FiSearch,
  FiPrinter,
  FiTrash2,
  FiSettings,
  FiCheck,
  FiSquare,
} from "react-icons/fi";
import { Button } from "../components/ui/button";

function StoreTags() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 w-full">
      {/* Top Filters */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-4">
          <span className="font-semibold">Filter Sequences</span>
          <select className="border px-2 py-1 text-sm">
            <option>Select Store ...</option>
            <option>Select Store ...</option>
            <option>Select Store ...</option>
            <option>Select Store ...</option>
          </select>
          <select className="border px-2 py-1 text-sm">
            <option>Select Tag</option>
            <option>Select Tag</option>
            <option>Select Tag</option>
            <option>Select Tag</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Button className="bg-green-400 hover:text-white hover:bg-green-400 text-black px-3 py-1 flex items-center gap-1 rounded shadow">
            <FiRefreshCw /> Refresh
          </Button>
          <div className="flex items-center border px-2">
            <FiSearch className="text-gray-500" />
            <input
              type="text"
              placeholder=""
              className="border-0 focus:outline-none px-2 py-1 text-sm bg-transparent"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="border px-3 py-1 text-sm flex items-center gap-1">
            <FiCheck /> Select All
          </button>
          <button className="border px-3 py-1 text-sm flex items-center gap-1">
            <FiSquare /> Deselect All
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              {[
                "Sel",
                "BC #",
                "Item",
                "Description",
                "Template",
                "Date Created",
                "Created By",
              ].map((head, index) => (
                <th
                  key={index}
                  className="text-left px-2 py-2 border-r font-medium"
                >
                  <div className="flex items-center gap-1">
                    {head} 
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="7" className="text-center text-gray-400 py-12">
                {/* Empty state */}
              </td>
            </tr>
          </tbody>
        </table>
        <div className="flex justify-end items-center px-4 py-2 bg-gray-100 border-t">
          <span className="text-sm">Page</span>
          <input
            type="text"
            defaultValue={1}
            className="mx-2 w-8 text-center border rounded text-sm"
          />
          <span className="text-sm">of 1</span>
        </div>
      </div>

      {/* Bottom Buttons */}
      <div className="flex justify-center gap-4 mt-6">
        <div className="bg-orange-100 p-2">
          <button className="border-2 border-cyan-500 px-4 py-2 flex items-center gap-2 text-black">
            <FiPrinter /> Print Selected
          </button>
        </div>
        <div className="bg-orange-100 p-2">
          <button className="px-4 py-2 flex items-center gap-2 text-black">
            <FiPrinter /> Print All
          </button>
        </div>
        <div className="bg-orange-100 p-2">
          <button className="px-4 py-2 flex items-center gap-2 text-black">
            <FiTrash2 /> Delete Selected
          </button>
        </div>
        <div className="bg-orange-100 p-2">
          <button className="px-4 py-2 flex items-center gap-2 text-black">
            <FiSettings /> Settings
          </button>
        </div>
      </div>
    </div>
  );
}

export default StoreTags;
