import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaSortUp, FaSortDown } from "react-icons/fa";

const Calculate = ({ isOpen, onClose, onSave }) => {
  if (!isOpen) return null;

  const [filterDropdownPosition, setFilterDropdownPosition] = useState({ top: 0, left: 0 });
  const [showFieldFilterDropdown, setShowFieldFilterDropdown] = useState(false);
  const [showActionFilterDropdown, setShowActionFilterDropdown] = useState(false);
  const [showByValueFilterDropdown, setShowByValueFilterDropdown] = useState(false);
  const [actionDropdownOpenForIndex, setActionDropdownOpenForIndex] = useState(null);
  const [actionDropdownPosition, setActionDropdownPosition] = useState({ top: 0, left: 0 });
  const [editingValueIndex, setEditingValueIndex] = useState(null);

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: null
  });

  const initialTableData = [
    { field: 'Price 1', action: 'No Change', value: '' },
    { field: 'Price 2', action: 'No Change', value: '' },
    { field: 'Price 3', action: 'No Change', value: '' },
    { field: 'Pay 12M', action: 'No Change', value: '' },
    { field: 'Pay 18M', action: 'No Change', value: '' },
    { field: 'Pay 24M', action: 'No Change', value: '' },
    { field: 'Pay 36M', action: 'No Change', value: '' },
    { field: 'Pay 48M', action: 'No Change', value: '' },
    { field: 'Pay 60M', action: 'No Change', value: '' },
  ];

  const [filteredData, setFilteredData] = useState(initialTableData);

  const [filterStates, setFilterStates] = useState({
    Field: {
      selectedItems: [],
      searchQuery1: '',
      searchQuery2: '',
      condition1: 'Is equal to',
      condition2: 'Is equal to',
      combiner: 'And',
    },
    Action: {
      selectedItems: [], 
      searchQuery1: '',
      searchQuery2: '',
      condition1: 'Is equal to',
      condition2: 'Is equal to',
      combiner: 'And',
    },
    ByValue: {
      selectedItems: [], 
      searchQuery1: '',
      searchQuery2: '',
      condition1: 'Is equal to',
      condition2: 'Is equal to',
      combiner: 'And',
    },
  });

  const fieldRef = useRef(null);
  const actionRef = useRef(null);
  const byValueRef = useRef(null);
  const dropdownRef = useRef(null);
  const actionSelectDropdownRef = useRef(null);

  const filterableItems = ['Pay 12M', 'Pay 18M', 'Pay 24M', 'Pay 36M', 'Pay 48M', 'Pay 60M', 'Price 1', 'Price 2', 'Price 3'];

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedData = [...filteredData].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    setFilteredData(sortedData);
  };

  const updateDropdownPosition = (ref) => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setFilterDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
  };

  const handleHeaderClick = (columnName, ref) => {
    setShowFieldFilterDropdown(false);
    setShowActionFilterDropdown(false);
    setShowByValueFilterDropdown(false);

    updateDropdownPosition(ref);

    switch (columnName) {
      case 'Field':
        setShowFieldFilterDropdown((prev) => !prev);
        break;
      case 'Action':
        setShowActionFilterDropdown((prev) => !prev);
        break;
      case 'ByValue':
        setShowByValueFilterDropdown((prev) => !prev);
        break;
      default:
        break;
    }
  };

  const updateFilterState = (columnName, key, value) => {
    setFilterStates((prevStates) => ({
      ...prevStates,
      [columnName]: {
        ...prevStates[columnName],
        [key]: value,
      },
    }));
  };

  const handleItemSelect = (columnName, item) => {
    const prevSelected = filterStates[columnName].selectedItems;
    const newSelected = prevSelected.includes(item)
      ? prevSelected.filter((i) => i !== item)
      : [...prevSelected, item];
    updateFilterState(columnName, 'selectedItems', newSelected);
  };

  const handleSelectAll = (columnName, itemsToDisplay) => {
    if (filterStates[columnName].selectedItems.length === itemsToDisplay.length) {
      updateFilterState(columnName, 'selectedItems', []);
    } else {
      updateFilterState(columnName, 'selectedItems', itemsToDisplay);
    }
  };

  const applyCondition = (value, query, condition) => {
    const lowerCaseValue = String(value).toLowerCase();
    const lowerCaseQuery = String(query).toLowerCase();

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
  };

  const applyAllFilters = () => {
    let currentFilteredList = [...initialTableData];

    // Apply 'Field' filters
    const fieldFilterState = filterStates.Field;
    const fieldItemsToDisplay = filterableItems;

    if (fieldFilterState.selectedItems.length > 0 && fieldFilterState.selectedItems.length < fieldItemsToDisplay.length) {
      currentFilteredList = currentFilteredList.filter(item =>
        fieldFilterState.selectedItems.includes(item.field)
      );
    }
    if (fieldFilterState.searchQuery1 || fieldFilterState.searchQuery2) {
      currentFilteredList = currentFilteredList.filter(item => {
        const value = String(item.field || "");
        let match1 = true;
        let match2 = true;
        if (fieldFilterState.searchQuery1) {
          match1 = applyCondition(value, fieldFilterState.searchQuery1, fieldFilterState.condition1);
        }
        if (fieldFilterState.searchQuery2) {
          match2 = applyCondition(value, fieldFilterState.searchQuery2, fieldFilterState.condition2);
        }
        return fieldFilterState.combiner === "And" ? match1 && match2 : match1 || match2;
      });
    }

    // Apply 'Action' filters
    const actionFilterState = filterStates.Action;
    const actionItemsToDisplay = ['No Change', 'Add', 'Subtract', 'Multiply By', 'Divide By'];

    if (actionFilterState.selectedItems.length > 0 && actionFilterState.selectedItems.length < actionItemsToDisplay.length) {
      currentFilteredList = currentFilteredList.filter(item =>
        actionFilterState.selectedItems.includes(item.action)
      );
    }
    if (actionFilterState.searchQuery1 || actionFilterState.searchQuery2) {
      currentFilteredList = currentFilteredList.filter(item => {
        const value = String(item.action || "");
        let match1 = true;
        let match2 = true;
        if (actionFilterState.searchQuery1) {
          match1 = applyCondition(value, actionFilterState.searchQuery1, actionFilterState.condition1);
        }
        if (actionFilterState.searchQuery2) {
          match2 = applyCondition(value, actionFilterState.searchQuery2, actionFilterState.condition2);
        }
        return actionFilterState.combiner === "And" ? match1 && match2 : match1 || match2;
      });
    }

    // Apply 'ByValue' filters
    const byValueFilterState = filterStates.ByValue;
    const byValueItemsToDisplay = ['[empty]'];

    if (byValueFilterState.selectedItems.length > 0 && byValueFilterState.selectedItems.length < byValueItemsToDisplay.length) {
      currentFilteredList = currentFilteredList.filter(item => {
        if (byValueFilterState.selectedItems.includes('[empty]')) {
          return item.value === '' || item.value === null;
        }
        return true;
      });
    }
    if (byValueFilterState.searchQuery1 || byValueFilterState.searchQuery2) {
      currentFilteredList = currentFilteredList.filter(item => {
        const value = String(item.value || "");
        let match1 = true;
        let match2 = true;
        if (byValueFilterState.searchQuery1) {
          match1 = applyCondition(value, byValueFilterState.searchQuery1, byValueFilterState.condition1);
        }
        if (byValueFilterState.searchQuery2) {
          match2 = applyCondition(value, byValueFilterState.searchQuery2, byValueFilterState.condition2);
        }
        return byValueFilterState.combiner === "And" ? match1 && match2 : match1 || match2;
      });
    }

    setFilteredData(currentFilteredList);
  };

  const handleFilterClick = (columnName) => {
    applyAllFilters();
    setShowFieldFilterDropdown(false);
    setShowActionFilterDropdown(false);
    setShowByValueFilterDropdown(false);
  };

  const handleClearFilterClick = (columnName) => {
    setFilterStates((prev) => ({
      ...prev,
      [columnName]: {
        selectedItems: [],
        searchQuery1: '',
        searchQuery2: '',
        condition1: 'Is equal to',
        condition2: 'Is equal to',
        combiner: 'And',
      },
    }));
    setTimeout(() => {
      applyAllFilters();
    }, 0);
    setShowFieldFilterDropdown(false);
    setShowActionFilterDropdown(false);
    setShowByValueFilterDropdown(false);
  };

  const handleActionCellClick = (index, event) => {
    setShowFieldFilterDropdown(false);
    setShowActionFilterDropdown(false);
    setShowByValueFilterDropdown(false);
    setActionDropdownOpenForIndex(index);

    const rect = event.currentTarget.getBoundingClientRect();
    setActionDropdownPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          fieldRef.current && !fieldRef.current.contains(event.target) &&
          actionRef.current && !actionRef.current.contains(event.target) &&
          byValueRef.current && !byValueRef.current.contains(event.target) &&
          actionSelectDropdownRef.current && !actionSelectDropdownRef.current.contains(event.target)
         ) {
        setShowFieldFilterDropdown(false);
        setShowActionFilterDropdown(false);
        setShowByValueFilterDropdown(false);
        setActionDropdownOpenForIndex(null);
        setEditingValueIndex(null);
      }
    };

    if (showFieldFilterDropdown || showActionFilterDropdown || showByValueFilterDropdown || actionDropdownOpenForIndex !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFieldFilterDropdown, showActionFilterDropdown, showByValueFilterDropdown, actionDropdownOpenForIndex]);

  const renderFilterDropdown = (columnName) => {
    const currentFilterState = filterStates[columnName];
    const itemsToDisplay = columnName === 'Field' ? filterableItems : (
      columnName === 'Action' ? ['No Change', 'Add', 'Subtract', 'Multiply By', 'Divide By'] : (
        Array.from(new Set(filteredData.map(item => item.value === '' || item.value === null ? '[empty]' : item.value)))
      )
    );

    return (
      <div
        ref={dropdownRef}
        className="absolute z-[9999] bg-gray-100 border-gray-300 shadow rounded p-2 w-[250px] border-2"
        style={{
          top: `${filterDropdownPosition.top}px`,
          left: `${filterDropdownPosition.left}px`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={currentFilterState.selectedItems.length === itemsToDisplay.length && itemsToDisplay.length > 0}
              onChange={() => handleSelectAll(columnName, itemsToDisplay)}
              className="mr-2 h-4 w-4 shadow-sm"
            />
            <span className="">Select All</span>
          </div>
          <button
            onClick={() => {
              setShowFieldFilterDropdown(false);
              setShowActionFilterDropdown(false);
              setShowByValueFilterDropdown(false);
            }}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>
        </div>

        <div className="max-h-32 overflow-y-auto mb-2 border p-2">
          {itemsToDisplay.map((item) => (
            <div key={item} className="flex items-center mb-1">
              <input
                type="checkbox"
                checked={currentFilterState.selectedItems.includes(item)}
                onChange={() => handleItemSelect(columnName, item)}
                className="mr-2 h-4 w-4"
              />
              <span className="font-normal text-gray-800">{item}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-2 border-t border-gray-300">
          <h3 className="font-normal mb-2 text-gray-700">Show rows with value that</h3>
          <div className="flex flex-col gap-2">
            <div className="items-center gap-2 ">
              <select
                className="border rounded p-1 w-full text-sm bg-gradient-to-b from-gray-200 to-gray-400 focus:outline-none"
                value={currentFilterState.condition1}
                onChange={(e) => updateFilterState(columnName, 'condition1', e.target.value)}
              >
                <option>Is equal to</option>
                <option>Does not equal</option>
                <option>Contains</option>
                <option>Does not contain</option>
                <option>Starts with</option>
                <option>Ends with</option>
              </select>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  className="border border-blue-400 focus:outline-none rounded p-1 flex-1 text-sm bg-white text-gray-800"
                  value={currentFilterState.searchQuery1}
                  onChange={(e) => updateFilterState(columnName, 'searchQuery1', e.target.value)}
                />
                <button
                  onClick={() => handleFilterClick(columnName)}
                  className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded"
                >
                  aA
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <select
                className="border rounded p-1 text-sm bg-gradient-to-b from-gray-200 to-gray-400 focus:outline-none w-full"
                value={currentFilterState.combiner}
                onChange={(e) => updateFilterState(columnName, 'combiner', e.target.value)}
              >
                <option>And</option>
                <option>Or</option>
              </select>
            </div>

            <div className="items-center gap-2 mt-2">
              <select
                className="border rounded p-1 text-sm bg-gradient-to-b from-gray-200 to-gray-400 focus:outline-none w-full"
                value={currentFilterState.condition2}
                onChange={(e) => updateFilterState(columnName, 'condition2', e.target.value)}
              >
                <option>Is equal to</option>
                <option>Does not equal</option>
                <option>Contains</option>
                <option>Does not contain</option>
                <option>Starts with</option>
                <option>Ends with</option>
              </select>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  className="border border-blue-400 focus:outline-none rounded p-1 flex-1 text-sm bg-white text-gray-800"
                  value={currentFilterState.searchQuery2}
                  onChange={(e) => updateFilterState(columnName, 'searchQuery2', e.target.value)}
                />
                <button
                  onClick={() => handleFilterClick(columnName)}
                  className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded"
                >
                  aA
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-4">
          <button
            onClick={() => handleFilterClick(columnName)}
            className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400"
          >
            Filter
          </button>
          <button
            onClick={() => handleClearFilterClick(columnName)}
            className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400"
          >
            Clear Filter
          </button>
        </div>
      </div>
    );
  };

  const renderActionSelectDropdown = (index, currentAction) => {
    const actions = ['No Change', 'Add', 'Subtract', 'Multiply By', 'Divide By'];

    const handleActionSelect = (action) => {
      const updatedData = [...filteredData];
      updatedData[index].action = action;
      setFilteredData(updatedData);
      setActionDropdownOpenForIndex(null); // Close the dropdown
    };

    return (
      <div
        ref={actionSelectDropdownRef}
        className="absolute z-[9999] bg-gray-100 border-gray-300 shadow rounded p-2 w-[150px] border-2"
        style={{
          top: `${actionDropdownPosition.top}px`,
          left: `${actionDropdownPosition.left}px`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {actions.map((action) => (
          <div
            key={action}
            className={`p-1 cursor-pointer hover:bg-gray-200 ${currentAction === action ? 'bg-gray-200' : ''}`}
            onClick={() => handleActionSelect(action)}
          >
            {action}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4">Field Calculations</h2>
        <p className="text-gray-700 mb-6">
          If you would like to apply modifications to values, please configure
          below:
        </p>

        {/* Table Header */}
        <div className="grid grid-cols-3 gap-4 pb-2 border-b-2 border-gray-300 font-medium text-gray-600">
          <div 
            ref={fieldRef} 
            onClick={() => handleHeaderClick('Field', fieldRef)} 
            className="cursor-pointer hover:text-gray-800 flex items-center gap-1"
          >
            Field
            <div className="flex flex-col">
              <FaSortUp 
                className={`text-xs -mb-1 cursor-pointer ${sortConfig.key === 'field' && sortConfig.direction === 'ascending' ? 'text-blue-500' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSort('field');
                }}
              />
              <FaSortDown 
                className={`text-xs -mt-1 cursor-pointer ${sortConfig.key === 'field' && sortConfig.direction === 'descending' ? 'text-blue-500' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSort('field');
                }}
              />
            </div>
          </div>
          <div 
            ref={actionRef} 
            onClick={() => handleHeaderClick('Action', actionRef)} 
            className="cursor-pointer hover:text-gray-800 flex items-center gap-1"
          >
            Action
            <div className="flex flex-col">
              <FaSortUp 
                className={`text-xs -mb-1 cursor-pointer ${sortConfig.key === 'action' && sortConfig.direction === 'ascending' ? 'text-blue-500' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSort('action');
                }}
              />
              <FaSortDown 
                className={`text-xs -mt-1 cursor-pointer ${sortConfig.key === 'action' && sortConfig.direction === 'descending' ? 'text-blue-500' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSort('action');
                }}
              />
            </div>
          </div>
          <div 
            ref={byValueRef} 
            onClick={() => handleHeaderClick('ByValue', byValueRef)} 
            className="cursor-pointer hover:text-gray-800 flex items-center gap-1"
          >
            By Value
            <div className="flex flex-col">
              <FaSortUp 
                className={`text-xs -mb-1 cursor-pointer ${sortConfig.key === 'value' && sortConfig.direction === 'ascending' ? 'text-blue-500' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSort('value');
                }}
              />
              <FaSortDown 
                className={`text-xs -mt-1 cursor-pointer ${sortConfig.key === 'value' && sortConfig.direction === 'descending' ? 'text-blue-500' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSort('value');
                }}
              />
            </div>
          </div>
        </div>

        {/* Table Rows */}
        <div className="space-y-2 mt-2">
          {filteredData.map((item, index) => (
            <div key={index} className="grid grid-cols-3 gap-4 py-2 border-b border-gray-200">
              <div>{item.field}</div>
              <div
                className="cursor-pointer hover:bg-gray-200 p-2 -my-2 -mx-2 rounded"
                onClick={(e) => handleActionCellClick(index, e)}
              >
                {item.action}
              </div>
              {
                editingValueIndex === index ? (
                  <input
                    type="text"
                    className="border border-blue-400 focus:outline-none rounded p-1 flex-1 text-sm bg-white text-gray-800"
                    value={item.value}
                    onChange={(e) => {
                      const updatedData = [...filteredData];
                      updatedData[index].value = e.target.value;
                      setFilteredData(updatedData);
                    }}
                    onBlur={() => setEditingValueIndex(null)}
                    autoFocus
                  />
                ) : (
                  <div
                    className="cursor-pointer hover:bg-gray-200 p-2 -my-2 -mx-2 rounded"
                    onClick={() => setEditingValueIndex(index)}
                  >
                    {item.value}
                  </div>
                )
              }
            </div>
          ))}
        </div>

        {/* Save Button */}
        <div className="flex justify-center mt-6">
          <button 
            onClick={() => onSave({ /* pass calculation data here */ })}
            className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400"
          >
            Save
          </button>
        </div>
      </div>

      {showFieldFilterDropdown && createPortal(
        renderFilterDropdown('Field'),
        document.body
      )}
      {showActionFilterDropdown && createPortal(
        renderFilterDropdown('Action'),
        document.body
      )}
      {showByValueFilterDropdown && createPortal(
        renderFilterDropdown('ByValue'),
        document.body
      )}
      {actionDropdownOpenForIndex !== null && createPortal(
        renderActionSelectDropdown(actionDropdownOpenForIndex, filteredData[actionDropdownOpenForIndex].action),
        document.body
      )}
    </div>
  );
}

export default Calculate;