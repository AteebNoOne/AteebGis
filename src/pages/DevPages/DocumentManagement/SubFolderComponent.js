import React, { useState } from "react";
import { useTranslation } from "react-i18next"; 
import {
  Card,
  Stack,
  Button,
  Container,
  Typography,
  TextField,
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import axios from "axios";
import API_BASE_URL from "./apiConfig";
const SubfolderComponent = () => {
  const [subfolderName, setSubfolderName] = useState("");
  const { t } = useTranslation(); // Assuming you're using i18next for translations

  const handleCreateSubfolder = () => {
    // Make the POST API call to create the subfolder
    axios
      .post(`${API_BASE_URL}'/createsubdirectory'`, { name: subfolderName })
      .then((response) => {
        // Reload the page after the subfolder is created
        window.location.reload();
      })
      .catch((error) => {
        // Handle any errors from the API call
        //console.error("Error creating subfolder:", error);
      });
  };

  return (
    <Card>
      <Container>
        <Typography variant="h6" gutterBottom>
          {t("Create Subfolder")}
        </Typography>
        <Stack spacing={2}>
          <TextField
            label={t("Subfolder Name")}
            variant="outlined"
            value={subfolderName}
            onChange={(e) => setSubfolderName(e.target.value)}
          />
          <Button variant="contained" onClick={handleCreateSubfolder}>
            {t("Create Subfolder")}
          </Button>
        </Stack>
      </Container>
    </Card>
  );
};

export default SubfolderComponent;
