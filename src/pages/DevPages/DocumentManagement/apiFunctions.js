// apiFunctions.js
import axios from "axios";
import API_BASE_URL from "./apiConfig";

export const getData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/directories`);
    return response.data;
  } catch (error) {
    return null;
  }
};

export const getSubFolder = async (directory) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/subdirectories?directoryname=${directory}`
    );
    return response.data;
  } catch (error) {
    return null;
  }
};

export const getFiles = async (currentDirectory, subdirectory) => {
  const directoryname = `${currentDirectory.selectedFolderName}/${subdirectory}/${currentDirectory.selectedSubFolderName}`;
  try {
    const response = await axios.get(
      `${API_BASE_URL}/getFiles?directoryname=${directoryname}`
    );
    return response.data;
  } catch (error) {
    return null;
  }
};
