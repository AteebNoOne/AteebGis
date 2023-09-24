import API_BASE_URL from "./apiConfig";

const downloadFile = (directory, subfolder, filename) => {
    // Create the download link URL
    let downloadUrl = API_BASE_URL + 'files';
    downloadUrl += `/${directory}`;
    downloadUrl += `/${subfolder}`;
    downloadUrl += `?filename=${filename}`;
  
    // Create a temporary anchor element to trigger the download
    const anchor = document.createElement('a');
    anchor.href = downloadUrl;
    anchor.target = '_blank';
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };
  
  export default downloadFile;
  