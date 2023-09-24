import React, { useState, useEffect, useCallback } from "react";
import { Stack, TextField } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import validateRuleName from "./ruleNameValidation"; // Import the separate utility function

const RuleComponent = ({ folderName, setRule }) => {
  const { t } = useTranslation();
  const [ruleName, setRuleName] = useState("");
  const [isValidRuleName, setIsValidRuleName] = useState(true);
  const [error, setError] = useState("");

  const handleRuleNameChange = (event) => {
    const { value } = event.target;
    setRuleName(value);
    setRule(value);
  };

  const validateRule = useCallback(async (ruleName) => {
    try {
      if (ruleName.length >= 4 && ruleName.length <= 16) {
        setError("");
        const isValid = await validateRuleName(folderName, ruleName); // Use the separate utility function
        setIsValidRuleName(isValid);
        if (!isValid) {
          setError(t(`Rule Name ${ruleName} Already exists in selected folder ${folderName}`));
        }
      } else if (ruleName.length >= 1 && ruleName.length <= 3) {
        setIsValidRuleName(true);
        setError(t("Must use at least 4 characters"));
      } else {
        setIsValidRuleName(true);
        setError("");
      }
    } catch (error) {
      setIsValidRuleName(false);
      //console.error("Error validating rule name:", error);
    }
  }, [folderName,t]);

  useEffect(() => {
    validateRule(ruleName);
  }, [ruleName, validateRule]);

  return (
    <div>
      <Helmet>
        <title>{t("Enter Rule Name")}</title>
      </Helmet>
      <Stack spacing={2}>
        <TextField
          label={t("Rule Name")}
          value={ruleName}
          onChange={handleRuleNameChange}
          error={!isValidRuleName || !!error}
          helperText={!isValidRuleName ? error : ""}
        />
      </Stack>
    </div>
  );
};

export default RuleComponent;
