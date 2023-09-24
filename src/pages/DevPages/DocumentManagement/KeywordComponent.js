import React, { useState } from "react";
import { TextField, Chip } from "@mui/material";

const KeywordComponent = ({setKey}) => {
  const [keywords, setKeywords] = useState([]);
  const [keywordInput, setKeywordInput] = useState("");

  const handleKeywordInputChange = (event) => {
    setKeywordInput(event.target.value);
  };

  const handleKeywordInputEnter = (event) => {
    if (event.key === "Enter" && keywordInput.trim() !== "") {
      event.preventDefault();

      // Check if the keyword is already present in the keywords state
      if (!keywords.includes(keywordInput.trim())) {
        if (keywords.length < 6) {
          setKeywords([...keywords, keywordInput.trim()]);
          setKey([...keywords, keywordInput.trim()]);
          setKeywordInput("");
        }
      } else {
        console.log("Keyword already exists!");
      }
    }
  };

  const handleRemoveKeyword = (keyword) => {
    setKeywords(keywords.filter((kw) => kw !== keyword));
    setKey(keywords.filter((kw) => kw !== keyword));
  };

  return (
    <div>
      <TextField
        label="Keywords"
        variant="outlined"
        value={keywordInput}
        onChange={handleKeywordInputChange}
        onKeyPress={handleKeywordInputEnter}
        disabled={keywords.length >= 6}
        helperText={`Keywords: ${keywords.length}/6`}
        fullWidth
      />
      <div style={{ marginTop: 10 }}>
        {keywords.map((keyword, index) => (
          <Chip
            key={index}
            label={keyword}
            onDelete={() => handleRemoveKeyword(keyword)}
            style={{ margin: 5 }}
          />
        ))}
      </div>
    </div>
  );
};

export default KeywordComponent;
