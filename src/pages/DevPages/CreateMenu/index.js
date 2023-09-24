import React, { useState } from "react";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Card,
  Stack,
  Button,
  Container,
  Typography,
  Grid,
} from "@mui/material";
import { Helmet } from "react-helmet-async";
import Iconify from "src/components/iconify/Iconify";
import Scrollbar from "src/components/scrollbar/Scrollbar";
import Box from "@mui/material/Box";
import axios from "axios";
import "./forms.css";
import { useTranslation } from "react-i18next";

const types = ["VARCHAR", "INTEGER", "FLOAT", "DATE", "BOOLEAN"]; // Available types for dropdown
const selection = [
  "INPUT_TEXT",
  "INPUT_NUMBER",
  "INPUT_DATE",
  "SELECT_LIST",
  "RADIO_BUTTON",
];

const CreateMenu = () => {
  const { t } = useTranslation();

  const [name, setName] = useState('');
  const [route, setRoute] = useState('');
  const [icon, setIcon] = useState('');
  const apiUrl = process.env.REACT_APP_BASE_URL;

  const handleSubmit = async (e) => {
    const data = {
      name: name,
      route: route,
      icon:icon,
    };
    
    axios.post(`${apiUrl}/menu`, data)
      .then(response => {
        setName('');
        setRoute('');
        setIcon('')
        alert('Data inserted successfully');
        // Handle the successful response here
      })
      .catch(error => {
       alert('An error occurred while inserting data:', error);
        // Handle the error response here
      });
  };



  return (
    <>
      <Helmet>
        <title>Create Menu</title>
      </Helmet>
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            {t("Create Menu")}
          </Typography>
        </Stack>
        <Card>
          <Scrollbar>
            <Box
              component="form"
              sx={{
                "& .MuiTextField-root": { m: 1, width: "100ch" },
              }}
              noValidate
              autoComplete="off"
            >
              <div className="container">
                <Grid container>
                  <Grid item xs={6}>
                    <TextField
                      style={{ width: "98%", marginBottom: "50px" }}
                      label={t("Enter label")}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      style={{ width: "98%", marginBottom: "50px" }}
                      label={t("Enter route")}
                      value={route}
                      onChange={(e) => setRoute(e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      style={{ width: "98%", marginBottom: "50px" }}
                      label={t("Enter icon")}
                      value={icon}
                      onChange={(e) => setIcon(e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      style={{ width: "150px", float: 'right' }}
                      variant="contained"
                      color="primary"
                      type="button"
                      className="submit-button"
                    onClick={() => handleSubmit()}
                    >
                      {t("Submit")}
                    </Button>
                  </Grid>
                </Grid>

              </div>

            </Box>
          </Scrollbar>
        </Card>
      </Container>
    </>
  );
};

export default CreateMenu;
