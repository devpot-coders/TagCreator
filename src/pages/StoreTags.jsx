import React, { useState, useCallback } from "react";
import {
  FiRefreshCw,
  FiSearch,
  FiPrinter,
  FiTrash2,
  FiSettings,
  FiCheck,
  FiSquare,
  FiX,
  FiDownload,
} from "react-icons/fi";
import { Button } from "../components/ui/button";
import { FaSortUp, FaSortDown } from "react-icons/fa";
import PrintSettingsPopup from "../components/PrintSettingPopup";

function StoreTags() {
  const tagData = [
    {
      title: "Tag 1",
      createdBy: "John Doe",
      dateCreated: "2024-04-01",
      dateModified: "2024-04-02",
      modifiedBy: "Jane Doe",
    },
    {
      title: "Tag 2",
      createdBy: "Jane Doe",
      dateCreated: "2024-04-02",
      dateModified: "2024-04-03",
      modifiedBy: "John Doe",
    },

  ];

  const [filteredTagList, setFilteredTagList] = useState(tagData);
  const [showSelFilterDropdown, setShowSelFilterDropdown] = useState(false);
  const [selDropdownPosition, setSelDropdownPosition] = useState(null);
  const [selectedTitles, setSelectedTitles] = useState([]);
  const [selSearchQuery1, setSelSearchQuery1] = useState("");
  const [selSearchQuery2, setSelSearchQuery2] = useState("");
  const [selCondition1, setSelCondition1] = useState("Is equal to");
  const [selCondition2, setSelCondition2] = useState("Is equal to");
  const [selCombiner, setSelCombiner] = useState("And");

  const [showBCFilterDropdown, setShowBCFilterDropdown] = useState(false);
  const [bcDropdownPosition, setBCDropdownPosition] = useState(null);
  const [selectedBCs, setSelectedBCs] = useState([]);
  const [bcSearchQuery1, setBCSearchQuery1] = useState("");
  const [bcSearchQuery2, setBCSearchQuery2] = useState("");
  const [bcCondition1, setBCCondition1] = useState("Is equal to");
  const [bcCondition2, setBCCondition2] = useState("Is equal to");
  const [bcCombiner, setBCCombiner] = useState("And");

  const [showItemFilterDropdown, setShowItemFilterDropdown] = useState(false);
  const [itemDropdownPosition, setItemDropdownPosition] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [itemSearchQuery1, setItemSearchQuery1] = useState("");
  const [itemSearchQuery2, setItemSearchQuery2] = useState("");
  const [itemCondition1, setItemCondition1] = useState("Is equal to");
  const [itemCondition2, setItemCondition2] = useState("Is equal to");
  const [itemCombiner, setItemCombiner] = useState("And");

  const [showDescriptionFilterDropdown, setShowDescriptionFilterDropdown] = useState(false);
  const [descriptionDropdownPosition, setDescriptionDropdownPosition] = useState(null);
  const [selectedDescriptions, setSelectedDescriptions] = useState([]);
  const [descriptionSearchQuery1, setDescriptionSearchQuery1] = useState("");
  const [descriptionSearchQuery2, setDescriptionSearchQuery2] = useState("");
  const [descriptionCondition1, setDescriptionCondition1] = useState("Is equal to");
  const [descriptionCondition2, setDescriptionCondition2] = useState("Is equal to");
  const [descriptionCombiner, setDescriptionCombiner] = useState("And");

  const [showTemplateFilterDropdown, setShowTemplateFilterDropdown] = useState(false);
  const [templateDropdownPosition, setTemplateDropdownPosition] = useState(null);
  const [selectedTemplates, setSelectedTemplates] = useState([]);
  const [templateSearchQuery1, setTemplateSearchQuery1] = useState("");
  const [templateSearchQuery2, setTemplateSearchQuery2] = useState("");
  const [templateCondition1, setTemplateCondition1] = useState("Is equal to");
  const [templateCondition2, setTemplateCondition2] = useState("Is equal to");
  const [templateCombiner, setTemplateCombiner] = useState("And");

  const [showDateCreatedFilterDropdown, setShowDateCreatedFilterDropdown] = useState(false);
  const [dateCreatedDropdownPosition, setDateCreatedDropdownPosition] = useState(null);
  const [selectedDateCreated, setSelectedDateCreated] = useState([]);
  const [dateCreatedSearchQuery1, setDateCreatedSearchQuery1] = useState("");
  const [dateCreatedSearchQuery2, setDateCreatedSearchQuery2] = useState("");
  const [dateCreatedCondition1, setDateCreatedCondition1] = useState("Is equal to");
  const [dateCreatedCondition2, setDateCreatedCondition2] = useState("Is equal to");
  const [dateCreatedCombiner, setDateCreatedCombiner] = useState("And");

  const [showCreatedByFilterDropdown, setShowCreatedByFilterDropdown] = useState(false);
  const [createdByDropdownPosition, setCreatedByDropdownPosition] = useState(null);
  const [selectedCreatedBy, setSelectedCreatedBy] = useState([]);
  const [createdBySearchQuery1, setCreatedBySearchQuery1] = useState("");
  const [createdBySearchQuery2, setCreatedBySearchQuery2] = useState("");
  const [createdByCondition1, setCreatedByCondition1] = useState("Is equal to");
  const [createdByCondition2, setCreatedByCondition2] = useState("Is equal to");
  const [createdByCombiner, setCreatedByCombiner] = useState("And");

  // State for Print Settings Popup
  const [showPrintSettingsPopup, setShowPrintSettingsPopup] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // You can adjust this value
  const [selectedTableRows, setSelectedTableRows] = useState([]); // New state for selected table rows
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query

  const uniqueTitles = Array.from(new Set(tagData.map((tag) => tag.title)));
  const allSelTitlesSelected = selectedTitles.length === uniqueTitles.length;

  const uniqueBCs = Array.from(new Set(tagData.map((tag) => tag.title))); // Assuming title is "BC #" here for now
  const allBCsSelected = selectedBCs.length === uniqueBCs.length;

  const uniqueItems = Array.from(new Set(tagData.map((tag) => tag.createdBy)));
  const allItemsSelected = selectedItems.length === uniqueItems.length;

  const uniqueDescriptions = Array.from(new Set(tagData.map((tag) => tag.dateCreated)));
  const allDescriptionsSelected = selectedDescriptions.length === uniqueDescriptions.length;

  const uniqueTemplates = Array.from(new Set(tagData.map((tag) => tag.dateModified)));
  const allTemplatesSelected = selectedTemplates.length === uniqueTemplates.length;

  const uniqueDateCreated = Array.from(new Set(tagData.map((tag) => tag.dateCreated)));
  const allDateCreatedSelected = selectedDateCreated.length === uniqueDateCreated.length;

  const uniqueCreatedBy = Array.from(new Set(tagData.map((tag) => tag.createdBy)));
  const allCreatedBySelected = selectedCreatedBy.length === uniqueCreatedBy.length;

  const totalPages = Math.ceil(filteredTagList.length / itemsPerPage);

  const currentItems = filteredTagList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle checkbox change for individual table rows
  const handleTableRowCheckboxChange = useCallback((title) => {
    setSelectedTableRows(prev =>
      prev.includes(title) ? prev.filter(item => item !== title) : [...prev, title]
    );
  }, []);

  // Handle global Select All for table rows
  const handleSelectAllTableRows = useCallback(() => {
    const allCurrentPageTitles = currentItems.map(item => item.title);
    setSelectedTableRows(allCurrentPageTitles);
  }, [currentItems]);

  // Handle global Deselect All for table rows
  const handleDeselectAllTableRows = useCallback(() => {
    setSelectedTableRows([]);
  }, []);

  const applyCondition = useCallback((value, query, condition) => {
    const lowerCaseValue = value.toLowerCase();
    const lowerCaseQuery = query.toLowerCase();

    switch (condition) {
      case 'Is equal to':
        return lowerCaseValue === lowerCaseQuery;
      case 'Does not equal':
        return lowerCaseValue !== lowerCaseQuery;
      case 'Contains':
        return lowerCaseValue.includes(lowerCaseQuery);
      case 'Does not contain':
        return !lowerCaseValue.includes(lowerCaseQuery);
      case 'Starts with':
        return lowerCaseValue.startsWith(lowerCaseQuery);
      case 'Ends with':
        return lowerCaseValue.endsWith(lowerCaseQuery);
      default:
        return true;
    }
  }, []);

  const handleSelTitleCheckbox = useCallback((title) => {
    setSelectedTitles((prev) =>
      prev.includes(title)
        ? prev.filter((t) => t !== title)
        : [...prev, title]
    );
  }, []);

  const handleSelSelectAll = useCallback(() => {
    setSelectedTitles(allSelTitlesSelected ? [] : uniqueTitles);
  }, [allSelTitlesSelected, uniqueTitles]);

  const handleSelFilter = useCallback(() => {
    let currentFilteredList = tagData;

    // Apply title checkbox filter
    if (selectedTitles.length > 0) {
      currentFilteredList = currentFilteredList.filter((tag) =>
        selectedTitles.includes(tag.title)
      );
    }

    // Apply title text filter
    if (selSearchQuery1 || selSearchQuery2) {
      currentFilteredList = currentFilteredList.filter((tag) => {
        const title = String(tag.title || "");
        let match1 = true;
        let match2 = true;

        if (selSearchQuery1) {
          match1 = applyCondition(title, selSearchQuery1, selCondition1);
        }

        if (selSearchQuery2) {
          match2 = applyCondition(title, selSearchQuery2, selCondition2);
        }

        return selCombiner === "And" ? match1 && match2 : match1 || match2;
      });
    }

    setFilteredTagList(currentFilteredList);
    setShowSelFilterDropdown(false);
  }, [selectedTitles, selSearchQuery1, selSearchQuery2, selCondition1, selCondition2, selCombiner, tagData, applyCondition]);

  const handleClearSelFilter = useCallback(() => {
    setSelectedTitles([]);
    setSelSearchQuery1('');
    setSelSearchQuery2('');
    setSelCondition1('Is equal to');
    setSelCondition2('Is equal to');
    setSelCombiner('And');
    setFilteredTagList(tagData);
    setShowSelFilterDropdown(false);
  }, [tagData]);

  const handleCloseSelDropdown = useCallback(() => {
    setShowSelFilterDropdown(false);
  }, []);

  const handleBCCheckbox = useCallback((bc) => {
    setSelectedBCs((prev) =>
      prev.includes(bc)
        ? prev.filter((t) => t !== bc)
        : [...prev, bc]
    );
  }, []);

  const handleBCSelectAll = useCallback(() => {
    setSelectedBCs(allBCsSelected ? [] : uniqueBCs);
  }, [allBCsSelected, uniqueBCs]);

  const handleBCFilter = useCallback(() => {
    let currentFilteredList = tagData;

    // Apply BC checkbox filter
    if (selectedBCs.length > 0) {
      currentFilteredList = currentFilteredList.filter((tag) =>
        selectedBCs.includes(tag.title) // Assuming title is BC # here for now
      );
    }

    // Apply BC text filter
    if (bcSearchQuery1 || bcSearchQuery2) {
      currentFilteredList = currentFilteredList.filter((tag) => {
        const bc = String(tag.title || ""); // Assuming title is BC # here for now
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

    setFilteredTagList(currentFilteredList);
    setShowBCFilterDropdown(false);
  }, [selectedBCs, bcSearchQuery1, bcSearchQuery2, bcCondition1, bcCondition2, bcCombiner, tagData, applyCondition]);

  const handleClearBCFilter = useCallback(() => {
    setSelectedBCs([]);
    setBCSearchQuery1('');
    setBCSearchQuery2('');
    setBCCondition1('Is equal to');
    setBCCondition2('Is equal to');
    setBCCombiner('And');
    setFilteredTagList(tagData);
    setShowBCFilterDropdown(false);
  }, [tagData]);

  const handleCloseBCDropdown = useCallback(() => {
    setShowBCFilterDropdown(false);
  }, []);

  const handleItemCheckbox = useCallback((item) => {
    setSelectedItems((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item]
    );
  }, []);

  const handleItemSelectAll = useCallback(() => {
    setSelectedItems(allItemsSelected ? [] : uniqueItems);
  }, [allItemsSelected, uniqueItems]);

  const handleItemFilter = useCallback(() => {
    let currentFilteredList = tagData;

    // Apply item checkbox filter
    if (selectedItems.length > 0) {
      currentFilteredList = currentFilteredList.filter((tag) =>
        selectedItems.includes(tag.createdBy) // Filtering by createdBy for Item
      );
    }

    // Apply item text filter
    if (itemSearchQuery1 || itemSearchQuery2) {
      currentFilteredList = currentFilteredList.filter((tag) => {
        const item = String(tag.createdBy || "");
        let match1 = true;
        let match2 = true;

        if (itemSearchQuery1) {
          match1 = applyCondition(item, itemSearchQuery1, itemCondition1);
        }

        if (itemSearchQuery2) {
          match2 = applyCondition(item, itemSearchQuery2, itemCondition2);
        }

        return itemCombiner === "And" ? match1 && match2 : match1 || match2;
      });
    }

    setFilteredTagList(currentFilteredList);
    setShowItemFilterDropdown(false);
  }, [selectedItems, itemSearchQuery1, itemSearchQuery2, itemCondition1, itemCondition2, itemCombiner, tagData, applyCondition]);

  const handleClearItemFilter = useCallback(() => {
    setSelectedItems([]);
    setItemSearchQuery1('');
    setItemSearchQuery2('');
    setItemCondition1('Is equal to');
    setItemCondition2('Is equal to');
    setItemCombiner('And');
    setFilteredTagList(tagData);
    setShowItemFilterDropdown(false);
  }, [tagData]);

  const handleCloseItemDropdown = useCallback(() => {
    setShowItemFilterDropdown(false);
  }, []);

  const handleDescriptionCheckbox = useCallback((description) => {
    setSelectedDescriptions((prev) =>
      prev.includes(description)
        ? prev.filter((d) => d !== description)
        : [...prev, description]
    );
  }, []);

  const handleDescriptionSelectAll = useCallback(() => {
    setSelectedDescriptions(allDescriptionsSelected ? [] : uniqueDescriptions);
  }, [allDescriptionsSelected, uniqueDescriptions]);

  const handleDescriptionFilter = useCallback(() => {
    let currentFilteredList = tagData;

    // Apply description checkbox filter
    if (selectedDescriptions.length > 0) {
      currentFilteredList = currentFilteredList.filter((tag) =>
        selectedDescriptions.includes(tag.dateCreated) // Filtering by dateCreated for Description
      );
    }

    // Apply description text filter
    if (descriptionSearchQuery1 || descriptionSearchQuery2) {
      currentFilteredList = currentFilteredList.filter((tag) => {
        const description = String(tag.dateCreated || "");
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

    setFilteredTagList(currentFilteredList);
    setShowDescriptionFilterDropdown(false);
  }, [selectedDescriptions, descriptionSearchQuery1, descriptionSearchQuery2, descriptionCondition1, descriptionCondition2, descriptionCombiner, tagData, applyCondition]);

  const handleClearDescriptionFilter = useCallback(() => {
    setSelectedDescriptions([]);
    setDescriptionSearchQuery1('');
    setDescriptionSearchQuery2('');
    setDescriptionCondition1('Is equal to');
    setDescriptionCondition2('Is equal to');
    setDescriptionCombiner('And');
    setFilteredTagList(tagData);
    setShowDescriptionFilterDropdown(false);
  }, [tagData]);

  const handleCloseDescriptionDropdown = useCallback(() => {
    setShowDescriptionFilterDropdown(false);
  }, []);

  const handleTemplateCheckbox = useCallback((template) => {
    setSelectedTemplates((prev) =>
      prev.includes(template)
        ? prev.filter((t) => t !== template)
        : [...prev, template]
    );
  }, []);

  const handleTemplateSelectAll = useCallback(() => {
    setSelectedTemplates(allTemplatesSelected ? [] : uniqueTemplates);
  }, [allTemplatesSelected, uniqueTemplates]);

  const handleTemplateFilter = useCallback(() => {
    let currentFilteredList = tagData;

    // Apply template checkbox filter
    if (selectedTemplates.length > 0) {
      currentFilteredList = currentFilteredList.filter((tag) =>
        selectedTemplates.includes(tag.dateModified) // Filtering by dateModified for Template
      );
    }

    // Apply template text filter
    if (templateSearchQuery1 || templateSearchQuery2) {
      currentFilteredList = currentFilteredList.filter((tag) => {
        const template = String(tag.dateModified || "");
        let match1 = true;
        let match2 = true;

        if (templateSearchQuery1) {
          match1 = applyCondition(template, templateSearchQuery1, templateCondition1);
        }

        if (templateSearchQuery2) {
          match2 = applyCondition(template, templateSearchQuery2, templateCondition2);
        }

        return templateCombiner === "And" ? match1 && match2 : match1 || match2;
      });
    }

    setFilteredTagList(currentFilteredList);
    setShowTemplateFilterDropdown(false);
  }, [selectedTemplates, templateSearchQuery1, templateSearchQuery2, templateCondition1, templateCondition2, templateCombiner, tagData, applyCondition]);

  const handleClearTemplateFilter = useCallback(() => {
    setSelectedTemplates([]);
    setTemplateSearchQuery1('');
    setTemplateSearchQuery2('');
    setTemplateCondition1('Is equal to');
    setTemplateCondition2('Is equal to');
    setTemplateCombiner('And');
    setFilteredTagList(tagData);
    setShowTemplateFilterDropdown(false);
  }, [tagData]);

  const handleCloseTemplateDropdown = useCallback(() => {
    setShowTemplateFilterDropdown(false);
  }, []);

  const handleDateCreatedCheckbox = useCallback((date) => {
    setSelectedDateCreated((prev) =>
      prev.includes(date)
        ? prev.filter((d) => d !== date)
        : [...prev, date]
    );
  }, []);

  const handleDateCreatedSelectAll = useCallback(() => {
    setSelectedDateCreated(allDateCreatedSelected ? [] : uniqueDateCreated);
  }, [allDateCreatedSelected, uniqueDateCreated]);

  const handleDateCreatedFilter = useCallback(() => {
    let currentFilteredList = tagData;

    // Apply date created checkbox filter
    if (selectedDateCreated.length > 0) {
      currentFilteredList = currentFilteredList.filter((tag) =>
        selectedDateCreated.includes(tag.dateCreated)
      );
    }

    // Apply date created text filter
    if (dateCreatedSearchQuery1 || dateCreatedSearchQuery2) {
      currentFilteredList = currentFilteredList.filter((tag) => {
        const date = String(tag.dateCreated || "");
        let match1 = true;
        let match2 = true;

        if (dateCreatedSearchQuery1) {
          match1 = applyCondition(date, dateCreatedSearchQuery1, dateCreatedCondition1);
        }

        if (dateCreatedSearchQuery2) {
          match2 = applyCondition(date, dateCreatedSearchQuery2, dateCreatedCondition2);
        }

        return dateCreatedCombiner === "And" ? match1 && match2 : match1 || match2;
      });
    }

    setFilteredTagList(currentFilteredList);
    setShowDateCreatedFilterDropdown(false);
  }, [selectedDateCreated, dateCreatedSearchQuery1, dateCreatedSearchQuery2, dateCreatedCondition1, dateCreatedCondition2, dateCreatedCombiner, tagData, applyCondition]);

  const handleClearDateCreatedFilter = useCallback(() => {
    setSelectedDateCreated([]);
    setDateCreatedSearchQuery1('');
    setDateCreatedSearchQuery2('');
    setDateCreatedCondition1('Is equal to');
    setDateCreatedCondition2('Is equal to');
    setDateCreatedCombiner('And');
    setFilteredTagList(tagData);
    setShowDateCreatedFilterDropdown(false);
  }, [tagData]);

  const handleCloseDateCreatedDropdown = useCallback(() => {
    setShowDateCreatedFilterDropdown(false);
  }, []);

  const handleCreatedByCheckbox = useCallback((name) => {
    setSelectedCreatedBy((prev) =>
      prev.includes(name)
        ? prev.filter((n) => n !== name)
        : [...prev, name]
    );
  }, []);

  const handleCreatedBySelectAll = useCallback(() => {
    setSelectedCreatedBy(allCreatedBySelected ? [] : uniqueCreatedBy);
  }, [allCreatedBySelected, uniqueCreatedBy]);

  const handleCreatedByFilter = useCallback(() => {
    let currentFilteredList = tagData;

    // Apply created by checkbox filter
    if (selectedCreatedBy.length > 0) {
      currentFilteredList = currentFilteredList.filter((tag) =>
        selectedCreatedBy.includes(tag.createdBy)
      );
    }

    // Apply created by text filter
    if (createdBySearchQuery1 || createdBySearchQuery2) {
      currentFilteredList = currentFilteredList.filter((tag) => {
        const name = String(tag.createdBy || "");
        let match1 = true;
        let match2 = true;

        if (createdBySearchQuery1) {
          match1 = applyCondition(name, createdBySearchQuery1, createdByCondition1);
        }

        if (createdBySearchQuery2) {
          match2 = applyCondition(name, createdBySearchQuery2, createdByCondition2);
        }

        return createdByCombiner === "And" ? match1 && match2 : match1 || match2;
      });
    }

    setFilteredTagList(currentFilteredList);
    setShowCreatedByFilterDropdown(false);
  }, [selectedCreatedBy, createdBySearchQuery1, createdBySearchQuery2, createdByCondition1, createdByCondition2, createdByCombiner, tagData, applyCondition]);

  const handleClearCreatedByFilter = useCallback(() => {
    setSelectedCreatedBy([]);
    setCreatedBySearchQuery1('');
    setCreatedBySearchQuery2('');
    setCreatedByCondition1('Is equal to');
    setCreatedByCondition2('Is equal to');
    setCreatedByCombiner('And');
    setFilteredTagList(tagData);
    setShowCreatedByFilterDropdown(false);
  }, [tagData]);

  const handleCloseCreatedByDropdown = useCallback(() => {
    setShowCreatedByFilterDropdown(false);
  }, []);

  // Handle search functionality
  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
    
    if (!query.trim()) {
      setFilteredTagList(tagData);
      return;
    }

    const searchResults = tagData.filter((tag) => {
      const searchableFields = [
        tag.title,
        tag.createdBy,
        tag.dateCreated,
        tag.dateModified,
        tag.modifiedBy
      ];
      
      return searchableFields.some(field => 
        field.toLowerCase().includes(query.toLowerCase())
      );
    });

    setFilteredTagList(searchResults);
  }, [tagData]);

  // Handle refresh functionality
  const handleRefresh = useCallback(() => {
    setFilteredTagList(tagData);
    setSearchQuery("");
    setCurrentPage(1);
    setSelectedTableRows([]);
    setSelectedTitles([]);
    setSelectedBCs([]);
    setSelectedItems([]);
    setSelectedDescriptions([]);
    setSelectedTemplates([]);
    setSelectedDateCreated([]);
    setSelectedCreatedBy([]);
  }, [tagData]);

  // Handle opening the print settings popup
  const handleOpenPrintSettings = useCallback(() => {
    setShowPrintSettingsPopup(true);
  }, []);

  // Handle closing the print settings popup
  const handleClosePrintSettings = useCallback(() => {
    setShowPrintSettingsPopup(false);
  }, []);

  // Handle saving print settings (you can implement actual save logic here)
  const handleSavePrintSettings = useCallback((settings) => {
    console.log("Saved Print Settings:", settings);
    // Here you would typically send these settings to a backend or use them locally
    // For now, we'll just log them to the console.
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 w-full">
      {/* Top Filters */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-4">
          <span className="font-semibold">Filter Sequences</span>
          <select className="border px-2 py-1 text-sm ">
            <option>Select Store ...</option>
            <option>Select Store ...</option>
          </select>
          <select className="border px-2 py-1 text-sm">
            <option>Select Tag</option>
            <option>Select Tag</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            className="bg-green-400 hover:text-white hover:bg-green-400 text-black px-3 py-1 flex items-center gap-1 rounded shadow"
            onClick={handleRefresh}
          >
            <FiRefreshCw /> Refresh
          </Button>
          <div className="flex items-center border px-2">
            <FiSearch className="text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="border-0 focus:outline-none px-2 py-1 text-sm bg-transparent"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            className="border px-3 py-1 text-sm flex items-center gap-1"
            onClick={handleSelectAllTableRows}
          >
            <FiCheck /> Select All
          </button>
          <button 
            className="border px-3 py-1 text-sm flex items-center gap-1"
            onClick={handleDeselectAllTableRows}
          >
            <FiSquare /> Deselect All
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              {["Sel", "BC #", "Item", "Description", "Template", "Date Created", "Created By"].map((head, index) => (
                <th
                  key={index}
                  className="text-left px-2 py-2 border-r font-medium relative"
                >
                  <div
                    className="flex items-center gap-1 cursor-pointer"
                    onClick={(e) => {
                      if (head === "Sel") {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setSelDropdownPosition({
                          top: rect.bottom + window.scrollY - 8,
                          left: rect.left + window.scrollX,
                        });
                        setShowSelFilterDropdown(true);
                        setShowBCFilterDropdown(false);
                        setShowItemFilterDropdown(false);
                        setShowDescriptionFilterDropdown(false);
                        setShowTemplateFilterDropdown(false);
                        setShowDateCreatedFilterDropdown(false);
                        setShowCreatedByFilterDropdown(false);
                      } else if (head === "BC #") {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setBCDropdownPosition({
                          top: rect.bottom + window.scrollY - 8,
                          left: rect.left + window.scrollX,
                        });
                        setShowBCFilterDropdown(true);
                        setShowSelFilterDropdown(false);
                        setShowItemFilterDropdown(false);
                        setShowDescriptionFilterDropdown(false);
                        setShowTemplateFilterDropdown(false);
                        setShowDateCreatedFilterDropdown(false);
                        setShowCreatedByFilterDropdown(false);
                      } else if (head === "Item") {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setItemDropdownPosition({
                          top: rect.bottom + window.scrollY - 8,
                          left: rect.left + window.scrollX,
                        });
                        setShowItemFilterDropdown(true);
                        setShowSelFilterDropdown(false);
                        setShowBCFilterDropdown(false);
                        setShowDescriptionFilterDropdown(false);
                        setShowTemplateFilterDropdown(false);
                        setShowDateCreatedFilterDropdown(false);
                        setShowCreatedByFilterDropdown(false);
                      } else if (head === "Description") {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setDescriptionDropdownPosition({
                          top: rect.bottom + window.scrollY - 8,
                          left: rect.left + window.scrollX,
                        });
                        setShowDescriptionFilterDropdown(true);
                        setShowSelFilterDropdown(false);
                        setShowBCFilterDropdown(false);
                        setShowItemFilterDropdown(false);
                        setShowTemplateFilterDropdown(false);
                        setShowDateCreatedFilterDropdown(false);
                        setShowCreatedByFilterDropdown(false);
                      } else if (head === "Template") {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setTemplateDropdownPosition({ top: rect.bottom + window.scrollY - 8, left: rect.left + window.scrollX });
                        setShowTemplateFilterDropdown(true);
                        setShowSelFilterDropdown(false);
                        setShowBCFilterDropdown(false);
                        setShowItemFilterDropdown(false);
                        setShowDescriptionFilterDropdown(false);
                        setShowDateCreatedFilterDropdown(false);
                        setShowCreatedByFilterDropdown(false);
                      } else if (head === "Date Created") {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setDateCreatedDropdownPosition({ top: rect.bottom + window.scrollY - 8, left: rect.left + window.scrollX });
                        setShowDateCreatedFilterDropdown(true);
                        setShowSelFilterDropdown(false);
                        setShowBCFilterDropdown(false);
                        setShowItemFilterDropdown(false);
                        setShowDescriptionFilterDropdown(false);
                        setShowTemplateFilterDropdown(false);
                        setShowCreatedByFilterDropdown(false);
                      } else if (head === "Created By") {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setCreatedByDropdownPosition({ top: rect.bottom + window.scrollY - 8, left: rect.left + window.scrollX });
                        setShowCreatedByFilterDropdown(true);
                        setShowSelFilterDropdown(false);
                        setShowBCFilterDropdown(false);
                        setShowItemFilterDropdown(false);
                        setShowDescriptionFilterDropdown(false);
                        setShowTemplateFilterDropdown(false);
                        setShowDateCreatedFilterDropdown(false);
                      }
                    }}
                  >
                    {head}
                    {(head === "Sel" || head === "BC #" || head === "Item" || head === "Description" || head === "Template" || head === "Date Created" || head === "Created By") && (
                      <div className="flex flex-col">
                        <FaSortUp className="text-xs -mb-1" />
                        <FaSortDown className="text-xs -mt-1" />
                      </div>
                    )}
                  </div>

                  {head === "Sel" && showSelFilterDropdown && selDropdownPosition && (
                    <div
                      className="fixed z-[9999] mt-2 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 shadow rounded p-2 w-[250px] border-2"
                      style={{
                        top: selDropdownPosition.top,
                        left: selDropdownPosition.left,
                        minWidth: 250,
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={allSelTitlesSelected}
                            onChange={handleSelSelectAll}
                            className="mr-2 h-4 w-4 shadow-sm"
                          />
                          <span className="font-normal">Select All</span>
                        </div>
                        
                        <button
                          onClick={handleCloseSelDropdown}
                          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          <FiX className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-4 max-h-40 overflow-y-auto">
                        {uniqueTitles.map((title) => (
                          <div key={title} className="flex items-center mb-1">
                            <input
                              type="checkbox"
                              checked={selectedTitles.includes(title)}
                              onChange={() => handleSelTitleCheckbox(title)}
                              className="mr-2 h-4 w-4 shadow-sm"
                            />
                            <span>{title}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2 mt-4">
                        <button
                          className="flex-1 bg-gray-300 text-black py-1 rounded font-normal"
                          onClick={handleSelFilter}
                        >
                          Filter
                        </button>
                        <button
                          className="flex-1 bg-gray-300 text-black py-1 rounded font-normal"
                          onClick={handleClearSelFilter}
                        >
                          Clear Filter
                        </button>
                      </div>

                 
                    </div>
                  )}

                  {head === "BC #" && showBCFilterDropdown && bcDropdownPosition && (
                    <div
                      className="fixed z-[9999] mt-2 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 shadow rounded p-2 w-[250px] border-2"
                      style={{
                        top: bcDropdownPosition.top,
                        left: bcDropdownPosition.left,
                        minWidth: 250,
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={allBCsSelected}
                            onChange={handleBCSelectAll}
                            className="mr-2 h-4 w-4 shadow-sm"
                          />
                          <span className="font-normal">Select All</span>
                        </div>
                        <button
                          onClick={handleCloseBCDropdown}
                          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          <FiX className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-4 max-h-40 overflow-y-auto">
                        {uniqueBCs.map((bc) => (
                          <div key={bc} className="flex items-center mb-1">
                            <input
                              type="checkbox"
                              checked={selectedBCs.includes(bc)}
                              onChange={() => handleBCCheckbox(bc)}
                              className="mr-2 h-4 w-4 shadow-sm"
                            />
                            <span>{bc}</span>
                          </div>
                        ))}
                      </div>
                      <div className="text-gray-700 dark:text-gray-300 text-xs mb-2">
                        Show rows with value that
                      </div>
                      <div className="mb-2">
                        <select
                          className="w-full p-1 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                          value={bcCondition1}
                          onChange={(e) => setBCCondition1(e.target.value)}
                        >
                          <option>Is equal to</option>
                          <option>Does not equal</option>
                          <option>Contains</option>
                          <option>Does not contain</option>
                          <option>Starts with</option>
                          <option>Ends with</option>
                        </select>
                      </div>
                      <div className="flex items-center mb-2">
                        <input
                          type="text"
                          value={bcSearchQuery1}
                          onChange={(e) => setBCSearchQuery1(e.target.value)}
                          className="flex-1 p-1 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                        />
                        <button className="ml-2 px-2 py-1 bg-gray-300 text-black rounded font-normal">aA</button>
                      </div>

                      <div className="mb-2">
                        <select
                          className="w-full p-1 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                          value={bcCombiner}
                          onChange={(e) => setBCCombiner(e.target.value)}
                        >
                          <option>And</option>
                          <option>Or</option>
                        </select>
                      </div>

                      <div className="mb-2">
                        <select
                          className="w-full p-1 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                          value={bcCondition2}
                          onChange={(e) => setBCCondition2(e.target.value)}
                        >
                          <option>Is equal to</option>
                          <option>Does not equal</option>
                          <option>Contains</option>
                          <option>Does not contain</option>
                          <option>Starts with</option>
                          <option>Ends with</option>
                        </select>
                      </div>
                      <div className="flex items-center mb-2">
                        <input
                          type="text"
                          value={bcSearchQuery2}
                          onChange={(e) => setBCSearchQuery2(e.target.value)}
                          className="flex-1 p-1 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                        />
                        <button className="ml-2 px-2 py-1 bg-gray-300 text-black rounded font-normal">aA</button>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <button
                          className="flex-1 bg-gray-300 text-black py-1 rounded font-normal"
                          onClick={handleBCFilter}
                        >
                          Filter
                        </button>
                        <button
                          className="flex-1 bg-gray-300 text-black py-1 rounded font-normal"
                          onClick={handleClearBCFilter}
                        >
                          Clear Filter
                        </button>
                      </div>

                     
                    </div>
                  )}

                  {head === "Item" && showItemFilterDropdown && itemDropdownPosition && (
                    <div
                      className="fixed z-[9999] mt-2 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 shadow rounded p-2 w-[250px] border-2"
                      style={{
                        top: itemDropdownPosition.top,
                        left: itemDropdownPosition.left,
                        minWidth: 250,
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={allItemsSelected}
                            onChange={handleItemSelectAll}
                            className="mr-2 h-4 w-4 shadow-sm"
                          />
                          <span className="font-normal">Select All</span>
                        </div>
                        <button
                          onClick={handleCloseItemDropdown}
                          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          <FiX className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-4 max-h-40 overflow-y-auto">
                        {uniqueItems.map((item) => (
                          <div key={item} className="flex items-center mb-1">
                            <input
                              type="checkbox"
                              checked={selectedItems.includes(item)}
                              onChange={() => handleItemCheckbox(item)}
                              className="mr-2 h-4 w-4 shadow-sm"
                            />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                      <div className="text-gray-700 dark:text-gray-300 text-xs mb-2">
                        Show rows with value that
                      </div>
                      <div className="mb-2">
                        <select
                          className="w-full p-1 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                          value={itemCondition1}
                          onChange={(e) => setItemCondition1(e.target.value)}
                        >
                          <option>Is equal to</option>
                          <option>Does not equal</option>
                          <option>Contains</option>
                          <option>Does not contain</option>
                          <option>Starts with</option>
                          <option>Ends with</option>
                        </select>
                      </div>
                      <div className="flex items-center mb-2">
                        <input
                          type="text"
                          value={itemSearchQuery1}
                          onChange={(e) => setItemSearchQuery1(e.target.value)}
                          className="flex-1 p-1 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                        />
                        <button className="ml-2 px-2 py-1 bg-gray-300 text-black rounded font-normal">aA</button>
                      </div>

                      <div className="mb-2">
                        <select
                          className="w-full p-1 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                          value={itemCombiner}
                          onChange={(e) => setItemCombiner(e.target.value)}
                        >
                          <option>And</option>
                          <option>Or</option>
                        </select>
                      </div>

                      <div className="mb-2">
                        <select
                          className="w-full p-1 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                          value={itemCondition2}
                          onChange={(e) => setItemCondition2(e.target.value)}
                        >
                          <option>Is equal to</option>
                          <option>Does not equal</option>
                          <option>Contains</option>
                          <option>Does not contain</option>
                          <option>Starts with</option>
                          <option>Ends with</option>
                        </select>
                      </div>
                      <div className="flex items-center mb-2">
                        <input
                          type="text"
                          value={itemSearchQuery2}
                          onChange={(e) => setItemSearchQuery2(e.target.value)}
                          className="flex-1 p-1 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                        />
                        <button className="ml-2 px-2 py-1 bg-gray-300 text-black rounded font-normal">aA</button>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <button
                          className="flex-1 bg-gray-300 text-black py-1 rounded font-normal"
                          onClick={handleItemFilter}
                        >
                          Filter
                        </button>
                        <button
                          className="flex-1 bg-gray-300 text-black py-1 rounded font-normal"
                          onClick={handleClearItemFilter}
                        >
                          Clear Filter
                        </button>
                      </div>

      
                    </div>
                  )}

                  {head === "Description" && showDescriptionFilterDropdown && descriptionDropdownPosition && (
                    <div
                      className="fixed z-[9999] mt-2 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 shadow rounded p-2 w-[250px] border-2"
                      style={{
                        top: descriptionDropdownPosition.top,
                        left: descriptionDropdownPosition.left,
                        minWidth: 250,
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={allDescriptionsSelected}
                            onChange={handleDescriptionSelectAll}
                            className="mr-2 h-4 w-4 shadow-sm"
                          />
                          <span className="font-normal">Select All</span>
                        </div>
                        <button
                          onClick={handleCloseDescriptionDropdown}
                          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          <FiX className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-4 max-h-40 overflow-y-auto">
                        {uniqueDescriptions.map((description) => (
                          <div key={description} className="flex items-center mb-1">
                            <input
                              type="checkbox"
                              checked={selectedDescriptions.includes(description)}
                              onChange={() => handleDescriptionCheckbox(description)}
                              className="mr-2 h-4 w-4 shadow-sm"
                            />
                            <span>{description}</span>
                          </div>
                        ))}
                      </div>
                      <div className="text-gray-700 dark:text-gray-300 text-xs mb-2">
                        Show rows with value that
                      </div>
                      <div className="mb-2">
                        <select
                          className="w-full p-1 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                          value={descriptionCondition1}
                          onChange={(e) => setDescriptionCondition1(e.target.value)}
                        >
                          <option>Is equal to</option>
                          <option>Does not equal</option>
                          <option>Contains</option>
                          <option>Does not contain</option>
                          <option>Starts with</option>
                          <option>Ends with</option>
                        </select>
                      </div>
                      <div className="flex items-center mb-2">
                        <input
                          type="text"
                          value={descriptionSearchQuery1}
                          onChange={(e) => setDescriptionSearchQuery1(e.target.value)}
                          className="flex-1 p-1 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                        />
                        <button className="ml-2 px-2 py-1 bg-gray-300 text-black rounded font-normal">aA</button>
                      </div>

                      <div className="mb-2">
                        <select
                          className="w-full p-1 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                          value={descriptionCombiner}
                          onChange={(e) => setDescriptionCombiner(e.target.value)}
                        >
                          <option>And</option>
                          <option>Or</option>
                        </select>
                      </div>

                      <div className="mb-2">
                        <select
                          className="w-full p-1 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                          value={descriptionCondition2}
                          onChange={(e) => setDescriptionCondition2(e.target.value)}
                        >
                          <option>Is equal to</option>
                          <option>Does not equal</option>
                          <option>Contains</option>
                          <option>Does not contain</option>
                          <option>Starts with</option>
                          <option>Ends with</option>
                        </select>
                      </div>
                      <div className="flex items-center mb-2">
                        <input
                          type="text"
                          value={descriptionSearchQuery2}
                          onChange={(e) => setDescriptionSearchQuery2(e.target.value)}
                          className="flex-1 p-1 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                        />
                        <button className="ml-2 px-2 py-1 bg-gray-300 text-black rounded font-normal">aA</button>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <button
                          className="flex-1 bg-gray-300 text-black py-1 rounded font-normal"
                          onClick={handleDescriptionFilter}
                        >
                          Filter
                        </button>
                        <button
                          className="flex-1 bg-gray-300 text-black py-1 rounded font-normal"
                          onClick={handleClearDescriptionFilter}
                        >
                          Clear Filter
                        </button>
                      </div>

                    </div>
                  )}

                  {head === "Template" && showTemplateFilterDropdown && templateDropdownPosition && (
                    <div
                      className="fixed z-[9999] mt-2 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 shadow rounded p-2 w-[250px] border-2"
                      style={{
                        top: templateDropdownPosition.top,
                        left: templateDropdownPosition.left,
                        minWidth: 250,
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={allTemplatesSelected}
                            onChange={handleTemplateSelectAll}
                            className="mr-2 h-4 w-4 shadow-sm"
                          />
                          <span className="font-normal">Select All</span>
                        </div>
                        <button
                          onClick={handleCloseTemplateDropdown}
                          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          <FiX className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-4 max-h-40 overflow-y-auto">
                        {uniqueTemplates.map((template) => (
                          <div key={template} className="flex items-center mb-1">
                            <input
                              type="checkbox"
                              checked={selectedTemplates.includes(template)}
                              onChange={() => handleTemplateCheckbox(template)}
                              className="mr-2 h-4 w-4 shadow-sm"
                            />
                            <span>{template}</span>
                          </div>
                        ))}
                      </div>
                      <div className="text-gray-700 dark:text-gray-300 text-xs mb-2">
                        Show rows with value that
                      </div>
                      <div className="mb-2">
                        <select
                          className="w-full p-1 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                          value={templateCondition1}
                          onChange={(e) => setTemplateCondition1(e.target.value)}
                        >
                          <option>Is equal to</option>
                          <option>Does not equal</option>
                          <option>Contains</option>
                          <option>Does not contain</option>
                          <option>Starts with</option>
                          <option>Ends with</option>
                        </select>
                      </div>
                      <div className="flex items-center mb-2">
                        <input
                          type="text"
                          value={templateSearchQuery1}
                          onChange={(e) => setTemplateSearchQuery1(e.target.value)}
                          className="flex-1 p-1 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                        />
                        <button className="ml-2 px-2 py-1 bg-gray-300 text-black rounded font-normal">aA</button>
                      </div>

                      <div className="mb-2">
                        <select
                          className="w-full p-1 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                          value={templateCombiner}
                          onChange={(e) => setTemplateCombiner(e.target.value)}
                        >
                          <option>And</option>
                          <option>Or</option>
                        </select>
                      </div>

                      <div className="mb-2">
                        <select
                          className="w-full p-1 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                          value={templateCondition2}
                          onChange={(e) => setTemplateCondition2(e.target.value)}
                        >
                          <option>Is equal to</option>
                          <option>Does not equal</option>
                          <option>Contains</option>
                          <option>Does not contain</option>
                          <option>Starts with</option>
                          <option>Ends with</option>
                        </select>
                      </div>
                      <div className="flex items-center mb-2">
                        <input
                          type="text"
                          value={templateSearchQuery2}
                          onChange={(e) => setTemplateSearchQuery2(e.target.value)}
                          className="flex-1 p-1 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                        />
                        <button className="ml-2 px-2 py-1 bg-gray-300 text-black rounded font-normal">aA</button>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <button
                          className="flex-1 bg-gray-300 text-black py-1 rounded font-normal"
                          onClick={handleTemplateFilter}
                        >
                          Filter
                        </button>
                        <button
                          className="flex-1 bg-gray-300 text-black py-1 rounded font-normal"
                          onClick={handleClearTemplateFilter}
                        >
                          Clear Filter
                        </button>
                      </div>

                   
                    </div>
                  )}

                  {head === "Date Created" && showDateCreatedFilterDropdown && dateCreatedDropdownPosition && (
                    <div
                      className="fixed z-[9999] mt-2 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 shadow rounded p-2 w-[250px] border-2"
                      style={{
                        top: dateCreatedDropdownPosition.top,
                        left: dateCreatedDropdownPosition.left,
                        minWidth: 250,
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={allDateCreatedSelected}
                            onChange={handleDateCreatedSelectAll}
                            className="mr-2 h-4 w-4 shadow-sm"
                          />
                          <span className="font-normal">Select All</span>
                        </div>
                        <button
                          onClick={handleCloseDateCreatedDropdown}
                          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          <FiX className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-4 max-h-40 overflow-y-auto">
                        {uniqueDateCreated.map((date) => (
                          <div key={date} className="flex items-center mb-1">
                            <input
                              type="checkbox"
                              checked={selectedDateCreated.includes(date)}
                              onChange={() => handleDateCreatedCheckbox(date)}
                              className="mr-2 h-4 w-4 shadow-sm"
                            />
                            <span>{date}</span>
                          </div>
                        ))}
                      </div>
                      <div className="text-gray-700 dark:text-gray-300 text-xs mb-2">
                        Show rows with value that
                      </div>
                      <div className="mb-2">
                        <select
                          className="w-full p-1 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                          value={dateCreatedCondition1}
                          onChange={(e) => setDateCreatedCondition1(e.target.value)}
                        >
                          <option>Is equal to</option>
                          <option>Does not equal</option>
                          <option>Contains</option>
                          <option>Does not contain</option>
                          <option>Starts with</option>
                          <option>Ends with</option>
                        </select>
                      </div>
                      <div className="flex items-center mb-2">
                        <input
                          type="text"
                          value={dateCreatedSearchQuery1}
                          onChange={(e) => setDateCreatedSearchQuery1(e.target.value)}
                          className="flex-1 p-1 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                        />
                        <button className="ml-2 px-2 py-1 bg-gray-300 text-black rounded font-normal">aA</button>
                      </div>

                      <div className="mb-2">
                        <select
                          className="w-full p-1 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                          value={dateCreatedCombiner}
                          onChange={(e) => setDateCreatedCombiner(e.target.value)}
                        >
                          <option>And</option>
                          <option>Or</option>
                        </select>
                      </div>

                      <div className="mb-2">
                        <select
                          className="w-full p-1 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                          value={dateCreatedCondition2}
                          onChange={(e) => setDateCreatedCondition2(e.target.value)}
                        >
                          <option>Is equal to</option>
                          <option>Does not equal</option>
                          <option>Contains</option>
                          <option>Does not contain</option>
                          <option>Starts with</option>
                          <option>Ends with</option>
                        </select>
                      </div>
                      <div className="flex items-center mb-2">
                        <input
                          type="text"
                          value={dateCreatedSearchQuery2}
                          onChange={(e) => setDateCreatedSearchQuery2(e.target.value)}
                          className="flex-1 p-1 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                        />
                        <button className="ml-2 px-2 py-1 bg-gray-300 text-black rounded font-normal">aA</button>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <button
                          className="flex-1 bg-gray-300 text-black py-1 rounded font-normal"
                          onClick={handleDateCreatedFilter}
                        >
                          Filter
                        </button>
                        <button
                          className="flex-1 bg-gray-300 text-black py-1 rounded font-normal"
                          onClick={handleClearDateCreatedFilter}
                        >
                          Clear Filter
                        </button>
                      </div>

                   
                    </div>
                  )}

                  {head === "Created By" && showCreatedByFilterDropdown && createdByDropdownPosition && (
                    <div
                      className="fixed z-[9999] mt-2 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 shadow rounded p-2 w-[250px] border-2"
                      style={{
                        top: createdByDropdownPosition.top,
                        left: createdByDropdownPosition.left,
                        minWidth: 250,
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={allCreatedBySelected}
                            onChange={handleCreatedBySelectAll}
                            className="mr-2 h-4 w-4 shadow-sm"
                          />
                          <span className="font-normal">Select All</span>
                        </div>
                        <button
                          onClick={handleCloseCreatedByDropdown}
                          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          <FiX className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-4 max-h-40 overflow-y-auto">
                        {uniqueCreatedBy.map((name) => (
                          <div key={name} className="flex items-center mb-1">
                            <input
                              type="checkbox"
                              checked={selectedCreatedBy.includes(name)}
                              onChange={() => handleCreatedByCheckbox(name)}
                              className="mr-2 h-4 w-4 shadow-sm"
                            />
                            <span>{name}</span>
                          </div>
                        ))}
                      </div>
                      <div className="text-gray-700 dark:text-gray-300 text-xs mb-2">
                        Show rows with value that
                      </div>
                      <div className="mb-2">
                        <select
                          className="w-full p-1 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                          value={createdByCondition1}
                          onChange={(e) => setCreatedByCondition1(e.target.value)}
                        >
                          <option>Is equal to</option>
                          <option>Does not equal</option>
                          <option>Contains</option>
                          <option>Does not contain</option>
                          <option>Starts with</option>
                          <option>Ends with</option>
                        </select>
                      </div>
                      <div className="flex items-center mb-2">
                        <input
                          type="text"
                          value={createdBySearchQuery1}
                          onChange={(e) => setCreatedBySearchQuery1(e.target.value)}
                          className="flex-1 p-1 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                        />
                        <button className="ml-2 px-2 py-1 bg-gray-300 text-black rounded font-normal">aA</button>
                      </div>

                      <div className="mb-2">
                        <select
                          className="w-full p-1 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                          value={createdByCombiner}
                          onChange={(e) => setCreatedByCombiner(e.target.value)}
                        >
                          <option>And</option>
                          <option>Or</option>
                        </select>
                      </div>

                      <div className="mb-2">
                        <select
                          className="w-full p-1 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                          value={createdByCondition2}
                          onChange={(e) => setCreatedByCondition2(e.target.value)}
                        >
                          <option>Is equal to</option>
                          <option>Does not equal</option>
                          <option>Contains</option>
                          <option>Does not contain</option>
                          <option>Starts with</option>
                          <option>Ends with</option>
                        </select>
                      </div>
                      <div className="flex items-center mb-2">
                        <input
                          type="text"
                          value={createdBySearchQuery2}
                          onChange={(e) => setCreatedBySearchQuery2(e.target.value)}
                          className="flex-1 p-1 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                        />
                        <button className="ml-2 px-2 py-1 bg-gray-300 text-black rounded font-normal">aA</button>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <button
                          className="flex-1 bg-gray-300 text-black py-1 rounded font-normal"
                          onClick={handleCreatedByFilter}
                        >
                          Filter
                        </button>
                        <button
                          className="flex-1 bg-gray-300 text-black py-1 rounded font-normal"
                          onClick={handleClearCreatedByFilter}
                        >
                          Clear Filter
                        </button>
                      </div>

                     
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentItems.map((tag, index) => (
              <tr key={index}>
                <td className="px-2 py-2 border-r">
                  <input
                    type="checkbox"
                    checked={selectedTableRows.includes(tag.title)}
                    onChange={() => handleTableRowCheckboxChange(tag.title)}
                    className="h-4 w-4 shadow-sm"
                  />
                </td>
                <td className="px-2 py-2 border-r">{tag.title}</td>
                <td className="px-2 py-2 border-r">{tag.createdBy}</td>
                <td className="px-2 py-2 border-r">{tag.dateCreated}</td>
                <td className="px-2 py-2 border-r">{tag.dateModified}</td>
                <td className="px-2 py-2 border-r">{tag.modifiedBy}</td>
                <td className="px-2 py-2 border-r">{tag.modifiedBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-end items-center px-4 py-2 bg-gray-100 border-t">
          <button
            className="text-gray-500 hover:text-gray-700 mx-1 cursor-pointer"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            {'<<'}
          </button>
          <button
            className="text-gray-500 hover:text-gray-700 mx-1 cursor-pointer"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            {'<'}
          </button>
          <span className="text-sm">Page</span>
          <input
            type="text"
            value={currentPage}
            onChange={(e) => {
              const page = Number(e.target.value);
              if (page > 0 && page <= totalPages) {
                setCurrentPage(page);
              }
            }}
            className="mx-2 w-8 text-center border rounded text-sm"
          />
          <span className="text-sm">of {totalPages}</span>
          <button
            className="text-gray-500 hover:text-gray-700 mx-1 cursor-pointer"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            {'>'}
          </button>
          <button
            className="text-gray-500 hover:text-gray-700 mx-1 cursor-pointer"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            {'>>'}
          </button>
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
            onClick={handleOpenPrintSettings}
          >
            <FiSettings /> Settings
          </button>
        </div>
      </div>

      {/* Print Settings Popup */}
      <PrintSettingsPopup 
        isOpen={showPrintSettingsPopup} 
        onClose={handleClosePrintSettings} 
        onSave={handleSavePrintSettings}
      />
    </div>
  );
}

export default StoreTags;
