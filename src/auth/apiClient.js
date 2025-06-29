// apiClient.js
import axios from 'axios';
// const api_url = process.env.NEXT_PUBLIC_API_BASE_URL
const api_url = "https://retailpos.iconnectgroup.com/Api/"

class ApiClient {
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: api_url,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // You can modify the request config here (e.g., add auth token)
        const token = localStorage.getItem('authToken'); // Example
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => {
        // You can modify the response here
        return response;
      },
      (error) => {
        // Handle errors globally
        const apiError = {
          message: error.message,
          isAxiosError: true,
        };

        if (error.response) {
          apiError.status = error.response.status;
          apiError.data = error.response.data;
        }

        // You can add specific error handling here
        if (error.response?.status === 401) {
          // Handle unauthorized access
          console.error('Unauthorized access - redirect to login');
        }

        return Promise.reject(apiError);
      }
    );
  }

  // Common method to handle all requests
  async request(config) {
    try {
      const response = await this.axiosInstance.request(config);
      return {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      };
    } catch (error) {
      throw this.normalizeError(error);
    }
  }

  normalizeError(error) {
    if (axios.isAxiosError(error)) {
      return {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        isAxiosError: true,
      };
    }
    return {
      message: error.message || 'Unknown error occurred',
      isAxiosError: false,
    };
  }



  // GET request
  async get(url, params = {}, config = {}) {
    return this.request({
      method: 'GET',
      url,
      params,
      ...config,
    });
  }
  // POST request
  async post(url, data = {}, config = {}) {
    return this.request({
      method: 'POST',
      url,
      data,
      ...config,
    });
  }
  // PUT request
  async put(url, data = {}, config = {}) {
    return this.request({
      method: 'PUT',
      url,
      data,
      ...config,
    });
  }
  // PATCH request
  async patch(url, data = {}, config = {}) {
    return this.request({
      method: 'PATCH',
      url,
      data,
      ...config,
    });
  }
  // DELETE request
  async delete(url, data = {}, config = {}) {
    return this.request({
      method: 'DELETE',
      url,
      data,
      ...config,
    });
  }
  // Custom fetch-like request (similar to axios.fetch)
  async fetchRequest(url, config = {}) {
    return this.request({
      url,
      ...config,
    });
  }
}



// Create a singleton instance (optional)
export const apiClient = new ApiClient();