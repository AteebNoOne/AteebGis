import React, { useState, useEffect } from "react";
import {
  Stack,
  Container,
  Typography,
} from "@mui/material";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import FolderIcon from "@mui/icons-material/Folder";
import ListItemText from "@mui/material/ListItemText";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useTranslation } from "react-i18next";
import API_BASE_URL from "./apiConfig";

const FolderSelector = ({ setFolderName }) => {
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState("");
  const { t } = useTranslation();

  const handleClick = (folder) => {
    if(folder.name === 'Nokeywords'){
      alert(t('Cant create rule in default folder!'))
      return;
    }
    setSelectedFolder(folder);
    setFolderName(folder.name);
  };

  const fetchFolders = () => {
    axios
      .get(`${API_BASE_URL}directories`)
      .then((response) => {
        const foldersData = response.data;
        const foldersList = foldersData.map((folderName, index) => ({
          id: index,
          name: folderName,
        }));
        setFolders(foldersList);
      })
      .catch((error) => {
        //console.error("Error fetching folders:", error);
      });
  };

  useEffect(() => {
    // Fetch folders from API initially
    fetchFolders();

    // Set up a timer to fetch the folders every second
    const interval = setInterval(() => {
      fetchFolders();
    }, 1000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(interval);
  }, []);

  return (
    <Container>
      <Helmet>
        <title>{t("Select a folder")}</title>
      </Helmet>
      {folders.length > 0 ? (
        <Stack spacing={2}>
          <Typography variant="h5" component="div">
            {selectedFolder
                ? t(`Selected Folder: ${selectedFolder.name}`)
                : t("Selected Folder: No folder selected")}
            </Typography>
          <List subheader={<ListSubheader>{t("Folders")}</ListSubheader>}>
            {folders.map((folder) => (
              <ListItemButton
                key={folder.id}
                sx={
                    selectedFolder && selectedFolder.id === folder.id
                      ? {
                          backgroundColor: "#90EE90",
                          color: "black",
                        }
                      : {}
                  }
                className={selectedFolder && selectedFolder.id === folder.id ? "selected-folder" : ""}
                onClick={() => handleClick(folder)}
              >
                <ListItemIcon>
                  <FolderIcon />
                </ListItemIcon>
                <ListItemText primary={folder.name} />
              </ListItemButton>
            ))}
          </List>
        </Stack>
      ) : (
        <Typography variant="h5" component="div">
          {t("No Folders Found!")}
        </Typography>
      )}
    </Container>
  );
};

export default FolderSelector;
