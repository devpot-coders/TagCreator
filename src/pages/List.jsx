import React, { useState, useCallback, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
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
  FiX,
} from "react-icons/fi";
import { Button } from "../../src/components/ui/button";
import { FaSortUp, FaSortDown } from "react-icons/fa";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader } from "../pages/Loader";
import { useTag } from "../utils/TagService/TagHooks/useTag";

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
}) => {
  const [date1, setDate1] = useState(null);
  const [date2, setDate2] = useState(null);


  if (!isOpen) return null;

  const handleDateSelect = (date, isFirstInput) => {
    if (isFirstInput) {
      setDate1(date);
      onSearchQuery1Change({ target: { value: format(date, "dd-MM-yyyy") } });
    } else {
      setDate2(date);
      onSearchQuery2Change({ target: { value: format(date, "dd-MM-yyyy") } });
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
              checked={selectedItems.includes(item)}
              onChange={() => onItemSelect(item)}
              className="mr-2 h-4 w-4"
            />
            <span className="font-normal">{item}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-2 border-t border-gray-300">
        <h3 className="font-normal mb-2">Show rows with value that</h3>
        <div className="flex flex-col gap-2">
          <div className="items-center gap-2 ">
            <select
              className="border  rounded p-1 w-full text-sm bg-gradient-to-b from-gray-200 to-gray-400 focus:outline-none"
              value={condition1}
              onChange={onCondition1Change}
            >
              <option >Is equal to</option>
              <option className="">Does not equal</option>
              <option>Contains</option>
              <option>Does not contain</option>
              <option>Starts with</option>
              <option>Ends with</option>
            </select>
            <div className="flex items-center gap-2">
              <input
                type="text"
                className="border border-blue-400 focus:outline-none rounded p-1 w-[80%] flex-1 text-sm bg-white dark:bg-gray-700 dark:text-white"
                value={searchQuery1}
                onChange={onSearchQuery1Change}
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
                  onClick={onFilter}
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
                value={searchQuery2}
                onChange={onSearchQuery2Change}
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
                  onClick={onFilter}
                  className="bg-gray-200 text-gray-700 mt-2 ml-2 text-xs px-2 py-1 rounded hover:bg-gray-200 dark:bg-gray-600 dark:text-white"
                >
                  aA
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          className="flex-1 bg-gray-300 text-black py-1 rounded font-normal"
          onClick={onFilter}
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

function List() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [titleFilterDropdown, setTitleFilterDropdown] = useState(false);
  const [createdByFilterDropdown, setCreatedByFilterDropdown] = useState(false);
  const [dateCreatedFilterDropdown, setDateCreatedFilterDropdown] =
    useState(false);
  const [dateModifiedFilterDropdown, setDateModifiedFilterDropdown] =
    useState(false);
  const [modifiedByFilterDropdown, setModifiedByFilterDropdown] =
    useState(false);
  const [selectedTitles, setSelectedTitles] = useState([]);
  const [selectedCreators, setSelectedCreators] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedModifiedDates, setSelectedModifiedDates] = useState([]);
  const [selectedModifiers, setSelectedModifiers] = useState([]);
  const [searchQuery1, setSearchQuery1] = useState("");
  const [searchQuery2, setSearchQuery2] = useState("");
  const [creatorSearchQuery1, setCreatorSearchQuery1] = useState("");
  const [creatorSearchQuery2, setCreatorSearchQuery2] = useState("");
  const [dateSearchQuery1, setDateSearchQuery1] = useState("");
  const [dateSearchQuery2, setDateSearchQuery2] = useState("");
  const [modifiedDateSearchQuery1, setModifiedDateSearchQuery1] = useState("");
  const [modifiedDateSearchQuery2, setModifiedDateSearchQuery2] = useState("");
  const [modifierSearchQuery1, setModifierSearchQuery1] = useState("");
  const [modifierSearchQuery2, setModifierSearchQuery2] = useState("");
  const [condition1, setCondition1] = useState("Is equal to");
  const [condition2, setCondition2] = useState("Is equal to");
  const [creatorCondition1, setCreatorCondition1] = useState("Is equal to");
  const [creatorCondition2, setCreatorCondition2] = useState("Is equal to");
  const [dateCondition1, setDateCondition1] = useState("Is equal to");
  const [dateCondition2, setDateCondition2] = useState("Is equal to");
  const [modifiedDateCondition1, setModifiedDateCondition1] =
    useState("Is equal to");
  const [modifiedDateCondition2, setModifiedDateCondition2] =
    useState("Is equal to");
  const [modifierCondition1, setModifierCondition1] = useState("Is equal to");
  const [modifierCondition2, setModifierCondition2] = useState("Is equal to");
  const [combiner, setCombiner] = useState("And");
  const [creatorCombiner, setCreatorCombiner] = useState("And");
  const [dateCombiner, setDateCombiner] = useState("And");
  const [modifiedDateCombiner, setModifiedDateCombiner] = useState("And");
  const [modifierCombiner, setModifierCombiner] = useState("And");
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const headerRefs = useRef({});

  const [tagData, setTagData] = useState([])
  const [tagList, setTagList] = useState(tagData);
  const [filteredTagList, setFilteredTagList] = useState(tagData);
  const [company_code,setCompany_code] = useState("afhstXDev")

  const [loading, setLoading] = useState(true);

  const [tagListDeleteId, setTagListDeleteId] = useState("")
  
  const {
    fetchTagList,
    deleteTag,
  } = useTag();


  useEffect(() => {
    const loadTags = async () => {
      const data = await fetchTagList();

      console.log(data,"datalist");
      setLoading(false)
      
      if (data && data.records) {
        setTagData(
          data.records.map(tag => (
            console.log(tag,"tag"),
            {
            
            title: tag.template_name,
            createdBy: tag.created_by,
            dateCreated: tag.created_date,
            dateModified: tag.updated_date,
            modifiedBy: tag.updated_by,
            id: tag.id,
            pageSize: tag.page_size,
            templateHtml: tag.template_html,
          }))
        )
      }
    };
    loadTags();
  }, []);

  const navigate = useNavigate();

  // State for delete confirmation popup
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Add new state for sorting
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: null
  });


  const handleDelete = async () => {
    if (!tagListDeleteId) {
      alert('No item selected for delete!');
      return;
    }
    await deleteTag(company_code,tagListDeleteId);
    setShowDeleteConfirm(false);
    setTagListDeleteId(null);
  };

  // Get unique values
  const uniqueTitles = Array.from(new Set(tagData.map((tag) => tag.title)));
  const uniqueCreators = Array.from(
    new Set(tagData.map((tag) => tag.createdBy))
  );
  const uniqueDates = Array.from(
    new Set(tagData.map((tag) => tag.dateCreated))
  );
  const uniqueModifiedDates = Array.from(
    new Set(tagData.map((tag) => tag.dateModified))
  );
  const uniqueModifiers = Array.from(
    new Set(tagData.map((tag) => tag.modifiedBy))
  );
  const allSelected = selectedTitles.length === uniqueTitles.length;
  const allCreatorsSelected = selectedCreators.length === uniqueCreators.length;
  const allDatesSelected = selectedDates.length === uniqueDates.length;
  const allModifiedDatesSelected =
    selectedModifiedDates.length === uniqueModifiedDates.length;
  const allModifiersSelected =
    selectedModifiers.length === uniqueModifiers.length;

  // Handle checkbox changes for titles
  const handleTitleCheckbox = useCallback((title) => {
    setSelectedTitles((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  }, []);

  // Handle checkbox changes for creators
  const handleCreatorCheckbox = useCallback((creator) => {
    setSelectedCreators((prev) =>
      prev.includes(creator)
        ? prev.filter((c) => c !== creator)
        : [...prev, creator]
    );
  }, []);

  // Handle checkbox changes for dates
  const handleDateCheckbox = useCallback((date) => {
    setSelectedDates((prev) =>
      prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date]
    );
  }, []);

  // Handle checkbox changes for modified dates
  const handleModifiedDateCheckbox = useCallback((date) => {
    setSelectedModifiedDates((prev) =>
      prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date]
    );
  }, []);

  // Handle checkbox changes for modifiers
  const handleModifierCheckbox = useCallback((modifier) => {
    setSelectedModifiers((prev) =>
      prev.includes(modifier)
        ? prev.filter((m) => m !== modifier)
        : [...prev, modifier]
    );
  }, []);

  // Handle Select All for titles
  const handleSelectAll = useCallback(() => {
    setSelectedTitles(allSelected ? [] : uniqueTitles);
  }, [allSelected, uniqueTitles]);

  // Handle Select All for creators
  const handleSelectAllCreators = useCallback(() => {
    setSelectedCreators(allCreatorsSelected ? [] : uniqueCreators);
  }, [allCreatorsSelected, uniqueCreators]);

  // Handle Select All for dates
  const handleSelectAllDates = useCallback(() => {
    setSelectedDates(allDatesSelected ? [] : uniqueDates);
  }, [allDatesSelected, uniqueDates]);

  // Handle Select All for modified dates
  const handleSelectAllModifiedDates = useCallback(() => {
    setSelectedModifiedDates(
      allModifiedDatesSelected ? [] : uniqueModifiedDates
    );
  }, [allModifiedDatesSelected, uniqueModifiedDates]);

  // Handle Select All for modifiers
  const handleSelectAllModifiers = useCallback(() => {
    setSelectedModifiers(allModifiersSelected ? [] : uniqueModifiers);
  }, [allModifiersSelected, uniqueModifiers]);

  // Filter logic
  const handleFilter = useCallback(() => {
    let currentFilteredList = tagData;

    // Apply title checkbox filter
    if (selectedTitles.length > 0) {
      currentFilteredList = currentFilteredList.filter((tag) =>
        selectedTitles.includes(tag.title)
      );
    }

    // Apply creator checkbox filter
    if (selectedCreators.length > 0) {
      currentFilteredList = currentFilteredList.filter((tag) =>
        selectedCreators.includes(tag.createdBy)
      );
    }

    // Apply date checkbox filter
    if (selectedDates.length > 0) {
      currentFilteredList = currentFilteredList.filter((tag) =>
        selectedDates.includes(tag.dateCreated)
      );
    }

    // Apply modified date checkbox filter
    if (selectedModifiedDates.length > 0) {
      currentFilteredList = currentFilteredList.filter((tag) =>
        selectedModifiedDates.includes(tag.dateModified)
      );
    }

    // Apply modifier checkbox filter
    if (selectedModifiers.length > 0) {
      currentFilteredList = currentFilteredList.filter((tag) =>
        selectedModifiers.includes(tag.modifiedBy)
      );
    }

    // Apply title text filter
    if (searchQuery1 || searchQuery2) {
      currentFilteredList = currentFilteredList.filter((tag) => {
        const title = String(tag.title || "");
        let match1 = true;
        let match2 = true;

        if (searchQuery1) {
          match1 = applyCondition(title, searchQuery1, condition1);
        }

        if (searchQuery2) {
          match2 = applyCondition(title, searchQuery2, condition2);
        }

        return combiner === "And" ? match1 && match2 : match1 || match2;
      });
    }

    // Apply creator text filter
    if (creatorSearchQuery1 || creatorSearchQuery2) {
      currentFilteredList = currentFilteredList.filter((tag) => {
        const creator = String(tag.createdBy || "");
        let match1 = true;
        let match2 = true;

        if (creatorSearchQuery1) {
          match1 = applyCondition(
            creator,
            creatorSearchQuery1,
            creatorCondition1
          );
        }

        if (creatorSearchQuery2) {
          match2 = applyCondition(
            creator,
            creatorSearchQuery2,
            creatorCondition2
          );
        }

        return creatorCombiner === "And" ? match1 && match2 : match1 || match2;
      });
    }

    // Apply date text filter
    if (dateSearchQuery1 || dateSearchQuery2) {
      currentFilteredList = currentFilteredList.filter((tag) => {
        const date = String(tag.dateCreated || "");
        let match1 = true;
        let match2 = true;

        if (dateSearchQuery1) {
          match1 = applyCondition(date, dateSearchQuery1, dateCondition1);
        }

        if (dateSearchQuery2) {
          match2 = applyCondition(date, dateSearchQuery2, dateCondition2);
        }

        return dateCombiner === "And" ? match1 && match2 : match1 || match2;
      });
    }

    // Apply modified date text filter
    if (modifiedDateSearchQuery1 || modifiedDateSearchQuery2) {
      currentFilteredList = currentFilteredList.filter((tag) => {
        const date = String(tag.dateModified || "");
        let match1 = true;
        let match2 = true;

        if (modifiedDateSearchQuery1) {
          match1 = applyCondition(
            date,
            modifiedDateSearchQuery1,
            modifiedDateCondition1
          );
        }

        if (modifiedDateSearchQuery2) {
          match2 = applyCondition(
            date,
            modifiedDateSearchQuery2,
            modifiedDateCondition2
          );
        }

        return modifiedDateCombiner === "And"
          ? match1 && match2
          : match1 || match2;
      });
    }

    // Apply modifier text filter
    if (modifierSearchQuery1 || modifierSearchQuery2) {
      currentFilteredList = currentFilteredList.filter((tag) => {
        const modifier = String(tag.modifiedBy || "");
        let match1 = true;
        let match2 = true;

        if (modifierSearchQuery1) {
          match1 = applyCondition(
            modifier,
            modifierSearchQuery1,
            modifierCondition1
          );
        }

        if (modifierSearchQuery2) {
          match2 = applyCondition(
            modifier,
            modifierSearchQuery2,
            modifierCondition2
          );
        }

        return modifierCombiner === "And" ? match1 && match2 : match1 || match2;
      });
    }

    setFilteredTagList(currentFilteredList);
    setTitleFilterDropdown(false);
    setCreatedByFilterDropdown(false);
    setDateCreatedFilterDropdown(false);
    setDateModifiedFilterDropdown(false);
    setModifiedByFilterDropdown(false);
  }, [
    selectedTitles,
    selectedCreators,
    selectedDates,
    selectedModifiedDates,
    selectedModifiers,
    searchQuery1,
    searchQuery2,
    creatorSearchQuery1,
    creatorSearchQuery2,
    dateSearchQuery1,
    dateSearchQuery2,
    modifiedDateSearchQuery1,
    modifiedDateSearchQuery2,
    modifierSearchQuery1,
    modifierSearchQuery2,
    condition1,
    condition2,
    creatorCondition1,
    creatorCondition2,
    dateCondition1,
    dateCondition2,
    modifiedDateCondition1,
    modifiedDateCondition2,
    modifierCondition1,
    modifierCondition2,
    combiner,
    creatorCombiner,
    dateCombiner,
    modifiedDateCombiner,
    modifierCombiner,
    tagData,
  ]);

  // Add useEffect for checkbox filtering
  useEffect(() => {
    let currentFilteredList = tagData;

    // Apply title checkbox filter
    if (selectedTitles.length > 0) {
      currentFilteredList = currentFilteredList.filter((tag) =>
        selectedTitles.includes(tag.title)
      );
    }

    // Apply creator checkbox filter
    if (selectedCreators.length > 0) {
      currentFilteredList = currentFilteredList.filter((tag) =>
        selectedCreators.includes(tag.createdBy)
      );
    }

    // Apply date checkbox filter
    if (selectedDates.length > 0) {
      currentFilteredList = currentFilteredList.filter((tag) =>
        selectedDates.includes(tag.dateCreated)
      );
    }

    // Apply modified date checkbox filter
    if (selectedModifiedDates.length > 0) {
      currentFilteredList = currentFilteredList.filter((tag) =>
        selectedModifiedDates.includes(tag.dateModified)
      );
    }

    // Apply modifier checkbox filter
    if (selectedModifiers.length > 0) {
      currentFilteredList = currentFilteredList.filter((tag) =>
        selectedModifiers.includes(tag.modifiedBy)
      );
    }

    setFilteredTagList(currentFilteredList);
  }, [
    selectedTitles,
    selectedCreators,
    selectedDates,
    selectedModifiedDates,
    selectedModifiers,
    tagData
  ]);

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
    setSelectedTitles([]);
    setSelectedCreators([]);
    setSelectedDates([]);
    setSelectedModifiedDates([]);
    setSelectedModifiers([]);
    setSearchQuery1("");
    setSearchQuery2("");
    setCreatorSearchQuery1("");
    setCreatorSearchQuery2("");
    setDateSearchQuery1("");
    setDateSearchQuery2("");
    setModifiedDateSearchQuery1("");
    setModifiedDateSearchQuery2("");
    setModifierSearchQuery1("");
    setModifierSearchQuery2("");
    setCondition1("Is equal to");
    setCondition2("Is equal to");
    setCreatorCondition1("Is equal to");
    setCreatorCondition2("Is equal to");
    setDateCondition1("Is equal to");
    setDateCondition2("Is equal to");
    setModifiedDateCondition1("Is equal to");
    setModifiedDateCondition2("Is equal to");
    setModifierCondition1("Is equal to");
    setModifierCondition2("Is equal to");
    setCombiner("And");
    setCreatorCombiner("And");
    setDateCombiner("And");
    setModifiedDateCombiner("And");
    setModifierCombiner("And");
    setFilteredTagList(tagData);
    setTitleFilterDropdown(false);
    setCreatedByFilterDropdown(false);
    setDateCreatedFilterDropdown(false);
    setDateModifiedFilterDropdown(false);
    setModifiedByFilterDropdown(false);
  }, [tagData]);

  const handleCloseDropdown = useCallback((dropdownType) => {
    switch (dropdownType) {
      case "title":
        setTitleFilterDropdown(false);
        break;
      case "createdBy":
        setCreatedByFilterDropdown(false);
        break;
      case "dateCreated":
        setDateCreatedFilterDropdown(false);
        break;
      case "dateModified":
        setDateModifiedFilterDropdown(false);
        break;
      case "modifiedBy":
        setModifiedByFilterDropdown(false);
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
      if (titleFilterDropdown) updateDropdownPosition("title");
      if (createdByFilterDropdown) updateDropdownPosition("createdBy");
      if (dateCreatedFilterDropdown) updateDropdownPosition("dateCreated");
      if (dateModifiedFilterDropdown) updateDropdownPosition("dateModified");
      if (modifiedByFilterDropdown) updateDropdownPosition("modifiedBy");
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [
    titleFilterDropdown,
    createdByFilterDropdown,
    dateCreatedFilterDropdown,
    dateModifiedFilterDropdown,
    modifiedByFilterDropdown,
  ]);

  // Add sort handler
  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedData = [...filteredTagList].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    setFilteredTagList(sortedData);
  };

  // Update MemoizedSortableHeader component
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
              case "title":
                setTitleFilterDropdown((prev) => !prev);
                break;
              case "createdBy":
                setCreatedByFilterDropdown((prev) => !prev);
                break;
              case "dateCreated":
                setDateCreatedFilterDropdown((prev) => !prev);
                break;
              case "dateModified":
                setDateModifiedFilterDropdown((prev) => !prev);
                break;
              case "modifiedBy":
                setModifiedByFilterDropdown((prev) => !prev);
                break;
              default:
                break;
            }
          }}
        >
          {label}
          <div className="flex flex-col">
            <FaSortUp
              className={`text-xs -mb-1 cursor-pointer ${sortConfig.key === columnKey && sortConfig.direction === 'ascending' ? 'text-blue-500' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                handleSort(columnKey);
              }}
            />
            <FaSortDown
              className={`text-xs -mt-1 cursor-pointer ${sortConfig.key === columnKey && sortConfig.direction === 'descending' ? 'text-blue-500' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                handleSort(columnKey);
              }}
            />
          </div>
        </div>
      </th>
    );
  });

  const renderDropdown = (columnKey) => {
    const dropdownContent = () => {
      const getDropdownProps = () => {
        switch (columnKey) {
          case "title":
            return {
              isOpen: titleFilterDropdown,
              title: "Title",
              allSelected: allSelected,
              onSelectAll: handleSelectAll,
              items: uniqueTitles,
              selectedItems: selectedTitles,
              onItemSelect: handleTitleCheckbox,
              searchQuery1,
              searchQuery2,
              onSearchQuery1Change: (e) => setSearchQuery1(e.target.value),
              onSearchQuery2Change: (e) => setSearchQuery2(e.target.value),
              condition1,
              condition2,
              onCondition1Change: (e) => setCondition1(e.target.value),
              onCondition2Change: (e) => setCondition2(e.target.value),
              combiner,
              onCombinerChange: (e) => setCombiner(e.target.value),
              position: dropdownPosition,
              onClose: () => handleCloseDropdown("title"),
              onFilter: handleFilter,
              onClearFilter: handleClearFilter,
            };
          case "createdBy":
            return {
              isOpen: createdByFilterDropdown,
              title: "Created By",
              allSelected: allCreatorsSelected,
              onSelectAll: handleSelectAllCreators,
              items: uniqueCreators,
              selectedItems: selectedCreators,
              onItemSelect: handleCreatorCheckbox,
              searchQuery1: creatorSearchQuery1,
              searchQuery2: creatorSearchQuery2,
              onSearchQuery1Change: (e) =>
                setCreatorSearchQuery1(e.target.value),
              onSearchQuery2Change: (e) =>
                setCreatorSearchQuery2(e.target.value),
              condition1: creatorCondition1,
              condition2: creatorCondition2,
              onCondition1Change: (e) => setCreatorCondition1(e.target.value),
              onCondition2Change: (e) => setCreatorCondition2(e.target.value),
              combiner: creatorCombiner,
              onCombinerChange: (e) => setCreatorCombiner(e.target.value),
              position: dropdownPosition,
              onClose: () => handleCloseDropdown("createdBy"),
              onFilter: handleFilter,
              onClearFilter: handleClearFilter,
            };
          case "dateCreated":
            return {
              isOpen: dateCreatedFilterDropdown,
              title: "Date Created",
              allSelected: allDatesSelected,
              onSelectAll: handleSelectAllDates,
              items: uniqueDates,
              selectedItems: selectedDates,
              onItemSelect: handleDateCheckbox,
              searchQuery1: dateSearchQuery1,
              searchQuery2: dateSearchQuery2,
              onSearchQuery1Change: (e) => setDateSearchQuery1(e.target.value),
              onSearchQuery2Change: (e) => setDateSearchQuery2(e.target.value),
              condition1: dateCondition1,
              condition2: dateCondition2,
              onCondition1Change: (e) => setDateCondition1(e.target.value),
              onCondition2Change: (e) => setDateCondition2(e.target.value),
              combiner: dateCombiner,
              onCombinerChange: (e) => setDateCombiner(e.target.value),
              position: dropdownPosition,
              onClose: () => handleCloseDropdown("dateCreated"),
              onFilter: handleFilter,
              onClearFilter: handleClearFilter,
              isDateField: true,
            };
          case "dateModified":
            return {
              isOpen: dateModifiedFilterDropdown,
              title: "Date Modified",
              allSelected: allModifiedDatesSelected,
              onSelectAll: handleSelectAllModifiedDates,
              items: uniqueModifiedDates,
              selectedItems: selectedModifiedDates,
              onItemSelect: handleModifiedDateCheckbox,
              searchQuery1: modifiedDateSearchQuery1,
              searchQuery2: modifiedDateSearchQuery2,
              onSearchQuery1Change: (e) =>
                setModifiedDateSearchQuery1(e.target.value),
              onSearchQuery2Change: (e) =>
                setModifiedDateSearchQuery2(e.target.value),
              condition1: modifiedDateCondition1,
              condition2: modifiedDateCondition2,
              onCondition1Change: (e) =>
                setModifiedDateCondition1(e.target.value),
              onCondition2Change: (e) =>
                setModifiedDateCondition2(e.target.value),
              combiner: modifiedDateCombiner,
              onCombinerChange: (e) => setModifiedDateCombiner(e.target.value),
              position: dropdownPosition,
              onClose: () => handleCloseDropdown("dateModified"),
              onFilter: handleFilter,
              onClearFilter: handleClearFilter,
              isDateField: true,
            };
          case "modifiedBy":
            return {
              isOpen: modifiedByFilterDropdown,
              title: "Modified By",
              allSelected: allModifiersSelected,
              onSelectAll: handleSelectAllModifiers,
              items: uniqueModifiers,
              selectedItems: selectedModifiers,
              onItemSelect: handleModifierCheckbox,
              searchQuery1: modifierSearchQuery1,
              searchQuery2: modifierSearchQuery2,
              onSearchQuery1Change: (e) =>
                setModifierSearchQuery1(e.target.value),
              onSearchQuery2Change: (e) =>
                setModifierSearchQuery2(e.target.value),
              condition1: modifierCondition1,
              condition2: modifierCondition2,
              onCondition1Change: (e) => setModifierCondition1(e.target.value),
              onCondition2Change: (e) => setModifierCondition2(e.target.value),
              combiner: modifierCombiner,
              onCombinerChange: (e) => setModifierCombiner(e.target.value),
              position: dropdownPosition,
              onClose: () => handleCloseDropdown("modifiedBy"),
              onFilter: handleFilter,
              onClearFilter: handleClearFilter,
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
      <div className="overflow-x-auto rounded-lg border dark:border-gray-800 h-[75vh]">
        {loading ? (
          <Loader />
        ) : filteredTagList.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '300px',
            color: '#d97706',
            fontWeight: 600,
            fontSize: '1.2rem'
          }}>
            No Data Found
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100 dark:bg-zinc-900 text-black dark:text-white">
                <MemoizedSortableHeader label="Title" columnKey="title" />
                <MemoizedSortableHeader
                  label="Created By"
                  columnKey="createdBy"
                />
                <MemoizedSortableHeader
                  label="Date Created"
                  columnKey="dateCreated"
                />
                <MemoizedSortableHeader
                  label="Date Modified"
                  columnKey="dateModified"
                />
                <MemoizedSortableHeader
                  label="Modified By"
                  columnKey="modifiedBy"
                />
                <TableHead>Edit</TableHead>
                <TableHead>Clone</TableHead>
                <TableHead>Print</TableHead>
                <TableHead>Delete</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredTagList.map((tag, idx) => (
                <TableRow key={idx}>
                  <TableCell>{tag.title}</TableCell>
                  <TableCell>{tag.createdBy}</TableCell>
                  <TableCell>{tag.dateCreated}</TableCell>
                  <TableCell>{tag.dateModified}</TableCell>
                  <TableCell>{tag.modifiedBy}</TableCell>

                  <TableCell>
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
                    <Button onClick={() => navigate("/print", { state: { tagTile: tag.title } })} className="flex items-center gap-1 px-2 py-1 text-sm rounded bg-gray-300 hover:bg-gray-400 text-black transition">
                      <FiPrinter className="text-sm" />
                      Print
                    </Button>
                  </TableCell>

                  <TableCell>
                    <Button
                      className="flex items-center gap-1 px-2 py-1 text-sm rounded bg-gray-300 hover:bg-gray-400 text-black transition"
                      onClick={() => {
                        setItemToDelete(tag.title);
                        setShowDeleteConfirm(true);
                        setTagListDeleteId(tag.id);
                      }}
                    >
                      <FiTrash2 className="text-sm" />
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
      {renderDropdown("title")}
      {renderDropdown("createdBy")}
      {renderDropdown("dateCreated")}
      {renderDropdown("dateModified")}
      {renderDropdown("modifiedBy")}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10001] shadow-4xl">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-[300px]">
            <div className="flex justify-between items-center mb-4 border-b pb-1">
              <h3 className="text-lg font-medium text-black dark:text-white ">Confirm Delete</h3>
              <button onClick={() => setShowDeleteConfirm(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <FiX className="h-5 w-5" />
              </button>
            </div>
            <div className="flex items-center gap-3 mb-6">
              <HelpCircle className="h-10 w-10 text-blue-500" />
              <p className="text-black dark:text-white">Delete the template {itemToDelete}?</p>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                className="bg-gray-300 text-black py-0.5 h-[2rem] px-8 rounded hover:bg-gray-400"
                onClick={handleDelete}
              >
                Yes
              </Button>
              <Button
                className="bg-gray-300 text-black  py-0.5 h-[2rem] px-8 rounded hover:bg-gray-400"
                onClick={() => setShowDeleteConfirm(false)}
              >
                No
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default List;