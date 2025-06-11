import React, { useState } from 'react';
import {
  FiRefreshCw,
  FiSearch,
  FiCheck,
  FiSquare,
  FiPrinter,
  FiSettings,
  FiFileText,
  FiEye,
} from 'react-icons/fi';
import { FaSortDown } from 'react-icons/fa';
import { Button } from "../components/ui/button";

const Print = () => {
  // State for top section dropdowns
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showSubCategoryDropdown, setShowSubCategoryDropdown] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [showStoreDropdown, setShowStoreDropdown] = useState(false);
  const [selectedStore, setSelectedStore] = useState('');
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [isInStock, setIsInStock] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Dummy data for dropdowns
  const categories = ['Category 1', 'Category 2', 'Category 3'];
  const subCategories = ['SubCategory A', 'SubCategory B', 'SubCategory C'];
  const stores = ['Store X', 'Store Y', 'Store Z'];
  const suppliers = ['Supplier P', 'Supplier Q', 'Supplier P'];

  // Dummy table data (you'll replace this with real data)
  const tableData = [
    {
      id: 1,
      bc: 'BC-001',
      itemId: 'ITEM-001',
      description: 'Product Description 1',
      mainCategory: 'Main Cat A',
      subCategory: 'Sub Cat A',
      store: 'Store X',
      supplier: 'Supplier P',
    },
    {
      id: 2,
      bc: 'BC-002',
      itemId: 'ITEM-002',
      description: 'Product Description 2',
      mainCategory: 'Main Cat B',
      subCategory: 'Sub Cat B',
      store: 'Store Y',
      supplier: 'Supplier Q',
    },
    // Add more dummy data as needed
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 w-full">
      {/* Top Controls */}
      <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
        <span className="font-semibold text-gray-700">Select Records To Print</span>

        <div className="flex flex-wrap items-center gap-2 flex-grow justify-end">
          {/* Category Dropdown */}
          <div className="relative w-48">
            <div
              className="border border-gray-300 px-3 py-1 text-sm flex items-center justify-between cursor-pointer bg-white rounded shadow-sm w-full"
              onClick={() => {
                setShowCategoryDropdown(!showCategoryDropdown);
                setShowSubCategoryDropdown(false);
                setShowStoreDropdown(false);
                setShowSupplierDropdown(false);
              }}
            >
              <span>{selectedCategory || 'Select Category'}</span>
              <FaSortDown className="ml-2 text-gray-500" />
            </div>
            {showCategoryDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg">
                <ul className="py-1">
                  {categories.map((cat) => (
                    <li
                      key={cat}
                      className="px-3 py-1 cursor-pointer hover:bg-gray-100 text-sm"
                      onClick={() => {
                        setSelectedCategory(cat);
                        setShowCategoryDropdown(false);
                      }}
                    >
                      {cat}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* SubCategory Dropdown */}
          <div className="relative w-48">
            <div
              className="border border-gray-300 px-3 py-1 text-sm flex items-center justify-between cursor-pointer bg-white rounded shadow-sm w-full"
              onClick={() => {
                setShowSubCategoryDropdown(!showSubCategoryDropdown);
                setShowCategoryDropdown(false);
                setShowStoreDropdown(false);
                setShowSupplierDropdown(false);
              }}
            >
              <span>{selectedSubCategory || 'Select SubCategory'}</span>
              <FaSortDown className="ml-2 text-gray-500" />
            </div>
            {showSubCategoryDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg">
                <ul className="py-1">
                  {subCategories.map((subCat) => (
                    <li
                      key={subCat}
                      className="px-3 py-1 cursor-pointer hover:bg-gray-100 text-sm"
                      onClick={() => {
                        setSelectedSubCategory(subCat);
                        setShowSubCategoryDropdown(false);
                      }}
                    >
                      {subCat}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Store Dropdown */}
          <div className="relative w-48">
            <div
              className="border border-gray-300 px-3 py-1 text-sm flex items-center justify-between cursor-pointer bg-white rounded shadow-sm w-full"
              onClick={() => {
                setShowStoreDropdown(!showStoreDropdown);
                setShowCategoryDropdown(false);
                setShowSubCategoryDropdown(false);
                setShowSupplierDropdown(false);
              }}
            >
              <span>{selectedStore || 'Select Store'}</span>
              <FaSortDown className="ml-2 text-gray-500" />
            </div>
            {showStoreDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg">
                <ul className="py-1">
                  {stores.map((store) => (
                    <li
                      key={store}
                      className="px-3 py-1 cursor-pointer hover:bg-gray-100 text-sm"
                      onClick={() => {
                        setSelectedStore(store);
                        setShowStoreDropdown(false);
                      }}
                    >
                      {store}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Supplier Dropdown */}
          <div className="relative w-48">
            <div
              className="border border-gray-300 px-3 py-1 text-sm flex items-center justify-between cursor-pointer bg-white rounded shadow-sm w-full"
              onClick={() => {
                setShowSupplierDropdown(!showSupplierDropdown);
                setShowCategoryDropdown(false);
                setShowSubCategoryDropdown(false);
                setShowStoreDropdown(false);
              }}
            >
              <span>{selectedSupplier || 'Select Supplier'}</span>
              <FaSortDown className="ml-2 text-gray-500" />
            </div>
            {showSupplierDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg">
                <ul className="py-1">
                  {suppliers.map((supplier) => (
                    <li
                      key={supplier}
                      className="px-3 py-1 cursor-pointer hover:bg-gray-100 text-sm"
                      onClick={() => {
                        setSelectedSupplier(supplier);
                        setShowSupplierDropdown(false);
                      }}
                    >
                      {supplier}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Refresh and Clear Buttons */}
          <Button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 flex items-center gap-1 rounded shadow h-auto">
            <FiRefreshCw /> Refresh
          </Button>
          <Button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 flex items-center gap-1 rounded shadow h-auto">
            Clear
          </Button>

          {/* In Stock Checkbox */}
          <div className="flex items-center ml-4">
            <input
              type="checkbox"
              checked={isInStock}
              onChange={() => setIsInStock(!isInStock)}
              className="mr-2 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">In Stock</span>
          </div>

          {/* Search Input */}
          <div className="flex items-center border border-gray-300 px-2 rounded shadow-sm bg-white h-auto">
            <FiSearch className="text-gray-500 mr-1" />
            <input
              type="text"
              placeholder=""
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 focus:outline-none px-1 py-1 text-sm bg-transparent w-32"
            />
          </div>

          {/* Select All / Deselect All */}
          <Button className="border border-gray-300 px-3 py-1 text-sm flex items-center gap-1 bg-white hover:bg-gray-100 rounded shadow-sm text-gray-700 h-auto">
            <FiCheck /> Select All
          </Button>
          <Button className="border border-gray-300 px-3 py-1 text-sm flex items-center gap-1 bg-white hover:bg-gray-100 rounded shadow-sm text-gray-700 h-auto">
            <FiSquare /> Deselect All
          </Button>
        </div>


      </div>

      {/* Table */}
      <div className="border border-gray-300 rounded bg-white shadow-md overflow-hidden mb-4">
        <table className="w-full text-sm table-auto">
          <thead className="bg-gray-100">
            <tr>
              {['Selec:', 'BC #', 'Item Id', 'Description', 'Main Category', 'Sub Category', 'Store', 'Supplier'].map((header, index) => (
                <th key={index} className="text-left px-3 py-2 border-r border-b font-medium text-gray-700 whitespace-nowrap">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={row.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-3 py-2 border-r border-b">
                  <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" />
                </td>
                <td className="px-3 py-2 border-r border-b whitespace-nowrap">{row.bc}</td>
                <td className="px-3 py-2 border-r border-b whitespace-nowrap">{row.itemId}</td>
                <td className="px-3 py-2 border-r border-b whitespace-nowrap">{row.description}</td>
                <td className="px-3 py-2 border-r border-b whitespace-nowrap">{row.mainCategory}</td>
                <td className="px-3 py-2 border-r border-b whitespace-nowrap">{row.subCategory}</td>
                <td className="px-3 py-2 border-r border-b whitespace-nowrap">{row.store}</td>
                <td className="px-3 py-2 border-r border-b whitespace-nowrap">{row.supplier}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        {/* Top Right Pagination */}
        <div className="flex justify-end items-center gap-2 ml-auto">
          <button className="text-gray-500 hover:text-gray-700">{'<<'}</button>
          <button className="text-gray-500 hover:text-gray-700">{'<'}</button>
          <button className="text-gray-500 hover:text-gray-700">{'>'}</button>
          <button className="text-gray-500 hover:text-gray-700">{'>>'}</button>
          <span className="text-sm">Page</span>
          <input
            type="text"
            defaultValue={1}
            className="mx-1 w-8 text-center border border-gray-300 rounded text-sm"
          />
          <span className="text-sm">of 1</span>
        </div>
      {/* Bottom Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mt-6">
        <Button className="bg-orange-100 border border-orange-300 px-4 py-2 flex items-center gap-2 text-black hover:bg-orange-200 rounded shadow-sm h-auto">
          <FiEye /> Preview
        </Button>
        <Button className="bg-orange-100 border border-orange-300 px-4 py-2 flex items-center gap-2 text-black hover:bg-orange-200 rounded shadow-sm h-auto">
          <FiFileText /> Create PDF
        </Button>
        <Button className="bg-orange-100 border border-orange-300 px-4 py-2 flex items-center gap-2 text-black hover:bg-orange-200 rounded shadow-sm h-auto">
          <FiPrinter /> Print
        </Button>
        <Button className="bg-orange-100 border border-orange-300 px-4 py-2 flex items-center gap-2 text-black hover:bg-orange-200 rounded shadow-sm h-auto">
          <FiSettings /> Settings
        </Button>
      </div>
    </div>
  );
};

export default Print;