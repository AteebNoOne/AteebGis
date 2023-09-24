import React, { useState, useEffect, useReducer } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import validateRuleName from "./ruleNameValidation";
import API_BASE_URL from "./apiConfig";
import { useTranslation } from "react-i18next";

const initialState = {
  isValidNewRuleName: true,
  folderName: "",
  keywords: [],
  isLoading: false,
  error: null,
  editMode: false,
  newKeyword: "", // New keyword to be added when pressing Enter
  editedRuleName: "", // Initialize with an empty string
  originalRuleName: "", // Initialize with an empty string
  newRuleNameError: "", // Initialize with an empty string for rule name validation error
};

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, isLoading: true, error: null };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        folderName: action.payload.folderName,
        keywords: action.payload.keywords,
        editedRuleName: action.payload.ruleName,
        originalRuleName: action.payload.ruleName,
      };
    case "FETCH_ERROR":
      return { ...state, isLoading: false, error: action.payload.error };
    case "UPDATE_FIELD":
      return { ...state, [action.field]: action.value, newRuleNameError: "" };
    case "TOGGLE_EDIT_MODE":
      return { ...state, editMode: !state.editMode };
    case "ADD_KEYWORD":
      if (state.newKeyword.trim() === "" || state.keywords.length >= 6) {
        return state; 
      }
      if (state.keywords.includes(state.newKeyword)) {
        return state; 
      }
      return {
        ...state,
        keywords: [...state.keywords, state.newKeyword],
        newKeyword: "",
      };
    case "REMOVE_KEYWORD":
      return {
        ...state,
        keywords: state.keywords.filter((keyword) => keyword !== action.keyword),
      };
    case "CANCEL_EDIT":
      return {
        ...state,
        editedRuleName: state.originalRuleName,
        editMode: false,
        newRuleNameError: "",
      };
    case "UPDATE_NEW_RULE_NAME":
      return { ...state, [action.field]: action.value, newRuleNameError: "" };
    case "VALIDATE_NEW_RULE_NAME":
      return { ...state, newRuleNameError: action.error };
    default:
      return state;
  }
};

const EditRule = ({ ruleName, isOpen, onClose,setIsEdited,data}) => {
  const {t} = useTranslation();
  const [state, dispatch] = useReducer(reducer, initialState);
  const handleEdit = () => {
    const { folderName, keywords, editedRuleName, originalRuleName } = state;
    for (let i = 0; i < data.length; i++) {
        if (editedRuleName === data[i]) {
            if (editedRuleName !== originalRuleName) {
                //console.log("editedRule is same as one of the existing rule:", editedRuleName);
                alert(t("This rule already exists! Try another name"));
                return;
            }
        }
    }
    fetch(`${API_BASE_URL}edit-rule`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ruleName: editedRuleName,
        folderName,
        keywords,
        oldRuleName: originalRuleName,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        //console.log("Rule edited successfully:", data);
        setIsEdited(true);
        onClose();
      })
      .catch((error) => {
        //console.error("Error editing rule:", error);
      });
  };

  const { folderName, keywords, isLoading, error, editMode, newKeyword, editedRuleName, newRuleNameError } = state;

  useEffect(() => {
    if (folderName === "Nokeywords" && ruleName === "files") {
      alert(t("NOT A RULE\n\nDefault subfolder can't be a rule"));
      return;
    }
    if (isOpen) {
      dispatch({ type: "FETCH_START" });
      fetch(`${API_BASE_URL}/rules-data/${ruleName}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(t("Failed to fetch rule details"));
          }
          return response.json();
        })
        .then((data) => {
          dispatch({ type: "FETCH_SUCCESS", payload: data });
        })
        .catch((error) => {
          dispatch({ type: "FETCH_ERROR", payload: { error } });
        });
    }
  }, [isOpen, ruleName,folderName]);

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          minWidth: 400,
        }}
      >
        <h2>{t("Edit Rule")}</h2>
        {error ? (
          <p>{t("Error:")} {error.message}</p>
        ) : (
          <>
            {/* Editable Rule Name */}
            <TextField
              label={t("Rule Name")}
              fullWidth
              value={editedRuleName}
              disabled={!editMode}
              onChange={(e) =>
                dispatch({ type: "UPDATE_NEW_RULE_NAME", field: "editedRuleName", value: e.target.value })
              }
              margin="normal"
              onBlur={() => {
                const { isValid, error } = validateRuleName(editedRuleName);
                dispatch({ type: "VALIDATE_NEW_RULE_NAME", isValid, error });
              }}
              error={!!newRuleNameError}
              helperText={newRuleNameError}
            />

            <div>
              <h4>{t("Keywords:")}</h4>
              {/* Editable Keywords */}
              {editMode && (
                <>
                  {keywords.map((keyword, index) => (
                    <Chip
                      key={index}
                      label={keyword}
                      style={{ marginRight: 8 }}
                      onDelete={() => dispatch({ type: "REMOVE_KEYWORD", keyword })}
                    />
                  ))}
                  <TextField
                    label={t("New Keyword")}
                    fullWidth
                    value={newKeyword}
                    disabled={keywords.length > 5}
                    onChange={(e) => dispatch({ type: "UPDATE_FIELD", field: "newKeyword", value: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        dispatch({ type: "ADD_KEYWORD" });
                      }
                    }}
                    margin="normal"
                  />
                </>
              )}
              {!editMode &&
                keywords.map((keyword, index) => <Chip key={index} label={keyword} style={{ marginRight: 8 }} />)}
            </div>
            <Button
              variant="contained"
              color={editMode ? "secondary" : "primary"}
              onClick={() => {
                if (editMode) {
                  dispatch({ type: "CANCEL_EDIT" });
                } else {
                  dispatch({ type: "TOGGLE_EDIT_MODE" });
                }
              }}
              disabled={isLoading}
            >
              {editMode ? "Cancel" : "Edit Rule"}
            </Button>
            {editMode && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleEdit}
                disabled={isLoading || keywords.length < 4 || !!newRuleNameError }
              >
                {t("Save Changes")}
              </Button>
            )}
          </>
        )}
      </Box>
    </Modal>
  );
};

export default EditRule;
