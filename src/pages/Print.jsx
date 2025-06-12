import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  FiRefreshCw,
  FiSearch,
  FiCheck,
  FiSquare,
  FiPrinter,
  FiSettings,
  FiFileText,
  FiEye,
  FiTrash2,
  FiX,
} from 'react-icons/fi';
import { FaSortDown, FaSortUp } from 'react-icons/fa';
import { Button } from "../components/ui/button";
import { createPortal } from 'react-dom';
import { format } from 'date-fns';
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, HelpCircle } from "lucide-react";

// Reusable FilterDropdown Component
const FilterDropdown = ({
  isOpen,
  onClose,
  title,
  allSelected,
  onSelectAll,
  items,
  selectedItems,
  onItemSelect,
  searchQuery1,
  searchQuery2,
  onSearchQuery1Change,
  onSearchQuery2Change,
  condition1,
  condition2,
  onCondition1Change,
  onCondition2Change,
  combiner,
  onCombinerChange,
  onFilter,
  onClearFilter,
  position,
  isDateField = false,
  isSimpleFilter = false, // New prop for simple filter layout
}) => {
  const [date1, setDate1] = useState(null);
  const [date2, setDate2] = useState(null);
  const [localSearchQuery1, setLocalSearchQuery1] = useState(searchQuery1);
  const [localSearchQuery2, setLocalSearchQuery2] = useState(searchQuery2);

  useEffect(() => {
    setLocalSearchQuery1(searchQuery1);
    setLocalSearchQuery2(searchQuery2);
  }, [searchQuery1, searchQuery2]);

  const handleFilterClick = () => {
    onSearchQuery1Change({ target: { value: localSearchQuery1 } });
    onSearchQuery2Change({ target: { value: localSearchQuery2 } });
    onFilter();
  };

  if (!isOpen) return null;

  const handleDateSelect = (date, isFirstInput) => {
    if (isFirstInput) {
      setDate1(date);
      setLocalSearchQuery1(format(date, "dd-MM-yyyy"));
    } else {
      setDate2(date);
      setLocalSearchQuery2(format(date, "dd-MM-yyyy"));
    }
  };

  return (
    <div
      className="absolute z-[9999] bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 shadow rounded p-2 w-[250px] border-2"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={onSelectAll}
            className="mr-2 h-4 w-4 shadow-sm"
          />
          <span className="">Select All</span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <FiX className="h-4 w-4" />
        </button>
      </div>

      <div className="max-h-32 overflow-y-auto mb-2 border-2 p-2">
        {items.map((item) => (
          <div key={item} className="flex items-center mb-1">
            <input
              type="checkbox"
              checked={selectedItems.has ? selectedItems.has(item) : selectedItems.includes(item)}
              onChange={() => onItemSelect(item)}
              className="mr-2 h-4 w-4"
            />
            <span className="font-normal">{item}</span>
          </div>
        ))}
      </div>

      {!isSimpleFilter && (
        <div className="mt-4 pt-2 border-t border-gray-300">
          <h3 className="font-normal mb-2">Show rows with value that</h3>
          <div className="flex flex-col gap-2">
            <div className="items-center gap-2 ">
              <select
                className="border rounded p-1 w-full text-sm bg-gradient-to-b from-gray-200 to-gray-400 focus:outline-none"
                value={condition1}
                onChange={onCondition1Change}
              >
                <option>Is equal to</option>
                <option>Does not equal</option>
                <option>Contains</option>
                <option>Does not contain</option>
                <option>Starts with</option>
                <option>Ends with</option>
              </select>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  className="border border-blue-400 focus:outline-none rounded p-1 w-[80%] flex-1 text-sm bg-white dark:bg-gray-700 dark:text-white"
                  value={localSearchQuery1}
                  onChange={(e) => setLocalSearchQuery1(e.target.value)}
                  readOnly={isDateField}
                />
                {isDateField ? (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="bg-gray-200 ml-2 text-gray-700 hover:bg-none text-xs px-2 rounded"
                      >
                        <CalendarIcon className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0 z-[10000]"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={date1}
                        onSelect={(date) => handleDateSelect(date, true)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                ) : (
                  <Button
                    onClick={handleFilterClick}
                    className="bg-gray-200 ml-2 mt-2 text-gray-700 hover:bg-gray-200 text-xs px-2 rounded"
                  >
                    aA
                  </Button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <select
                className="border rounded p-1 text-sm bg-gradient-to-b from-gray-200 to-gray-400 focus:outline-none w-full"
                value={combiner}
                onChange={onCombinerChange}
              >
                <option>And</option>
                <option>Or</option>
              </select>
            </div>

            <div className="items-center gap-2">
              <select
                className="border rounded p-1 text-sm bg-gradient-to-b from-gray-200 to-gray-400 focus:outline-none w-full"
                value={condition2}
                onChange={onCondition2Change}
              >
                <option>Is equal to</option>
                <option>Does not equal</option>
                <option>Contains</option>
                <option>Does not contain</option>
                <option>Starts with</option>
                <option>Ends with</option>
              </select>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  className="border border-blue-400 focus:outline-none rounded p-1 flex-1 w-[80%] text-sm bg-white dark:bg-gray-700 dark:text-white"
                  value={localSearchQuery2}
                  onChange={(e) => setLocalSearchQuery2(e.target.value)}
                  readOnly={isDateField}
                />
                {isDateField ? (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="bg-gray-200 text-gray-700 mt-2 ml-2 text-xs px-2 py-1 rounded dark:bg-gray-600 dark:text-white hover:bg-gray-200"
                      >
                        <CalendarIcon className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0 z-[10000]"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={date2}
                        onSelect={(date) => handleDateSelect(date, false)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                ) : (
                  <Button
                    onClick={handleFilterClick}
                    className="bg-gray-200 text-gray-700 mt-2 ml-2 text-xs px-2 py-1 rounded hover:bg-gray-200 dark:bg-gray-600 dark:text-white"
                  >
                    aA
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-2 mt-4">
        <button
          className="flex-1 bg-gray-300 text-black py-1 rounded font-normal"
          onClick={handleFilterClick}
        >
          Filter
        </button>
        <button
          className="flex-1 bg-gray-300 text-black py-1 rounded font-normal"
          onClick={onClearFilter}
        >
          Clear Filter
        </button>
      </div>
    </div>
  );
};

const Print = () => {
  // State for top section dropdowns
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showSubCategoryDropdown, setShowSubCategoryDropdown] = useState(false);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [showStoreDropdown, setShowStoreDropdown] = useState(false);
  const [selectedStores, setSelectedStores] = useState([]);
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
  const [selectedSuppliers, setSelectedSuppliers] = useState([]);
  const [isInStock, setIsInStock] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // New state variables for filtering
  const [bcFilterDropdown, setBcFilterDropdown] = useState(false);
  const [itemIdFilterDropdown, setItemIdFilterDropdown] = useState(false);
  const [descriptionFilterDropdown, setDescriptionFilterDropdown] = useState(false);
  const [mainCategoryFilterDropdown, setMainCategoryFilterDropdown] = useState(false);
  const [subCategoryFilterDropdown, setSubCategoryFilterDropdown] = useState(false);
  const [storeFilterDropdown, setStoreFilterDropdown] = useState(false);
  const [supplierFilterDropdown, setSupplierFilterDropdown] = useState(false);
  const [tagListFilterDropdown, setTagListFilterDropdown] = useState(false);

  const [selectedBcs, setSelectedBcs] = useState([]);
  const [selectedItemIds, setSelectedItemIds] = useState([]);
  const [selectedDescriptions, setSelectedDescriptions] = useState([]);
  const [selectedMainCategories, setSelectedMainCategories] = useState([]);

  const [bcSearchQuery1, setBcSearchQuery1] = useState("");
  const [bcSearchQuery2, setBcSearchQuery2] = useState("");
  const [itemIdSearchQuery1, setItemIdSearchQuery1] = useState("");
  const [itemIdSearchQuery2, setItemIdSearchQuery2] = useState("");
  const [descriptionSearchQuery1, setDescriptionSearchQuery1] = useState("");
  const [descriptionSearchQuery2, setDescriptionSearchQuery2] = useState("");
  const [mainCategorySearchQuery1, setMainCategorySearchQuery1] = useState("");
  const [mainCategorySearchQuery2, setMainCategorySearchQuery2] = useState("");
  const [subCategorySearchQuery1, setSubCategorySearchQuery1] = useState("");
  const [subCategorySearchQuery2, setSubCategorySearchQuery2] = useState("");
  const [storeSearchQuery1, setStoreSearchQuery1] = useState("");
  const [storeSearchQuery2, setStoreSearchQuery2] = useState("");
  const [supplierSearchQuery1, setSupplierSearchQuery1] = useState("");
  const [supplierSearchQuery2, setSupplierSearchQuery2] = useState("");
  const [tagListSearchQuery1, setTagListSearchQuery1] = useState("");
  const [tagListSearchQuery2, setTagListSearchQuery2] = useState("");

  const [bcCondition1, setBcCondition1] = useState("Is equal to");
  const [bcCondition2, setBcCondition2] = useState("Is equal to");
  const [itemIdCondition1, setItemIdCondition1] = useState("Is equal to");
  const [itemIdCondition2, setItemIdCondition2] = useState("Is equal to");
  const [descriptionCondition1, setDescriptionCondition1] = useState("Is equal to");
  const [descriptionCondition2, setDescriptionCondition2] = useState("Is equal to");
  const [mainCategoryCondition1, setMainCategoryCondition1] = useState("Is equal to");
  const [mainCategoryCondition2, setMainCategoryCondition2] = useState("Is equal to");
  const [subCategoryCondition1, setSubCategoryCondition1] = useState("Is equal to");
  const [subCategoryCondition2, setSubCategoryCondition2] = useState("Is equal to");
  const [storeCondition1, setStoreCondition1] = useState("Is equal to");
  const [storeCondition2, setStoreCondition2] = useState("Is equal to");
  const [supplierCondition1, setSupplierCondition1] = useState("Is equal to");
  const [supplierCondition2, setSupplierCondition2] = useState("Is equal to");
  const [tagListCondition1, setTagListCondition1] = useState("Is equal to");
  const [tagListCondition2, setTagListCondition2] = useState("Is equal to");

  const [bcCombiner, setBcCombiner] = useState("And");
  const [itemIdCombiner, setItemIdCombiner] = useState("And");
  const [descriptionCombiner, setDescriptionCombiner] = useState("And");
  const [mainCategoryCombiner, setMainCategoryCombiner] = useState("And");
  const [subCategoryCombiner, setSubCategoryCombiner] = useState("And");
  const [storeCombiner, setStoreCombiner] = useState("And");
  const [supplierCombiner, setSupplierCombiner] = useState("And");
  const [tagListCombiner, setTagListCombiner] = useState("And");

  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const headerRefs = useRef({});

  // Dummy data for dropdowns
  const categories = [
    'Electronics',
    'Clothing',
    'Home & Kitchen',
    'Beauty & Personal Care',
    'Sports & Outdoors',
    'Books & Stationery',
    'Toys & Games',
    'Health & Wellness',
    'Automotive',
    'Jewelry & Accessories'
  ];

  // Convert subCategories object to array for mapping
  const subCategories = [
    'Smartphones', 'Laptops', 'Tablets', 'Accessories', 'Audio Devices', 'Gaming Consoles',
    'Men\'s Wear', 'Women\'s Wear', 'Kids\' Wear', 'Footwear', 'Winter Wear', 'Summer Collection',
    'Furniture', 'Kitchen Appliances', 'Home Decor', 'Bedding', 'Bath', 'Lighting',
    'Skincare', 'Makeup', 'Haircare', 'Fragrances', 'Personal Hygiene', 'Men\'s Grooming',
    'Fitness Equipment', 'Sports Gear', 'Outdoor Gear', 'Team Sports', 'Yoga & Meditation',
    'Fiction', 'Non-Fiction', 'Educational', 'Office Supplies', 'Art Supplies', 'Gift Items',
    'Educational Toys', 'Action Figures', 'Board Games', 'Puzzles', 'Outdoor Toys', 'Video Games',
    'Vitamins & Supplements', 'Medical Devices', 'Fitness Trackers', 'Health Monitors', 'First Aid',
    'Car Accessories', 'Car Care', 'Motorcycle Parts', 'Tools & Equipment', 'GPS & Navigation',
    'Necklaces', 'Earrings', 'Watches', 'Bags & Wallets', 'Sunglasses', 'Belts'
  ];

  const stores = [
    'Mega Mall - Downtown',
    'City Center Plaza',
    'Westside Shopping Complex',
    'Eastside Retail Park',
    'Northside Mall',
    'Southside Shopping Center',
    'Metro Retail Hub',
    'Grand Plaza Mall',
    'Central Market',
    'Premium Outlets'
  ];

  const suppliers = [
    'Global Electronics Ltd.',
    'Fashion Forward Inc.',
    'Home Essentials Co.',
    'Beauty World International',
    'Sports Gear Pro',
    'Book Haven Publishers',
    'Toy Kingdom Corp',
    'Health Plus Suppliers',
    'Auto Parts Direct',
    'Luxury Accessories Co.',
    'Smart Tech Solutions',
    'Urban Fashion House',
    'Kitchen Master Supplies',
    'Wellness Products Inc.',
    'Outdoor Adventure Gear'
  ];

  // Dummy table data (you'll replace this with real data)
  const tableData = [
    {
      id: 1,
      bc: 'BC-101',
      itemId: 'ITEM-101',
      description: 'iPhone 13 Pro Max',
      mainCategory: 'Electronics',
      subCategory: 'Smartphones',
      store: 'Mega Mall - Downtown',
      supplier: 'Global Electronics Ltd.'
    },
    {
      id: 2,
      bc: 'BC-102',
      itemId: 'ITEM-102',
      description: 'Men\'s Casual Shirt',
      mainCategory: 'Clothing',
      subCategory: 'Men\'s Wear',
      store: 'City Center Plaza',
      supplier: 'Fashion Forward Inc.'
    },
    {
      id: 3,
      bc: 'BC-103',
      itemId: 'ITEM-103',
      description: 'Smart LED TV 55"',
      mainCategory: 'Electronics',
      subCategory: 'Accessories',
      store: 'Westside Shopping Complex',
      supplier: 'Smart Tech Solutions'
    },
    {
      id: 4,
      bc: 'BC-104',
      itemId: 'ITEM-104',
      description: 'Kitchen Mixer Grinder',
      mainCategory: 'Home & Kitchen',
      subCategory: 'Kitchen Appliances',
      store: 'Eastside Retail Park',
      supplier: 'Kitchen Master Supplies'
    },
    {
      id: 5,
      bc: 'BC-105',
      itemId: 'ITEM-105',
      description: 'Premium Skincare Set',
      mainCategory: 'Beauty & Personal Care',
      subCategory: 'Skincare',
      store: 'Northside Mall',
      supplier: 'Beauty World International'
    },
    {
      id: 6,
      bc: 'BC-106',
      itemId: 'ITEM-106',
      description: 'Yoga Mat Premium',
      mainCategory: 'Sports & Outdoors',
      subCategory: 'Yoga & Meditation',
      store: 'Southside Shopping Center',
      supplier: 'Outdoor Adventure Gear'
    },
    {
      id: 7,
      bc: 'BC-107',
      itemId: 'ITEM-107',
      description: 'Best Seller Novel',
      mainCategory: 'Books & Stationery',
      subCategory: 'Fiction',
      store: 'Metro Retail Hub',
      supplier: 'Book Haven Publishers'
    },
    {
      id: 8,
      bc: 'BC-108',
      itemId: 'ITEM-108',
      description: 'Educational Building Blocks',
      mainCategory: 'Toys & Games',
      subCategory: 'Educational Toys',
      store: 'Grand Plaza Mall',
      supplier: 'Toy Kingdom Corp'
    },
    {
      id: 9,
      bc: 'BC-109',
      itemId: 'ITEM-109',
      description: 'Digital Blood Pressure Monitor',
      mainCategory: 'Health & Wellness',
      subCategory: 'Health Monitors',
      store: 'Central Market',
      supplier: 'Health Plus Suppliers'
    },
    {
      id: 10,
      bc: 'BC-110',
      itemId: 'ITEM-110',
      description: 'Car GPS Navigation System',
      mainCategory: 'Automotive',
      subCategory: 'GPS & Navigation',
      store: 'Premium Outlets',
      supplier: 'Auto Parts Direct'
    }
     
  ];

  // Get unique values
  const uniqueBcs = Array.from(new Set(tableData.map((item) => item.bc)));
  const uniqueItemIds = Array.from(new Set(tableData.map((item) => item.itemId)));
  const uniqueDescriptions = Array.from(new Set(tableData.map((item) => item.description)));
  const uniqueMainCategories = Array.from(new Set(tableData.map((item) => item.mainCategory)));
  const uniqueSubCategories = Array.from(new Set(tableData.map((item) => item.subCategory)));
  const uniqueStores = Array.from(new Set(tableData.map((item) => item.store)));
  const uniqueSuppliers = Array.from(new Set(tableData.map((item) => item.supplier)));

  // Add these lines to define the "all selected" variables
  const allBcsSelected = selectedBcs.length === uniqueBcs.length;
  const allItemIdsSelected = selectedItemIds.length === uniqueItemIds.length;
  const allDescriptionsSelected = selectedDescriptions.length === uniqueDescriptions.length;
  const allMainCategoriesSelected = selectedMainCategories.length === uniqueMainCategories.length;
  const allSubCategoriesSelected = selectedSubCategories.length === uniqueSubCategories.length;
  const allStoresSelected = selectedStores.length === uniqueStores.length;
  const allSuppliersSelected = selectedSuppliers.length === uniqueSuppliers.length;

  // Define a new state for selected Tag List filter options
  const [selectedTagListStatus, setSelectedTagListStatus] = useState(new Set());

  // New unique values for Tag List filter (derived from selection state)
  const uniqueTagListItems = ['Selected', 'False']; // Changed 'Not Selected' to 'False'

  // Determine if all Tag List items are selected
  const allTagListItemsSelected = selectedTagListStatus.size === uniqueTagListItems.length;

  // Add filteredData state
  const [filteredData, setFilteredData] = useState(tableData);

  // Update the handleFilter function to include both top dropdowns and column filters
  const handleFilter = useCallback(() => {
    let currentFilteredList = tableData;

    // Apply top dropdown filters
    if (selectedCategories.size > 0) {
      currentFilteredList = currentFilteredList.filter(item =>
        selectedCategories.has(item.mainCategory)
      );
    }

    if (selectedSubCategories.size > 0) {
      currentFilteredList = currentFilteredList.filter(item =>
        selectedSubCategories.has(item.subCategory)
      );
    }

    if (selectedStores.size > 0) {
      currentFilteredList = currentFilteredList.filter(item =>
        selectedStores.has(item.store)
      );
    }

    if (selectedSuppliers.size > 0) {
      currentFilteredList = currentFilteredList.filter(item =>
        selectedSuppliers.has(item.supplier)
      );
    }

    // Apply column filters
    if (selectedBcs.length > 0) {
      currentFilteredList = currentFilteredList.filter((item) =>
        selectedBcs.includes(item.bc)
      );
    }

    if (selectedItemIds.length > 0) {
      currentFilteredList = currentFilteredList.filter((item) =>
        selectedItemIds.includes(item.itemId)
      );
    }

    if (selectedDescriptions.length > 0) {
      currentFilteredList = currentFilteredList.filter((item) =>
        selectedDescriptions.includes(item.description)
      );
    }

    if (selectedMainCategories.length > 0) {
      currentFilteredList = currentFilteredList.filter((item) =>
        selectedMainCategories.includes(item.mainCategory)
      );
    }

    if (selectedSubCategories.length > 0) {
      currentFilteredList = currentFilteredList.filter((item) =>
        selectedSubCategories.includes(item.subCategory)
      );
    }

    if (selectedStores.length > 0) {
      currentFilteredList = currentFilteredList.filter((item) =>
        selectedStores.includes(item.store)
      );
    }

    if (selectedSuppliers.length > 0) {
      currentFilteredList = currentFilteredList.filter((item) =>
        selectedSuppliers.includes(item.supplier)
      );
    }

    // Apply Tag List filter
    if (selectedTagListStatus.size > 0) {
      currentFilteredList = currentFilteredList.filter((item) => {
        const isItemSelected = selectedItems.includes(item.id);
        if (selectedTagListStatus.has('Selected') && selectedTagListStatus.has('False')) {
          // Both are selected, no effective filter on this dimension
          return true;
        } else if (selectedTagListStatus.has('Selected')) {
          return isItemSelected;
        } else if (selectedTagListStatus.has('False')) {
          return !isItemSelected;
        }
        return false;
      });
    }

    // Apply text filters
    if (bcSearchQuery1 || bcSearchQuery2) {
      currentFilteredList = currentFilteredList.filter((item) => {
        const bc = String(item.bc || "");
        let match1 = true;
        let match2 = true;

        if (bcSearchQuery1) {
          match1 = applyCondition(bc, bcSearchQuery1, bcCondition1);
        }

        if (bcSearchQuery2) {
          match2 = applyCondition(bc, bcSearchQuery2, bcCondition2);
        }

        return bcCombiner === "And" ? match1 && match2 : match1 || match2;
      });
    }

    if (itemIdSearchQuery1 || itemIdSearchQuery2) {
      currentFilteredList = currentFilteredList.filter((item) => {
        const itemId = String(item.itemId || "");
        let match1 = true;
        let match2 = true;

        if (itemIdSearchQuery1) {
          match1 = applyCondition(itemId, itemIdSearchQuery1, itemIdCondition1);
        }

        if (itemIdSearchQuery2) {
          match2 = applyCondition(itemId, itemIdSearchQuery2, itemIdCondition2);
        }

        return itemIdCombiner === "And" ? match1 && match2 : match1 || match2;
      });
    }

    if (descriptionSearchQuery1 || descriptionSearchQuery2) {
      currentFilteredList = currentFilteredList.filter((item) => {
        const description = String(item.description || "");
        let match1 = true;
        let match2 = true;

        if (descriptionSearchQuery1) {
          match1 = applyCondition(description, descriptionSearchQuery1, descriptionCondition1);
        }

        if (descriptionSearchQuery2) {
          match2 = applyCondition(description, descriptionSearchQuery2, descriptionCondition2);
        }

        return descriptionCombiner === "And" ? match1 && match2 : match1 || match2;
      });
    }

    if (mainCategorySearchQuery1 || mainCategorySearchQuery2) {
      currentFilteredList = currentFilteredList.filter((item) => {
        const category = String(item.mainCategory || "");
        let match1 = true;
        let match2 = true;

        if (mainCategorySearchQuery1) {
          match1 = applyCondition(category, mainCategorySearchQuery1, mainCategoryCondition1);
        }

        if (mainCategorySearchQuery2) {
          match2 = applyCondition(category, mainCategorySearchQuery2, mainCategoryCondition2);
        }

        return mainCategoryCombiner === "And" ? match1 && match2 : match1 || match2;
      });
    }

    if (subCategorySearchQuery1 || subCategorySearchQuery2) {
      currentFilteredList = currentFilteredList.filter((item) => {
        const category = String(item.subCategory || "");
        let match1 = true;
        let match2 = true;

        if (subCategorySearchQuery1) {
          match1 = applyCondition(category, subCategorySearchQuery1, subCategoryCondition1);
        }

        if (subCategorySearchQuery2) {
          match2 = applyCondition(category, subCategorySearchQuery2, subCategoryCondition2);
        }

        return subCategoryCombiner === "And" ? match1 && match2 : match1 || match2;
      });
    }

    if (storeSearchQuery1 || storeSearchQuery2) {
      currentFilteredList = currentFilteredList.filter((item) => {
        const store = String(item.store || "");
        let match1 = true;
        let match2 = true;

        if (storeSearchQuery1) {
          match1 = applyCondition(store, storeSearchQuery1, storeCondition1);
        }

        if (storeSearchQuery2) {
          match2 = applyCondition(store, storeSearchQuery2, storeCondition2);
        }

        return storeCombiner === "And" ? match1 && match2 : match1 || match2;
      });
    }

    if (supplierSearchQuery1 || supplierSearchQuery2) {
      currentFilteredList = currentFilteredList.filter((item) => {
        const supplier = String(item.supplier || "");
        let match1 = true;
        let match2 = true;

        if (supplierSearchQuery1) {
          match1 = applyCondition(supplier, supplierSearchQuery1, supplierCondition1);
        }

        if (supplierSearchQuery2) {
          match2 = applyCondition(supplier, supplierSearchQuery2, supplierCondition2);
        }

        return supplierCombiner === "And" ? match1 && match2 : match1 || match2;
      });
    }

    if (tagListSearchQuery1 || tagListSearchQuery2) {
      currentFilteredList = currentFilteredList.filter((item) => {
        const tagListStatus = String(item.tagListStatus || "");
        let match1 = true;
        let match2 = true;

        if (tagListSearchQuery1) {
          match1 = applyCondition(tagListStatus, tagListSearchQuery1, tagListCondition1);
        }

        if (tagListSearchQuery2) {
          match2 = applyCondition(tagListStatus, tagListSearchQuery2, tagListCondition2);
        }

        return tagListCombiner === "And" ? match1 && match2 : match1 || match2;
      });
    }

    setFilteredData(currentFilteredList);
    setCurrentPage(1); // Reset to first page when filtering
  }, [
    tableData,
    // Top dropdown filters
    selectedCategories,
    selectedSubCategories,
    selectedStores,
    selectedSuppliers,
    selectedTagListStatus,
    // Column filters
    selectedBcs,
    selectedItemIds,
    selectedDescriptions,
    selectedMainCategories,
    selectedSubCategories,
    selectedStores,
    selectedSuppliers,
    // Text filters
    bcSearchQuery1,
    bcSearchQuery2,
    itemIdSearchQuery1,
    itemIdSearchQuery2,
    descriptionSearchQuery1,
    descriptionSearchQuery2,
    mainCategorySearchQuery1,
    mainCategorySearchQuery2,
    subCategorySearchQuery1,
    subCategorySearchQuery2,
    storeSearchQuery1,
    storeSearchQuery2,
    supplierSearchQuery1,
    supplierSearchQuery2,
    tagListSearchQuery1,
    tagListSearchQuery2,
    // Conditions
    bcCondition1,
    bcCondition2,
    itemIdCondition1,
    itemIdCondition2,
    descriptionCondition1,
    descriptionCondition2,
    mainCategoryCondition1,
    mainCategoryCondition2,
    subCategoryCondition1,
    subCategoryCondition2,
    storeCondition1,
    storeCondition2,
    supplierCondition1,
    supplierCondition2,
    tagListCondition1,
    tagListCondition2,
    // Combiners
    bcCombiner,
    itemIdCombiner,
    descriptionCombiner,
    mainCategoryCombiner,
    subCategoryCombiner,
    storeCombiner,
    supplierCombiner,
    tagListCombiner
  ]);

  // Add useEffect to trigger filtering when selections change
  useEffect(() => {
    handleFilter();
  }, [
    // Top dropdown filters
    selectedCategories,
    selectedSubCategories,
    selectedStores,
    selectedSuppliers,
    selectedTagListStatus,
    // Column filters
    selectedBcs,
    selectedItemIds,
    selectedDescriptions,
    selectedMainCategories,
    selectedSubCategories,
    selectedStores,
    selectedSuppliers,
    // Text filters
    bcSearchQuery1,
    bcSearchQuery2,
    itemIdSearchQuery1,
    itemIdSearchQuery2,
    descriptionSearchQuery1,
    descriptionSearchQuery2,
    mainCategorySearchQuery1,
    mainCategorySearchQuery2,
    subCategorySearchQuery1,
    subCategorySearchQuery2,
    storeSearchQuery1,
    storeSearchQuery2,
    supplierSearchQuery1,
    supplierSearchQuery2,
    tagListSearchQuery1,
    tagListSearchQuery2,
    // Conditions
    bcCondition1,
    bcCondition2,
    itemIdCondition1,
    itemIdCondition2,
    descriptionCondition1,
    descriptionCondition2,
    mainCategoryCondition1,
    mainCategoryCondition2,
    subCategoryCondition1,
    subCategoryCondition2,
    storeCondition1,
    storeCondition2,
    supplierCondition1,
    supplierCondition2,
    tagListCondition1,
    tagListCondition2,
    // Combiners
    bcCombiner,
    itemIdCombiner,
    descriptionCombiner,
    mainCategoryCombiner,
    subCategoryCombiner,
    storeCombiner,
    supplierCombiner,
    tagListCombiner
  ]);

  // Update pagination to use filteredData
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Update total pages when filtered data changes
  useEffect(() => {
    setTotalPages(Math.ceil(filteredData.length / itemsPerPage));
    // Reset to first page if current page is out of bounds
    if (currentPage > Math.ceil(filteredData.length / itemsPerPage)) {
      setCurrentPage(1);
    }
  }, [filteredData, itemsPerPage]);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1) {
      setCurrentPage(1);
    } else if (pageNumber > totalPages) {
      setCurrentPage(totalPages);
    } else {
      setCurrentPage(pageNumber);
    }
  };

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const handleCheckboxChange = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedItems((prev) =>
      prev.length === currentItems.length ? [] : currentItems.map((item) => item.id)
    );
  };

  const handleDeselectAll = () => {
    setSelectedItems([]);
  };

  // Handle checkbox changes
  const handleBcCheckbox = useCallback((bc) => {
    setSelectedBcs((prev) =>
      prev.includes(bc) ? prev.filter((b) => b !== bc) : [...prev, bc]
    );
  }, []);

  const handleItemIdCheckbox = useCallback((itemId) => {
    setSelectedItemIds((prev) =>
      prev.includes(itemId) ? prev.filter((i) => i !== itemId) : [...prev, itemId]
    );
  }, []);

  const handleDescriptionCheckbox = useCallback((description) => {
    setSelectedDescriptions((prev) =>
      prev.includes(description) ? prev.filter((d) => d !== description) : [...prev, description]
    );
  }, []);

  const handleMainCategoryCheckbox = useCallback((category) => {
    setSelectedMainCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  }, []);

  const handleSubCategoryCheckbox = useCallback((category) => {
    setSelectedSubCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  }, []);

  const handleStoreCheckbox = useCallback((store) => {
    setSelectedStores((prev) =>
      prev.includes(store) ? prev.filter((s) => s !== store) : [...prev, store]
    );
  }, []);

  const handleSupplierCheckbox = useCallback((supplier) => {
    setSelectedSuppliers((prev) =>
      prev.includes(supplier) ? prev.filter((s) => s !== supplier) : [...prev, supplier]
    );
  }, []);

  // New handler for Tag List status checkbox
  const handleTagListStatusCheckbox = useCallback((status) => {
    setSelectedTagListStatus((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(status)) {
        newSet.delete(status);
      } else {
        newSet.add(status);
      }
      return newSet;
    });
  }, []);

  // Handle Select All
  const handleSelectAllBcs = useCallback(() => {
    setSelectedBcs(allBcsSelected ? [] : uniqueBcs);
  }, [allBcsSelected, uniqueBcs]);

  const handleSelectAllItemIds = useCallback(() => {
    setSelectedItemIds(allItemIdsSelected ? [] : uniqueItemIds);
  }, [allItemIdsSelected, uniqueItemIds]);

  const handleSelectAllDescriptions = useCallback(() => {
    setSelectedDescriptions(allDescriptionsSelected ? [] : uniqueDescriptions);
  }, [allDescriptionsSelected, uniqueDescriptions]);

  const handleSelectAllMainCategories = useCallback(() => {
    setSelectedMainCategories(allMainCategoriesSelected ? [] : uniqueMainCategories);
  }, [allMainCategoriesSelected, uniqueMainCategories]);

  // Handle Select All for Tag List status
  const handleSelectAllTagListStatus = useCallback(() => {
    setSelectedTagListStatus(allTagListItemsSelected ? new Set() : new Set(uniqueTagListItems));
  }, [allTagListItemsSelected, uniqueTagListItems]);

  // Apply condition helper function
  const applyCondition = useCallback((value, query, condition) => {
    const lowerCaseValue = value.toLowerCase();
    const lowerCaseQuery = query.toLowerCase();

    switch (condition) {
      case "Is equal to":
        return lowerCaseValue === lowerCaseQuery;
      case "Does not equal":
        return lowerCaseValue !== lowerCaseQuery;
      case "Contains":
        return lowerCaseValue.includes(lowerCaseQuery);
      case "Does not contain":
        return !lowerCaseValue.includes(lowerCaseQuery);
      case "Starts with":
        return lowerCaseValue.startsWith(lowerCaseQuery);
      case "Ends with":
        return lowerCaseValue.endsWith(lowerCaseQuery);
      default:
        return true;
    }
  }, []);

  // Clear filter
  const handleClearFilter = useCallback(() => {
    setSelectedBcs([]);
    setSelectedItemIds([]);
    setSelectedDescriptions([]);
    setSelectedMainCategories([]);
    setSelectedSubCategories([]);
    setSelectedStores([]);
    setSelectedSuppliers([]);
    setSelectedTagListStatus(new Set());
    setBcSearchQuery1("");
    setBcSearchQuery2("");
    setItemIdSearchQuery1("");
    setItemIdSearchQuery2("");
    setDescriptionSearchQuery1("");
    setDescriptionSearchQuery2("");
    setMainCategorySearchQuery1("");
    setMainCategorySearchQuery2("");
    setSubCategorySearchQuery1("");
    setSubCategorySearchQuery2("");
    setStoreSearchQuery1("");
    setStoreSearchQuery2("");
    setSupplierSearchQuery1("");
    setSupplierSearchQuery2("");
    setTagListSearchQuery1("");
    setTagListSearchQuery2("");
    setBcCondition1("Is equal to");
    setBcCondition2("Is equal to");
    setItemIdCondition1("Is equal to");
    setItemIdCondition2("Is equal to");
    setDescriptionCondition1("Is equal to");
    setDescriptionCondition2("Is equal to");
    setMainCategoryCondition1("Is equal to");
    setMainCategoryCondition2("Is equal to");
    setSubCategoryCondition1("Is equal to");
    setSubCategoryCondition2("Is equal to");
    setStoreCondition1("Is equal to");
    setStoreCondition2("Is equal to");
    setSupplierCondition1("Is equal to");
    setSupplierCondition2("Is equal to");
    setTagListCondition1("Is equal to");
    setTagListCondition2("Is equal to");
    setBcCombiner("And");
    setItemIdCombiner("And");
    setDescriptionCombiner("And");
    setMainCategoryCombiner("And");
    setSubCategoryCombiner("And");
    setStoreCombiner("And");
    setSupplierCombiner("And");
    setTagListCombiner("And");
    setFilteredData(tableData);
    setCurrentPage(1);
  }, [tableData]);

  const handleCloseDropdown = useCallback((dropdownType) => {
    switch (dropdownType) {
      case "bc":
        setBcFilterDropdown(false);
        break;
      case "itemId":
        setItemIdFilterDropdown(false);
        break;
      case "description":
        setDescriptionFilterDropdown(false);
        break;
      case "mainCategory":
        setMainCategoryFilterDropdown(false);
        break;
      case "subCategory":
        setSubCategoryFilterDropdown(false);
        break;
      case "store":
        setStoreFilterDropdown(false);
        break;
      case "supplier":
        setSupplierFilterDropdown(false);
        break;
      case "tagList":
        setTagListFilterDropdown(false);
        break;
      default:
        break;
    }
  }, []);

  const updateDropdownPosition = (columnKey) => {
    const headerElement = headerRefs.current[columnKey];
    if (headerElement) {
      const rect = headerElement.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (bcFilterDropdown) updateDropdownPosition("bc");
      if (itemIdFilterDropdown) updateDropdownPosition("itemId");
      if (descriptionFilterDropdown) updateDropdownPosition("description");
      if (mainCategoryFilterDropdown) updateDropdownPosition("mainCategory");
      if (subCategoryFilterDropdown) updateDropdownPosition("subCategory");
      if (storeFilterDropdown) updateDropdownPosition("store");
      if (supplierFilterDropdown) updateDropdownPosition("supplier");
      if (tagListFilterDropdown) updateDropdownPosition("tagList");
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [
    bcFilterDropdown,
    itemIdFilterDropdown,
    descriptionFilterDropdown,
    mainCategoryFilterDropdown,
    subCategoryFilterDropdown,
    storeFilterDropdown,
    supplierFilterDropdown,
    tagListFilterDropdown,
  ]);

  const MemoizedSortableHeader = React.memo(({ label, columnKey }) => {
    return (
      <th
        className="px-4 py-2 text-left text-gray-600 relative"
        ref={(el) => (headerRefs.current[columnKey] = el)}
      >
        <div
          className="flex items-center gap-1 cursor-pointer"
          onClick={() => {
            updateDropdownPosition(columnKey);
            switch (columnKey) {
              case "bc":
                setBcFilterDropdown((prev) => !prev);
                break;
              case "itemId":
                setItemIdFilterDropdown((prev) => !prev);
                break;
              case "description":
                setDescriptionFilterDropdown((prev) => !prev);
                break;
              case "mainCategory":
                setMainCategoryFilterDropdown((prev) => !prev);
                break;
              case "subCategory":
                setSubCategoryFilterDropdown((prev) => !prev);
                break;
              case "store":
                setStoreFilterDropdown((prev) => !prev);
                break;
              case "supplier":
                setSupplierFilterDropdown((prev) => !prev);
                break;
              case "tagList":
                setTagListFilterDropdown((prev) => !prev);
                break;
              default:
                break;
            }
          }}
        >
          {label}
          <div className="flex flex-col">
            <FaSortUp className="text-xs -mb-1" />
            <FaSortDown className="text-xs -mt-1" />
          </div>
        </div>
      </th>
    );
  });

  const renderDropdown = (columnKey) => {
    const dropdownContent = () => {
      const getDropdownProps = () => {
        switch (columnKey) {
          case "bc":
            return {
              isOpen: bcFilterDropdown,
              title: "BC #",
              allSelected: allBcsSelected,
              onSelectAll: handleSelectAllBcs,
              items: uniqueBcs,
              selectedItems: selectedBcs,
              onItemSelect: handleBcCheckbox,
              searchQuery1: bcSearchQuery1,
              searchQuery2: bcSearchQuery2,
              onSearchQuery1Change: (e) => setBcSearchQuery1(e.target.value),
              onSearchQuery2Change: (e) => setBcSearchQuery2(e.target.value),
              condition1: bcCondition1,
              condition2: bcCondition2,
              onCondition1Change: (e) => setBcCondition1(e.target.value),
              onCondition2Change: (e) => setBcCondition2(e.target.value),
              combiner: bcCombiner,
              onCombinerChange: (e) => setBcCombiner(e.target.value),
              position: dropdownPosition,
              onClose: () => handleCloseDropdown("bc"),
              onFilter: handleFilter,
              onClearFilter: handleClearFilter,
            };
          case "itemId":
            return {
              isOpen: itemIdFilterDropdown,
              title: "Item ID",
              allSelected: allItemIdsSelected,
              onSelectAll: handleSelectAllItemIds,
              items: uniqueItemIds,
              selectedItems: selectedItemIds,
              onItemSelect: handleItemIdCheckbox,
              searchQuery1: itemIdSearchQuery1,
              searchQuery2: itemIdSearchQuery2,
              onSearchQuery1Change: (e) => setItemIdSearchQuery1(e.target.value),
              onSearchQuery2Change: (e) => setItemIdSearchQuery2(e.target.value),
              condition1: itemIdCondition1,
              condition2: itemIdCondition2,
              onCondition1Change: (e) => setItemIdCondition1(e.target.value),
              onCondition2Change: (e) => setItemIdCondition2(e.target.value),
              combiner: itemIdCombiner,
              onCombinerChange: (e) => setItemIdCombiner(e.target.value),
              position: dropdownPosition,
              onClose: () => handleCloseDropdown("itemId"),
              onFilter: handleFilter,
              onClearFilter: handleClearFilter,
            };
          case "description":
            return {
              isOpen: descriptionFilterDropdown,
              title: "Description",
              allSelected: allDescriptionsSelected,
              onSelectAll: handleSelectAllDescriptions,
              items: uniqueDescriptions,
              selectedItems: selectedDescriptions,
              onItemSelect: handleDescriptionCheckbox,
              searchQuery1: descriptionSearchQuery1,
              searchQuery2: descriptionSearchQuery2,
              onSearchQuery1Change: (e) => setDescriptionSearchQuery1(e.target.value),
              onSearchQuery2Change: (e) => setDescriptionSearchQuery2(e.target.value),
              condition1: descriptionCondition1,
              condition2: descriptionCondition2,
              onCondition1Change: (e) => setDescriptionCondition1(e.target.value),
              onCondition2Change: (e) => setDescriptionCondition2(e.target.value),
              combiner: descriptionCombiner,
              onCombinerChange: (e) => setDescriptionCombiner(e.target.value),
              position: dropdownPosition,
              onClose: () => handleCloseDropdown("description"),
              onFilter: handleFilter,
              onClearFilter: handleClearFilter,
            };
          case "mainCategory":
            return {
              isOpen: mainCategoryFilterDropdown,
              title: "Main Category",
              allSelected: allMainCategoriesSelected,
              onSelectAll: handleSelectAllMainCategories,
              items: uniqueMainCategories,
              selectedItems: selectedMainCategories,
              onItemSelect: handleMainCategoryCheckbox,
              searchQuery1: mainCategorySearchQuery1,
              searchQuery2: mainCategorySearchQuery2,
              onSearchQuery1Change: (e) => setMainCategorySearchQuery1(e.target.value),
              onSearchQuery2Change: (e) => setMainCategorySearchQuery2(e.target.value),
              condition1: mainCategoryCondition1,
              condition2: mainCategoryCondition2,
              onCondition1Change: (e) => setMainCategoryCondition1(e.target.value),
              onCondition2Change: (e) => setMainCategoryCondition2(e.target.value),
              combiner: mainCategoryCombiner,
              onCombinerChange: (e) => setMainCategoryCombiner(e.target.value),
              position: dropdownPosition,
              onClose: () => handleCloseDropdown("mainCategory"),
              onFilter: handleFilter,
              onClearFilter: handleClearFilter,
            };
          case "subCategory":
            return {
              isOpen: subCategoryFilterDropdown,
              title: "Sub Category",
              allSelected: allSubCategoriesSelected,
              onSelectAll: handleSelectAllSubCategories,
              items: uniqueSubCategories,
              selectedItems: selectedSubCategories,
              onItemSelect: handleSubCategoryCheckbox,
              searchQuery1: subCategorySearchQuery1,
              searchQuery2: subCategorySearchQuery2,
              onSearchQuery1Change: (e) => setSubCategorySearchQuery1(e.target.value),
              onSearchQuery2Change: (e) => setSubCategorySearchQuery2(e.target.value),
              condition1: subCategoryCondition1,
              condition2: subCategoryCondition2,
              onCondition1Change: (e) => setSubCategoryCondition1(e.target.value),
              onCondition2Change: (e) => setSubCategoryCondition2(e.target.value),
              combiner: subCategoryCombiner,
              onCombinerChange: (e) => setSubCategoryCombiner(e.target.value),
              position: dropdownPosition,
              onClose: () => handleCloseDropdown("subCategory"),
              onFilter: handleFilter,
              onClearFilter: handleClearFilter,
            };
          case "store":
            return {
              isOpen: storeFilterDropdown,
              title: "Store",
              allSelected: allStoresSelected,
              onSelectAll: handleSelectAllStores,
              items: uniqueStores,
              selectedItems: selectedStores,
              onItemSelect: handleStoreCheckbox,
              searchQuery1: storeSearchQuery1,
              searchQuery2: storeSearchQuery2,
              onSearchQuery1Change: (e) => setStoreSearchQuery1(e.target.value),
              onSearchQuery2Change: (e) => setStoreSearchQuery2(e.target.value),
              condition1: storeCondition1,
              condition2: storeCondition2,
              onCondition1Change: (e) => setStoreCondition1(e.target.value),
              onCondition2Change: (e) => setStoreCondition2(e.target.value),
              combiner: storeCombiner,
              onCombinerChange: (e) => setStoreCombiner(e.target.value),
              position: dropdownPosition,
              onClose: () => handleCloseDropdown("store"),
              onFilter: handleFilter,
              onClearFilter: handleClearFilter,
            };
          case "supplier":
            return {
              isOpen: supplierFilterDropdown,
              title: "Supplier",
              allSelected: allSuppliersSelected,
              onSelectAll: handleSelectAllSuppliers,
              items: uniqueSuppliers,
              selectedItems: selectedSuppliers,
              onItemSelect: handleSupplierCheckbox,
              searchQuery1: supplierSearchQuery1,
              searchQuery2: supplierSearchQuery2,
              onSearchQuery1Change: (e) => setSupplierSearchQuery1(e.target.value),
              onSearchQuery2Change: (e) => setSupplierSearchQuery2(e.target.value),
              condition1: supplierCondition1,
              condition2: supplierCondition2,
              onCondition1Change: (e) => setSupplierCondition1(e.target.value),
              onCondition2Change: (e) => setSupplierCondition2(e.target.value),
              combiner: supplierCombiner,
              onCombinerChange: (e) => setSupplierCombiner(e.target.value),
              position: dropdownPosition,
              onClose: () => handleCloseDropdown("supplier"),
              onFilter: handleFilter,
              onClearFilter: handleClearFilter,
            };
          case "tagList":
            return {
              isOpen: tagListFilterDropdown,
              title: "Tag List",
              allSelected: allTagListItemsSelected,
              onSelectAll: handleSelectAllTagListStatus,
              items: uniqueTagListItems,
              selectedItems: selectedTagListStatus,
              onItemSelect: handleTagListStatusCheckbox,
              searchQuery1: tagListSearchQuery1,
              searchQuery2: tagListSearchQuery2,
              onSearchQuery1Change: (e) => setTagListSearchQuery1(e.target.value),
              onSearchQuery2Change: (e) => setTagListSearchQuery2(e.target.value),
              condition1: tagListCondition1,
              condition2: tagListCondition2,
              onCondition1Change: (e) => setTagListCondition1(e.target.value),
              onCondition2Change: (e) => setTagListCondition2(e.target.value),
              combiner: tagListCombiner,
              onCombinerChange: (e) => setTagListCombiner(e.target.value),
              position: dropdownPosition,
              onClose: () => handleCloseDropdown("tagList"),
              onFilter: handleFilter,
              onClearFilter: handleClearFilter,
              isSimpleFilter: true, // Set to true for simple layout
            };
          default:
            return null;
        }
      };

      const props = getDropdownProps();
      if (!props) return null;

      return <FilterDropdown {...props} />;
    };

    return createPortal(dropdownContent(), document.body);
  };

  // Handlers for category dropdown
  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const handleSelectAllCategories = () => {
    setSelectedCategories((prev) =>
      prev.length === categories.length ? [] : [...categories]
    );
  };

  // Handlers for subcategory dropdown
  const handleSubCategoryChange = (subCategory) => {
    setSelectedSubCategories((prev) =>
      prev.includes(subCategory) ? prev.filter((c) => c !== subCategory) : [...prev, subCategory]
    );
  };

  const handleSelectAllSubCategories = () => {
    setSelectedSubCategories((prev) =>
      prev.length === subCategories.length ? [] : [...subCategories]
    );
  };

  // Handlers for store dropdown
  const handleStoreChange = (store) => {
    setSelectedStores((prev) =>
      prev.includes(store) ? prev.filter((s) => s !== store) : [...prev, store]
    );
  };

  const handleSelectAllStores = () => {
    setSelectedStores((prev) =>
      prev.length === stores.length ? [] : [...stores]
    );
  };

  // Handlers for supplier dropdown
  const handleSupplierChange = (supplier) => {
    setSelectedSuppliers((prev) =>
      prev.includes(supplier) ? prev.filter((s) => s !== supplier) : [...prev, supplier]
    );
  };

  const handleSelectAllSuppliers = () => {
    setSelectedSuppliers((prev) =>
      prev.length === suppliers.length ? [] : [...suppliers]
    );
  };

  // Add search functionality
  const handleSearch = useCallback((searchValue) => {
    if (!searchValue.trim()) {
      setFilteredData(tableData);
      return;
    }

    const searchLower = searchValue.toLowerCase();
    const filtered = tableData.filter(item =>
      item.bc.toLowerCase().includes(searchLower) ||
      item.itemId.toLowerCase().includes(searchLower) ||
      item.description.toLowerCase().includes(searchLower) ||
      item.mainCategory.toLowerCase().includes(searchLower) ||
      item.subCategory.toLowerCase().includes(searchLower) ||
      item.store.toLowerCase().includes(searchLower) ||
      item.supplier.toLowerCase().includes(searchLower)
    );

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [tableData]);

  // Add refresh functionality
  const handleRefresh = useCallback(() => {
    // Reset all filters
    setSelectedCategories([]);
    setSelectedSubCategories([]);
    setSelectedStores([]);
    setSelectedSuppliers([]);
    setSelectedBcs([]);
    setSelectedItemIds([]);
    setSelectedDescriptions([]);
    setSelectedMainCategories([]);
    setSelectedSubCategories([]);
    setSelectedStores([]);
    setSelectedSuppliers([]);
    setSelectedTagListStatus(new Set());
   
    // Reset all search queries
    setBcSearchQuery1("");
    setBcSearchQuery2("");
    setItemIdSearchQuery1("");
    setItemIdSearchQuery2("");
    setDescriptionSearchQuery1("");
    setDescriptionSearchQuery2("");
    setMainCategorySearchQuery1("");
    setMainCategorySearchQuery2("");
    setSubCategorySearchQuery1("");
    setSubCategorySearchQuery2("");
    setStoreSearchQuery1("");
    setStoreSearchQuery2("");
    setSupplierSearchQuery1("");
    setSupplierSearchQuery2("");
    setTagListSearchQuery1("");
    setTagListSearchQuery2("");
   
    // Reset all conditions
    setBcCondition1("Is equal to");
    setBcCondition2("Is equal to");
    setItemIdCondition1("Is equal to");
    setItemIdCondition2("Is equal to");
    setDescriptionCondition1("Is equal to");
    setDescriptionCondition2("Is equal to");
    setMainCategoryCondition1("Is equal to");
    setMainCategoryCondition2("Is equal to");
    setSubCategoryCondition1("Is equal to");
    setSubCategoryCondition2("Is equal to");
    setStoreCondition1("Is equal to");
    setStoreCondition2("Is equal to");
    setSupplierCondition1("Is equal to");
    setSupplierCondition2("Is equal to");
    setTagListCondition1("Is equal to");
    setTagListCondition2("Is equal to");
   
    // Reset all combiners
    setBcCombiner("And");
    setItemIdCombiner("And");
    setDescriptionCombiner("And");
    setMainCategoryCombiner("And");
    setSubCategoryCombiner("And");
    setStoreCombiner("And");
    setSupplierCombiner("And");
    setTagListCombiner("And");
   
    // Reset search input
    setSearchQuery("");
   
    // Reset filtered data
    setFilteredData(tableData);
    setCurrentPage(1);
  }, [tableData]);

  // Add clear functionality
  const handleClear = useCallback(() => {
    // Reset all filters
    setSelectedCategories([]);
    setSelectedSubCategories([]);
    setSelectedStores([]);
    setSelectedSuppliers([]);
    setSelectedBcs([]);
    setSelectedItemIds([]);
    setSelectedDescriptions([]);
    setSelectedMainCategories([]);
    setSelectedSubCategories([]);
    setSelectedStores([]);
    setSelectedSuppliers([]);
    setSelectedTagListStatus(new Set());
   
    // Reset all search queries
    setBcSearchQuery1("");
    setBcSearchQuery2("");
    setItemIdSearchQuery1("");
    setItemIdSearchQuery2("");
    setDescriptionSearchQuery1("");
    setDescriptionSearchQuery2("");
    setMainCategorySearchQuery1("");
    setMainCategorySearchQuery2("");
    setSubCategorySearchQuery1("");
    setSubCategorySearchQuery2("");
    setStoreSearchQuery1("");
    setStoreSearchQuery2("");
    setSupplierSearchQuery1("");
    setSupplierSearchQuery2("");
    setTagListSearchQuery1("");
    setTagListSearchQuery2("");
   
    // Reset all conditions
    setBcCondition1("Is equal to");
    setBcCondition2("Is equal to");
    setItemIdCondition1("Is equal to");
    setItemIdCondition2("Is equal to");
    setDescriptionCondition1("Is equal to");
    setDescriptionCondition2("Is equal to");
    setMainCategoryCondition1("Is equal to");
    setMainCategoryCondition2("Is equal to");
    setSubCategoryCondition1("Is equal to");
    setSubCategoryCondition2("Is equal to");
    setStoreCondition1("Is equal to");
    setStoreCondition2("Is equal to");
    setSupplierCondition1("Is equal to");
    setSupplierCondition2("Is equal to");
    setTagListCondition1("Is equal to");
    setTagListCondition2("Is equal to");
   
    // Reset all combiners
    setBcCombiner("And");
    setItemIdCombiner("And");
    setDescriptionCombiner("And");
    setMainCategoryCombiner("And");
    setSubCategoryCombiner("And");
    setStoreCombiner("And");
    setSupplierCombiner("And");
    setTagListCombiner("And");
   
    // Reset search input
    setSearchQuery("");
   
    // Reset filtered data
    setFilteredData(tableData);
    setCurrentPage(1);
  }, [tableData]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 w-full">
      {/* Top Controls */}
      <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
        <span className="font-semibold text-gray-700">Select Records To Print</span>

        <div className="flex flex-wrap items-center gap-2 flex-grow justify-end">
          {/* Category Dropdown */}
          <div className="relative w-48">
            <div className="flex items-center mb-1">
              <input
                type="checkbox"
                checked={selectedCategories.length === categories.length}
                onChange={handleSelectAllCategories}
                className="mr-2 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium">Select All Categories</span>
            </div>
            <div
              className="border border-gray-300 px-3 py-1 text-sm flex items-center justify-between cursor-pointer bg-white rounded shadow-sm w-full"
              onClick={() => {
                setShowCategoryDropdown(!showCategoryDropdown);
                setShowSubCategoryDropdown(false);
                setShowStoreDropdown(false);
                setShowSupplierDropdown(false);
              }}
            >
              <span>{selectedCategories.length > 0 ? `${selectedCategories.length} Selected` : 'Select Category'}</span>
              <FaSortDown className="ml-2 text-gray-500" />
            </div>
            {showCategoryDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto">
                <ul className="py-1">
                  {categories.map((cat) => (
                    <li
                      key={cat}
                      className="px-3 py-1 cursor-pointer hover:bg-gray-100 text-sm flex items-center"
                      onClick={() => handleCategoryChange(cat)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat)}
                        onChange={() => {}}
                        className="mr-2 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      {cat}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* SubCategory Dropdown */}
          <div className="relative w-48">
            <div className="flex items-center mb-1">
              <input
                type="checkbox"
                checked={selectedSubCategories.length === subCategories.length}
                onChange={handleSelectAllSubCategories}
                className="mr-2 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium">Select All SubCategories</span>
            </div>
            <div
              className="border border-gray-300 px-3 py-1 text-sm flex items-center justify-between cursor-pointer bg-white rounded shadow-sm w-full"
              onClick={() => {
                setShowSubCategoryDropdown(!showSubCategoryDropdown);
                setShowCategoryDropdown(false);
                setShowStoreDropdown(false);
                setShowSupplierDropdown(false);
              }}
            >
              <span>{selectedSubCategories.length > 0 ? `${selectedSubCategories.length} Selected` : 'Select SubCategory'}</span>
              <FaSortDown className="ml-2 text-gray-500" />
            </div>
            {showSubCategoryDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto">
                <ul className="py-1">
                  {subCategories.map((subCat) => (
                    <li
                      key={subCat}
                      className="px-3 py-1 cursor-pointer hover:bg-gray-100 text-sm flex items-center"
                      onClick={() => handleSubCategoryChange(subCat)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedSubCategories.includes(subCat)}
                        onChange={() => {}}
                        className="mr-2 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      {subCat}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Store Dropdown */}
          <div className="relative w-48">
            <div className="flex items-center mb-1">
              <input
                type="checkbox"
                checked={selectedStores.length === stores.length}
                onChange={handleSelectAllStores}
                className="mr-2 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium">Select All Stores</span>
            </div>
            <div
              className="border border-gray-300 px-3 py-1 text-sm flex items-center justify-between cursor-pointer bg-white rounded shadow-sm w-full"
              onClick={() => {
                setShowStoreDropdown(!showStoreDropdown);
                setShowCategoryDropdown(false);
                setShowSubCategoryDropdown(false);
                setShowSupplierDropdown(false);
              }}
            >
              <span>{selectedStores.length > 0 ? `${selectedStores.length} Selected` : 'Select Store'}</span>
              <FaSortDown className="ml-2 text-gray-500" />
            </div>
            {showStoreDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto">
                <ul className="py-1">
                  {stores.map((store) => (
                    <li
                      key={store}
                      className="px-3 py-1 cursor-pointer hover:bg-gray-100 text-sm flex items-center"
                      onClick={() => handleStoreChange(store)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedStores.includes(store)}
                        onChange={() => {}}
                        className="mr-2 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      {store}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Supplier Dropdown */}
          <div className="relative w-48">
            <div className="flex items-center mb-1">
              <input
                type="checkbox"
                checked={selectedSuppliers.length === suppliers.length}
                onChange={handleSelectAllSuppliers}
                className="mr-2 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium">Select All Suppliers</span>
            </div>
            <div
              className="border border-gray-300 px-3 py-1 text-sm flex items-center justify-between cursor-pointer bg-white rounded shadow-sm w-full"
              onClick={() => {
                setShowSupplierDropdown(!showSupplierDropdown);
                setShowCategoryDropdown(false);
                setShowSubCategoryDropdown(false);
                setShowStoreDropdown(false);
              }}
            >
              <span>{selectedSuppliers.length > 0 ? `${selectedSuppliers.length} Selected` : 'Select Supplier'}</span>
              <FaSortDown className="ml-2 text-gray-500" />
            </div>
            {showSupplierDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto">
                <ul className="py-1">
                  {suppliers.map((supplier) => (
                    <li
                      key={supplier}
                      className="px-3 py-1 cursor-pointer hover:bg-gray-100 text-sm flex items-center"
                      onClick={() => handleSupplierChange(supplier)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedSuppliers.includes(supplier)}
                        onChange={() => {}}
                        className="mr-2 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      {supplier}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Refresh and Clear Buttons */}
          <Button
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 flex items-center gap-1 rounded shadow h-auto"
            onClick={handleRefresh}
          >
            <FiRefreshCw /> Refresh
          </Button>
          <Button
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 flex items-center gap-1 rounded shadow h-auto"
            onClick={handleClear}
          >
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
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleSearch(e.target.value);
              }}
              className="border-0 focus:outline-none px-1 py-1 text-sm bg-transparent w-32"
            />
          </div>

          {/* Select All / Deselect All */}
          <Button
            className="border border-gray-300 px-3 py-1 text-sm flex items-center gap-1 bg-white hover:bg-gray-100 rounded shadow-sm text-gray-700 h-auto"
            onClick={handleSelectAll}
          >
            <FiCheck /> Select All
          </Button>
          <Button
            className="border border-gray-300 px-3 py-1 text-sm flex items-center gap-1 bg-white hover:bg-gray-100 rounded shadow-sm text-gray-700 h-auto"
            onClick={handleDeselectAll}
          >
            <FiSquare /> Deselect All
          </Button>
        </div>


      </div>

      {/* Table */}
      <div className="border border-gray-300 rounded bg-white shadow-md overflow-hidden mb-4">
        <table className="w-full text-sm table-auto">
          <thead className="bg-gray-100">
            <tr>
              <MemoizedSortableHeader label="Tag List" columnKey="tagList" />
              <MemoizedSortableHeader label="BC #" columnKey="bc" />
              <MemoizedSortableHeader label="Item Id" columnKey="itemId" />
              <MemoizedSortableHeader label="Description" columnKey="description" />
              <MemoizedSortableHeader label="Main Category" columnKey="mainCategory" />
              <MemoizedSortableHeader label="Sub Category" columnKey="subCategory" />
              <MemoizedSortableHeader label="Store" columnKey="store" />
              <MemoizedSortableHeader label="Supplier" columnKey="supplier" />
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleCheckboxChange(item.id)}
                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.bc}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.itemId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.mainCategory}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.subCategory}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.store}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.supplier}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Enhanced Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Rows per page:</span>
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="text-sm text-gray-600">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} entries
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100 disabled:opacity-50"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          >
            {'<<'}
          </button>
          <button
            className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100 disabled:opacity-50"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            {'<'}
          </button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNumber;
              if (totalPages <= 5) {
                pageNumber = i + 1;
              } else if (currentPage <= 3) {
                pageNumber = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + i;
              } else {
                pageNumber = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNumber}
                  className={`px-3 py-1 border rounded text-sm ${
                    currentPage === pageNumber
                      ? 'bg-blue-500 text-white'
                      : 'border-gray-300 hover:bg-gray-100'
                  }`}
                  onClick={() => handlePageChange(pageNumber)}
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>

          <button
            className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100 disabled:opacity-50"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            {'>'}
          </button>
          <button
            className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100 disabled:opacity-50"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            {'>>'}
          </button>

          {/* Page Input */}
          <div className="flex items-center gap-2 ml-4">
            <span className="text-sm text-gray-600">Go to page:</span>
            <input
              type="number"
              min="1"
              max={totalPages}
              value={currentPage}
              onChange={(e) => {
                const page = parseInt(e.target.value);
                if (!isNaN(page)) {
                  handlePageChange(page);
                }
              }}
              className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
            />
          </div>
        </div>
      </div>

      {/* Bottom Buttons */}
      <div className="flex justify-center gap-4 mt-6 bg-orange-100 w-[53%] p-1 m-auto">
        <div className=" p-2">
          <button className="px-4 py-2 flex items-center gap-2 text-black p-10 font-semibold bg-gray-300">
            <FiPrinter /> Print Selected
          </button>
        </div>
        <div className="bg-orange-100 p-2">
          <button className="px-4 py-2 flex items-center gap-2 text-black p-10 font-semibold bg-gray-300">
            <FiPrinter /> Print All
          </button>
        </div>
        <div className="bg-orange-100 p-2">
          <button className="px-4 py-2 flex items-center gap-2 text-black p-10 font-semibold bg-gray-300">
            <FiTrash2 /> Delete Selected
          </button>
        </div>
        <div className="bg-orange-100 p-2">
          <button
            className="px-4 py-2 flex items-center gap-2 text-black p-10 font-semibold bg-gray-300"
          >
            <FiSettings /> Settings
          </button>
        </div>
      </div>

      {/* Render dropdowns */}
      {renderDropdown("bc")}
      {renderDropdown("itemId")}
      {renderDropdown("description")}
      {renderDropdown("mainCategory")}
      {renderDropdown("subCategory")}
      {renderDropdown("store")}
      {renderDropdown("supplier")}
      {renderDropdown("tagList")}
    </div>
  );
};

export default Print;