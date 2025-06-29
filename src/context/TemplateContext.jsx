import React, { createContext, useContext, useState } from 'react';

const TemplateContext = createContext();

export const useTemplate = () => {
  const context = useContext(TemplateContext);
  if (!context) {
    throw new Error('useTemplate must be used within a TemplateProvider');
  }
  return context;
};

export const TemplateProvider = ({ children }) => {
  const [templateName, setTemplateName] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);

  const value = {
    templateName,
    setTemplateName,
    isEditMode,
    setIsEditMode,
  };

  return (
    <TemplateContext.Provider value={value}>
      {children}
    </TemplateContext.Provider>
  );
}; 