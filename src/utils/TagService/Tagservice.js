import { apiClient } from "../../auth/apiClient";

const TagService = {
  // Fetch tag list
  async fetchList(company_code) {
    try {
      const response = await apiClient.get(`tags/list.php?company_code=${company_code}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Delete tag by ID and company_code
  async deleteTagData(company_code,tagListDeleteId) {
    try {
      const response = await apiClient.delete("tags/delete.php",{
        company_code,
        id:tagListDeleteId
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  ,

  // Fetch inventory print list
  async fetchPrintList(company_code) {
    try {
      const response = await apiClient.get(`inventory/list.php?company_code=${company_code}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Fetch category list
  async fetchCategory(company_code) {
    try {
      const response = await apiClient.get(`category/list.php?company_code=${company_code}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};

export default TagService;
