import React, { useState } from "react";
import List from "@mui/material/List";
import ListSubheader from "@mui/material/ListSubheader";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import FolderIcon from "@mui/icons-material/Folder";
import ListItemText from "@mui/material/ListItemText";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import EditRule from "./EditRule";

const FolderList = ({  selectedFolder, data, onClick, onDelete, place,setIsEdited }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRuleName, setSelectedRuleName] = useState("");

  const handleEditClick = (item, event) => {
    event.stopPropagation();
    setSelectedRuleName(item);
    setIsEditModalOpen(true);
  };

  const deleteButtonStyle = {
    marginLeft: "auto",
  };

  const handleDeleteClick = (item, event) => {
    event.stopPropagation();
    onDelete(item);
  };

  return (
    <>
    <List
      sx={{
        width: "100%",
        maxWidth: 360,
        bgcolor: "background.paper",
      }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          {place}
        </ListSubheader>
      }
    >
      {data.map((item) => (
        <ListItemButton key={item} onClick={() => onClick(item)}>
          <ListItemIcon>
            <FolderIcon />
          </ListItemIcon>
          <ListItemText primary={item} />
          {place === "Rules" && selectedFolder !== "Nokeywords" && ( // Add this condition
            <EditIcon
              style={{ marginRight: "10px" }}
              onClick={(event) => handleEditClick(item, event)}
            />
          )}
          <DeleteIcon
            style={deleteButtonStyle}
            onClick={(event) => handleDeleteClick(item, event)}
          />
        </ListItemButton>
      ))}

      <EditRule
        ruleName={selectedRuleName}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        data={data}
        setIsEdited={setIsEdited}
      />
    </List>
    </>
  );
};

export default FolderList;
