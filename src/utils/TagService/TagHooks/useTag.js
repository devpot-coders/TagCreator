import { useState } from 'react';
import TagService from '../Tagservice';

export function useTag(company_code = 'afhstXDev') {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTagAction = async (action, ...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await TagService[action](...args);
      if (!result.success) {
        setError(result.error);
        return false;
      }
      return result.data;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const fetchTagList = () => handleTagAction('fetchList', company_code);

  const deleteTag = (id) => handleTagAction('deleteTagData', String(id), String(company_code));


  const fetchCategories = () => handleTagAction('fetchCategory', company_code);
  const fetchPrintItems = () => handleTagAction('fetchPrintList', company_code);
  const fetchTagById = (id) => handleTagAction('fetchTagById', id, company_code);

  return {
    fetchTagList,
    deleteTag,
    fetchCategories,
    fetchPrintItems,
    fetchTagById,
    loading,
    error,
  };
}
