import React, { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import axios from "axios";
import API_BASE_URL from "./apiConfig";
import { useTranslation } from "react-i18next";

const Submit = ({ folderName, ruleName, keywords }) => {
  const {t} = useTranslation();
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [failDialogOpen, setFailDialogOpen] = useState(false);

  const handleSuccessDialogClose = () => {
    setSuccessDialogOpen(false);
    window.location.reload(); // Reload the page after successful API response
  };

  const handleFailDialogClose = () => {
    setFailDialogOpen(false);
    window.location.reload(); // Reload the page after failed API response
  };

  const handleSubmit = async () => {
    if(keywords.length < 4 ){
      alert(t("Must enter at least 4 keywords"))
      return;
    }
    try {
      // Replace API_ENDPOINT with the actual API endpoint URL
      const API_ENDPOINT = `${API_BASE_URL}rules`;
      const response = await axios.post(API_ENDPOINT, {
        folderName,
        ruleName,
        keywords,
      });

      if (response.data) {
        //console.log("This is response",response.data);
        setSuccessDialogOpen(true);
      } else {
        setFailDialogOpen(true);
      }
    } catch (error) {
      //console.error("Error submitting data:", error);
      setFailDialogOpen(true);
    }
  };

  return (
    <div>
      <Button variant="contained" onClick={handleSubmit}>
        {t("Submit")}
      </Button>

      {/* Success Dialog */}
      <Dialog open={successDialogOpen} onClose={handleSuccessDialogClose}>
        <DialogTitle>{t("Success")}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t(`The rule ${ruleName} created successfully.`)}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSuccessDialogClose} color="primary" autoFocus>
            {t("OK")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Fail Dialog */}
      <Dialog open={failDialogOpen} onClose={handleFailDialogClose}>
        <DialogTitle>{t("Error")}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("Failed to creating rule! Please try again later.")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFailDialogClose} color="primary" autoFocus>
            {t("OK")}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Submit;
