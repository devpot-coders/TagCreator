import React, { useState } from 'react';
import { FiX, FiChevronDown, FiFilter } from 'react-icons/fi';

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

  if (!isOpen) return null;

  const settingsFields = [
    { name: 'tagsPerPage', label: 'Tags Per Page', type: 'text' },
    { name: 'marginLeft', label: 'Margin Left', type: 'text' },
    { name: 'marginTop', label: 'Margin Top', type: 'text' },
    { name: 'tagWidth', label: 'Tag Width', type: 'text' },
    { name: 'tagHeight', label: 'Tag Height', type: 'text' },
    { name: 'rowMargin', label: 'Row Margin', type: 'text' },
    { name: 'columnMargin', label: 'Column Margin', type: 'text' },
  ];

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
                className={`flex-1 p-2 font-semibold flex items-center justify-between 
                  ${index === 0 ? 'bg-gray-400' : 'bg-gray-300'} 
                  ${index < settingsFields.length - 1 ? 'border-r border-white' : ''} text-black
                `}
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
                className={`flex-1 p-2 ${index < settingsFields.length - 1 ? 'border-r border-gray-300' : ''}`}
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
