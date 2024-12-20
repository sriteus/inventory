// src/utils/fetchFormConfig.ts
import axios from 'axios';

const token = import.meta.env.VITE_AUTH_TOKEN;

export interface FetchFormConfigParams {
  formId: string;
  endpoint: string;
  action: string;
  data?: Record<string, any>;
  initData?: Record<string, any>;
}

export const fetchTableDetails = async ({
  formId,
  endpoint,
  action,
  data = {},
  initData = {},
}: FetchFormConfigParams) => {
  try {
    const response = await axios.post(
      `http://localhost:8003/api/${endpoint}`,
      {
        action,
        formId,
        data,
        initData,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching form configuration for formId ${formId}:`, error);
    throw error;
  }
};
