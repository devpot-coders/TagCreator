import React, { useState, useRef, useEffect } from 'react';
import { FiX, FiChevronDown } from 'react-icons/fi';

const PrintSettingsPopup = ({ isOpen, onClose, onSave }) => {
  const [settings, setSettings] = useState({
    tagsPerPage: '1UP',
    marginLeft: '0.2',
    marginTop: '0.25',
    tagWidth: '8',
    tagHeight: '10.5',
    rowMargin: '0',
    columnMargin: '0',
  });

  // Add state for dropdowns
  const [showTagsPerPageDropdown, setShowTagsPerPageDropdown] = useState(false);
  const [showMarginLeftDropdown, setShowMarginLeftDropdown] = useState(false);
  const [showMarginTopDropdown, setShowMarginTopDropdown] = useState(false);
  const [showTagWidthDropdown, setShowTagWidthDropdown] = useState(false);
  const [showTagHeightDropdown, setShowTagHeightDropdown] = useState(false);
  const [showRowMarginDropdown, setShowRowMarginDropdown] = useState(false);
  const [showColumnMarginDropdown, setShowColumnMarginDropdown] = useState(false);

  // Add state for selected options
  const [selectedTagsPerPage, setSelectedTagsPerPage] = useState([]);
  const [selectedMarginLeft, setSelectedMarginLeft] = useState([]);
  const [selectedMarginTop, setSelectedMarginTop] = useState([]);
  const [selectedTagWidth, setSelectedTagWidth] = useState([]);
  const [selectedTagHeight, setSelectedTagHeight] = useState([]);
  const [selectedRowMargin, setSelectedRowMargin] = useState([]);
  const [selectedColumnMargin, setSelectedColumnMargin] = useState([]);

  // Add dropdown positions
  const [tagsPerPagePosition, setTagsPerPagePosition] = useState(null);
  const [marginLeftPosition, setMarginLeftPosition] = useState(null);
  const [marginTopPosition, setMarginTopPosition] = useState(null);
  const [tagWidthPosition, setTagWidthPosition] = useState(null);
  const [tagHeightPosition, setTagHeightPosition] = useState(null);
  const [rowMarginPosition, setRowMarginPosition] = useState(null);
  const [columnMarginPosition, setColumnMarginPosition] = useState(null);

  // Refs for dropdown content to measure height and header element
  const dropdownRefs = useRef({});
  const headerRefs = useRef({});

  // Add dropdown options
  const tagsPerPageOptions = ['1UP', '2UP', '3UP', '4UP', '6UP', '8UP', '9UP', '12UP'];
  const marginOptions = ['0', '0.1', '0.2', '0.25', '0.3', '0.4', '0.5', '0.75', '1'];
  const sizeOptions = ['4', '5', '6', '7', '8', '9', '10', '10.5', '11', '12'];

  // State for filter inputs for each field
  const [filterStates, setFilterStates] = useState({
    tagsPerPage: { condition1: 'Is equal to', value1: '', operator: 'And', condition2: 'Is equal to', value2: '' },
    marginLeft: { condition1: 'Is equal to', value1: '', operator: 'And', condition2: 'Is equal to', value2: '' },
    marginTop: { condition1: 'Is equal to', value1: '', operator: 'And', condition2: 'Is equal to', value2: '' },
    tagWidth: { condition1: 'Is equal to', value1: '', operator: 'And', condition2: 'Is equal to', value2: '' },
    tagHeight: { condition1: 'Is equal to', value1: '', operator: 'And', condition2: 'Is equal to', value2: '' },
    rowMargin: { condition1: 'Is equal to', value1: '', operator: 'And', condition2: 'Is equal to', value2: '' },
    columnMargin: { condition1: 'Is equal to', value1: '', operator: 'And', condition2: 'Is equal to', value2: '' },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prevSettings) => ({
      ...prevSettings,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onSave(settings);
    onClose();
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      settingsFields.forEach(field => {
        const headerElement = headerRefs.current[field.name];
        const dropdownElement = dropdownRefs.current[field.name];
        
        if (field.showDropdown && 
            dropdownElement && !dropdownElement.contains(event.target) &&
            headerElement && !headerElement.contains(event.target)) {
          field.setShowDropdown(false);
        }
      });
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]); 

  if (!isOpen) return null;

  const settingsFields = [
    { 
      name: 'tagsPerPage', 
      label: 'Tags Per Page', 
      type: 'text',
      options: tagsPerPageOptions,
      showDropdown: showTagsPerPageDropdown,
      setShowDropdown: setShowTagsPerPageDropdown,
      position: tagsPerPagePosition,
      setPosition: setTagsPerPagePosition,
      selected: selectedTagsPerPage,
      setSelected: setSelectedTagsPerPage,
      filterState: filterStates.tagsPerPage,
      setFilterState: (key, value) => handleFilterChange('tagsPerPage', key, value)
    },
    { 
      name: 'marginLeft', 
      label: 'Margin Left', 
      type: 'text',
      options: marginOptions,
      showDropdown: showMarginLeftDropdown,
      setShowDropdown: setShowMarginLeftDropdown,
      position: marginLeftPosition,
      setPosition: setMarginLeftPosition,
      selected: selectedMarginLeft,
      setSelected: setSelectedMarginLeft,
      filterState: filterStates.marginLeft,
      setFilterState: (key, value) => handleFilterChange('marginLeft', key, value)
    },
    { 
      name: 'marginTop', 
      label: 'Margin Top', 
      type: 'text',
      options: marginOptions,
      showDropdown: showMarginTopDropdown,
      setShowDropdown: setShowMarginTopDropdown,
      position: marginTopPosition,
      setPosition: setMarginTopPosition,
      selected: selectedMarginTop,
      setSelected: setSelectedMarginTop,
      filterState: filterStates.marginTop,
      setFilterState: (key, value) => handleFilterChange('marginTop', key, value)
    },
    { 
      name: 'tagWidth', 
      label: 'Tag Width', 
      type: 'text',
      options: sizeOptions,
      showDropdown: showTagWidthDropdown,
      setShowDropdown: setShowTagWidthDropdown,
      position: tagWidthPosition,
      setPosition: setTagWidthPosition,
      selected: selectedTagWidth,
      setSelected: setSelectedTagWidth,
      filterState: filterStates.tagWidth,
      setFilterState: (key, value) => handleFilterChange('tagWidth', key, value)
    },
    { 
      name: 'tagHeight', 
      label: 'Tag Height', 
      type: 'text',
      options: sizeOptions,
      showDropdown: showTagHeightDropdown,
      setShowDropdown: setShowTagHeightDropdown,
      position: tagHeightPosition,
      setPosition: setTagHeightPosition,
      selected: selectedTagHeight,
      setSelected: setSelectedTagHeight,
      filterState: filterStates.tagHeight,
      setFilterState: (key, value) => handleFilterChange('tagHeight', key, value)
    },
    { 
      name: 'rowMargin', 
      label: 'Row Margin', 
      type: 'text',
      options: marginOptions,
      showDropdown: showRowMarginDropdown,
      setShowDropdown: setShowRowMarginDropdown,
      position: rowMarginPosition,
      setPosition: setRowMarginPosition,
      selected: selectedRowMargin,
      setSelected: setSelectedRowMargin,
      filterState: filterStates.rowMargin,
      setFilterState: (key, value) => handleFilterChange('rowMargin', key, value)
    },
    { 
      name: 'columnMargin', 
      label: 'Column Margin', 
      type: 'text',
      options: marginOptions,
      showDropdown: showColumnMarginDropdown,
      setShowDropdown: setShowColumnMarginDropdown,
      position: columnMarginPosition,
      setPosition: setColumnMarginPosition,
      selected: selectedColumnMargin,
      setSelected: setSelectedColumnMargin,
      filterState: filterStates.columnMargin,
      setFilterState: (key, value) => handleFilterChange('columnMargin', key, value)
    },
  ];

  const handleFilterChange = (fieldName, filterKey, value) => {
    setFilterStates(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        [filterKey]: value
      }
    }));
  };

  const applyFilter = (options, filterState) => {
    if ((!filterState.value1 && !filterState.value2) || (!filterState.value1 && filterState.value2 && !filterState.condition2) || (!filterState.value2 && filterState.value1 && !filterState.condition1)) {
      return options; // No valid filter applied
    }
  
    return options.filter(option => {
      const checkCondition = (val, condition, filterVal) => {
        if (!filterVal) return true;
        const lowerVal = String(val).toLowerCase();
        const lowerFilterVal = String(filterVal).toLowerCase();
  
        switch (condition) {
          case 'Is equal to': return lowerVal === lowerFilterVal;
          case 'Does not equal': return lowerVal !== lowerFilterVal;
          case 'Contains': return lowerVal.includes(lowerFilterVal);
          case 'Does not contain': return !lowerVal.includes(lowerFilterVal);
          case 'Starts with': return lowerVal.startsWith(lowerFilterVal);
          case 'Ends with': return lowerVal.endsWith(lowerFilterVal);
          default: return true;
        }
      };
  
      const result1 = checkCondition(option, filterState.condition1, filterState.value1);
      const result2 = checkCondition(option, filterState.condition2, filterState.value2);
  
      if (filterState.value1 && filterState.value2) {
        return filterState.operator === 'And' ? (result1 && result2) : (result1 || result2);
      } else if (filterState.value1) {
        return result1;
      } else if (filterState.value2) {
        return result2;
      }
      return true;
    });
  };

  const handleCheckbox = (field, option) => {
    field.setSelected(prev => 
      prev.includes(option) 
        ? prev.filter(item => item !== option)
        : [...prev, option]
    );
  };

  const handleSelectAll = (field) => {
    field.setSelected(field.selected.length === field.options.length ? [] : field.options);
  };

  const handleClearFilter = (field) => {
    field.setSelected([]); // Clear selected checkboxes
    field.setFilterState('condition1', 'Is equal to');
    field.setFilterState('value1', '');
    field.setFilterState('operator', 'And');
    field.setFilterState('condition2', 'Is equal to');
    field.setFilterState('value2', '');
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-[10000]">
      <div className="bg-gray-100 p-6 rounded shadow-lg w-full max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-black">Print Settings</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-black">
            <FiX className="h-6 w-6" />
          </button>
        </div>

        <div className="border border-gray-300 rounded overflow-hidden mb-6">
          {/* Headers Row */}
          <div className="flex">
            {settingsFields.map((field, index) => (
              <div
                key={field.name}
                ref={el => headerRefs.current[field.name] = el}
                className={`flex-1 p-2 font-semibold flex items-center justify-between cursor-pointer
                  ${index === 0 ? 'bg-gray-400' : 'bg-gray-300'} 
                  ${index < settingsFields.length - 1 ? 'border-r border-white' : ''} text-black
                `}
                onClick={(e) => {
                  // Close all other dropdowns
                  settingsFields.forEach((f) => {
                    if (f.name !== field.name && f.showDropdown) {
                      f.setShowDropdown(false);
                    }
                  });

                  const rect = e.currentTarget.getBoundingClientRect();
                  const dropdownElement = dropdownRefs.current[field.name];
                  const dropdownHeight = dropdownElement ? dropdownElement.offsetHeight : 0;
                  
                  const spaceBelow = window.innerHeight - rect.bottom;
                  const spaceAbove = rect.top;

                  let newTop;
                  let newLeft = rect.left; 

                  // Prioritize opening below if enough space, otherwise open above
                  if (spaceBelow >= dropdownHeight + 10 || spaceBelow > spaceAbove) {
                    newTop = rect.bottom + 5; 
                  } else {
                    newTop = rect.top - dropdownHeight - 5; 
                  }

                  // Clamp to screen boundaries with padding
                  if (newTop + dropdownHeight + 10 > window.innerHeight) {
                    newTop = window.innerHeight - dropdownHeight - 10; 
                  }
                  if (newTop < 10) {
                    newTop = 10; 
                  }

                  field.setPosition({
                    top: newTop,
                    left: newLeft,
                  });
                  field.setShowDropdown(!field.showDropdown);
                }}
              >
                <span>{field.label}</span>
                <div className="flex items-center gap-1">
                  <FiChevronDown className="text-black" />
                </div>
              </div>
            ))}
          </div>

          {/* Input Fields Row */}
          <div className="flex bg-white">
            {settingsFields.map((field, index) => (
              <div
                key={field.name}
                className={`flex-1 p-2 relative ${index < settingsFields.length - 1 ? 'border-r border-gray-300' : ''}`}
              >
                <input
                  type={field.type}
                  name={field.name}
                  value={settings[field.name]}
                  onChange={handleChange}
                  className="w-full bg-transparent focus:outline-none text-gray-800"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Dropdowns */}
        {settingsFields.map((field) => (
          field.showDropdown && field.position && (
            <div
              key={field.name}
              ref={el => dropdownRefs.current[field.name] = el}
              className="fixed z-[9999] bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 shadow rounded p-2 w-[250px] border-2 overflow-y-auto mb-10" 
              style={{
                top: 350, // Force to 20px from the top of the viewport to ensure visibility
                left: field.position.left,
                minWidth: 280,
                maxHeight: `calc(100vh - 40px)` // Max height based on viewport height, with 20px top/bottom padding
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={field.selected.length === applyFilter(field.options, field.filterState).length && applyFilter(field.options, field.filterState).length > 0}
                    onChange={() => handleSelectAll(field)}
                    className="mr-2 h-4 w-4 shadow-sm"
                  />
                  <span className="font-normal">Select All</span>
                </div>
                <button
                  onClick={() => field.setShowDropdown(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <FiX className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-2 overflow-y-scroll h-12"> 
                {applyFilter(field.options, field.filterState).map((option) => (
                  <div key={option} className="flex items-center mb-1 ">
                    <input
                      type="checkbox"
                      checked={field.selected.includes(option)}
                      onChange={() => handleCheckbox(field, option)}
                      className="mr-2 h-4 w-4 shadow-sm"
                    />
                    <span>{option}</span>
                  </div>
                ))}
              </div>
              <div className="text-gray-700 dark:text-gray-300 text-xs mb-2">
                Show rows with value that
              </div>
              <div className="mb-2">
                <select
                  className="w-full p-1 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                  value={field.filterState.condition1}
                  onChange={(e) => field.setFilterState('condition1', e.target.value)}
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
                  className="flex-1 p-1 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                  value={field.filterState.value1}
                  onChange={(e) => field.setFilterState('value1', e.target.value)}
                />
                <button className="ml-2 px-2 py-1 bg-gray-300 text-black rounded font-normal">aA</button>
              </div>
              <div className="mb-2">
                <select
                  className="w-full p-1 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                  value={field.filterState.operator}
                  onChange={(e) => field.setFilterState('operator', e.target.value)}
                >
                  <option>And</option>
                  <option>Or</option>
                </select>
              </div>
              {/* Second filter block */}
              <div className="mb-2">
                <select
                  className="w-full p-1 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                  value={field.filterState.condition2}
                  onChange={(e) => field.setFilterState('condition2', e.target.value)}
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
                  className="flex-1 p-1 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                  value={field.filterState.value2}
                  onChange={(e) => field.setFilterState('value2', e.target.value)}
                />
                <button className="ml-2 px-2 py-1 bg-gray-300 text-black rounded font-normal">aA</button>
              </div>
              {/* End Second filter block */}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  className="px-3 py-1 bg-gray-300 text-black rounded font-normal"
                  onClick={() => {
                    handleClearFilter(field);
                    field.setShowDropdown(false);
                  }}
                >
                  Clear Filter
                </button>
                <button
                  className="px-3 py-1 bg-gray-300 text-black rounded font-normal"
                  onClick={() => field.setShowDropdown(false)}
                >
                Filter
                </button>
              </div>
            </div>
          )
        ))}

        <div className="flex justify-center gap-2">
          <button
            onClick={handleSave}
            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded font-semibold"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded font-semibold"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintSettingsPopup;
