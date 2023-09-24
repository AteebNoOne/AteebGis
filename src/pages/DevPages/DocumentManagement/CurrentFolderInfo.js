import React, { useEffect } from "react";
import { Breadcrumbs, Typography, Link } from "@mui/material";
import { useTranslation } from "react-i18next";
const CurrentFolderInfo = ({ folderName, subfolders, inFiles, onSubfolderClick }) => {
  const {t} = useTranslation();
  const folderPath = inFiles ? `root/${folderName}${subfolders ? "/" + subfolders : ""}` : `root/${folderName}`;

  useEffect(() => {
    // This function will be called whenever the folderName or subfolders change
    // You can use it to update the component when the props change.
  }, [folderName, subfolders]);

  const containerStyle = {
    border: "1px solid #ccc",
    borderRadius: "4px",
    padding: "8px",
    background: "#f7f7f7",
  };

  const breadcrumbStyle = {
    display: "inline-block",
    verticalAlign: "middle",
  };

  return (
    <div style={containerStyle}>
      <Typography variant="body1">
        <strong>{t("Current Directory:")} </strong>
        <span style={breadcrumbStyle}>{folderPath}</span>
      </Typography>
    </div>
  );
};

export default CurrentFolderInfo;
