import {
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";

import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import axios from "axios";

function MobileRoutes() {
  const [buttonSets, setButtonSets] = useState([
    { id: null, name: "", link: "" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    getButtons();
  }, []);

  const getButtons = () => {
    axios
      .get("https://test.node.docgis.com/ateeb/buttons")
      .then((res) => {
        console.log("Button response", res.data.buttons);
        if (res?.data?.buttons?.length > 0) {
          const filter = res?.data?.buttons?.map((val, index) => ({
            id: val.id,
            name: val.Name,
            link: val.url,
          }));
          console.log("Filter", filter);
          setButtonSets(filter);
        }
      })
      .catch((err) => {
        console.log("Error", err);
      });
  };
  const handleAddMore = () => {
    setButtonSets([...buttonSets, { id: null, name: "", link: "" }]);
  };

  const handleInputChange = (index, field, value) => {
    const updatedSets = [...buttonSets];
    updatedSets[index][field] = value;
    setButtonSets(updatedSets);
  };
  const handleDelete = (id) => {
    setIsDelete(true);
    axios
      .delete(`https://test.node.docgis.com/ateeb/buttons/${id}`)
      .then((res) => {
        console.log("Button is deleted", res);
        setIsDelete(false);
        getButtons();
      })
      .catch((err) => {
        console.log("Error", err);
      });
  };
  // const createButtons = () => {
  //   setIsLoading(true);
  //   if (buttonSets.length > 0) {
  //     let filter = [];
  //     buttonSets?.forEach((val) => {
  //       filter.push({ Name: val.name, url: val.link });
  //      });
  //     console.log("Filter : ", filter);
  //     console.log("Button Set: ", buttonSets);
  //     axios
  //       .post("https://test.node.docgis.com/ateeb/buttons", filter)
  //       .then((res) => {
  //         console.log("Create Button", res);
  //         setIsLoading(false);
  //       })
  //       .catch((err) => {
  //         console.log("Error", err);
  //       });
  //   }
  // };

  const createButtons = () => {
    setIsLoading(true);

    if (buttonSets.length > 0) {
      // Create a Set to store unique button names
      const uniqueNames = new Set();

      // Filter out button sets that have an ID or duplicate names
      const filteredButtons = buttonSets.filter((val) => {
        if (val.id !== null || uniqueNames.has(val.name)) {
          return false;
        }
        uniqueNames.add(val.name);
        return true;
      });

      if (filteredButtons.length > 0) {
        const filter = filteredButtons.map((val) => ({
          Name: val.name,
          url: val.link,
        }));

        console.log("Filtered Data: ", filter);
        console.log("Button Set: ", buttonSets);

        axios
          .post("https://test.node.docgis.com/ateeb/buttons", filter)
          .then((res) => {
            console.log("Create Button", res);
            setIsLoading(false);
          })
          .catch((err) => {
            console.log("Error", err);
          });
      } else {
        console.log("No valid button sets to send.");
        setIsLoading(false);
      }
    } else {
      console.log("No button sets available.");
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title> Navigation</title>
      </Helmet>
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-start"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            {/* {t("MobileRoutes")} */}
          </Typography>
        </Stack>
        <Card
          sx={{
            width: "100%",
            minHeight: "400px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            p: "30px",
          }}
        >
          <Typography variant="h4" width="100%" gutterBottom justifySelf="left">
            {t("createDynamicButtons")}
          </Typography>
          {buttonSets?.length > 0 &&
            buttonSets?.map((buttonSet, index) => (
              <>
                <Typography
                  variant="h5"
                  width="100%"
                  justifySelf="left"
                  sx={{ marginTop: "10px" }}
                >
                  {`Button ${index + 1}`}
                </Typography>
                <Box
                  key={index}
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "10px",
                  }}
                >
                  <TextField
                    sx={{ width: "46%" }}
                    label="Name"
                    variant="outlined"
                    value={buttonSet.name}
                    onChange={(e) =>
                      handleInputChange(index, "name", e.target.value)
                    }
                  />
                  <TextField
                    sx={{ width: "46%" }}
                    label="Link"
                    variant="outlined"
                    value={buttonSet.link}
                    onChange={(e) =>
                      handleInputChange(index, "link", e.target.value)
                    }
                  />
                  <IconButton
                    aria-label="delete"
                    color="error"
                    disabled={isDelete}
                    onClick={() => handleDelete(buttonSet?.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </>
            ))}
          <Box
            sx={{
              marginTop: "20px",
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button variant="contained" onClick={handleAddMore}>
              Add More
            </Button>
            <Button variant="contained" onClick={createButtons}>
              {isLoading ? (
                <CircularProgress sx={{ color: "white" }} size={20} />
              ) : (
                "Save"
              )}
            </Button>
          </Box>
        </Card>
      </Container>
    </>
  );
}

export default MobileRoutes;
