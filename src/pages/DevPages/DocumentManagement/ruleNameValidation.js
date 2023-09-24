import API_BASE_URL from "./apiConfig";

const validateRuleName = async (folderName, ruleName) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}validate?folderName=${folderName}&ruleName=${ruleName}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    //console.error("Error validating rule name:", error);
    return false;
  }
};

export default validateRuleName;
