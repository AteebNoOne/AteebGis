import React, { useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Box,
  TextField,
  Button,
  Card,
  Container,
  Stack,
  Typography,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Iconify from "../../../components/iconify";
import Scrollbar from "../../../components/scrollbar/Scrollbar";
import { useTranslation } from "react-i18next";
import SignatureModal from "./SignatureModal";
import axios from 'axios'

const Profile = () => {
  const isSignedLocal = localStorage.getItem("my_signature");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };


  const handleSave = (signatureData) => {
    //console.log('Saved signature data:', signatureData);
  };


  const navigate = useNavigate();
  const location = useLocation();
  //console.log("location", location.state);
  const { t } = useTranslation();
  const [idE, setIdE] = useState(false);
  const [usernameE, setUsernameE] = useState(false);
  const [passE, setPassE] = useState(false);
  const [fNanmeE, setFNanmeE] = useState(false);
  const [lNameE, setLNameE] = useState(false);
  const [addE, setAddE] = useState(false);
  const [cityE, setCityE] = useState(false);
  const [countryE, setCountryE] = useState(false);
  const [roleE, setRoleE] = useState(false);
  const [allFdata, setAllFData] = useState({});
  const [inputFields, setInputFields] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("adminInfo");
    const data = JSON.parse(user);
    if (data) {
      const dummyData = {
        UserID: data?.id,
        Username: data?.username,
        Password: data?.Password,
        Fname: data?.full_name.split(" ")[0],
        Lname: data?.full_name.split(" ")[1],
        phone: data?.phone,
        Address: data?.Address,
        City: data?.City,
        Country: data?.Country,
        Role: data?.Role,
      };
      setAllFData(dummyData);
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`https://test.node.docgis.com/ateeb/signed?id=${allFdata?.UserID}`);
      return response.data.signedData;
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (allFdata.UserID) { 
        const userData = await fetchUserData();
        if (userData) {
          setAllFData((prevAllFdata) => ({
            ...prevAllFdata,
            Menu: userData.menu,
            SignAdded: userData.sign_added,
          }));
        }
      }
    };
  
    fetchData();
  }, [allFdata.UserID]); 
  
  
    const shouldRenderButton = (
      (allFdata?.Menu === "dashboard,Workflow Reviewer" ||
        allFdata?.Menu === "dashboard,FinalApproval") &&
      allFdata?.SignAdded === 'False'
    );
    

  const handleChange = (e) => {
    const key = e.target.name;
    const value = e.target.value;
    setAllFData({
      ...allFdata,
      [key]: value,
    });
    flagsTrue();
  };
  const validation = () => {
    if (!("UserID" in allFdata)) {
      // code to execute if ID.allFdata is an empty string
      alert("ID cannot be empty");
      setIdE(true);
      return false;
    }
    if (!/^\d{1,14}$/.test(allFdata?.UserID)) {
      // code to execute if ID.allFdata is not a number with a maximum of 14 characters
      alert("ID can only contains number with maximum limit of 14 characters");
      setIdE(true);
      return false;
    }
    if (
      !("Username" in allFdata) ||
      allFdata?.Username?.trim() === "" ||
      /\s/.test(allFdata.Username)
    ) {
      // code to execute if allFdata.username is empty or contains spaces
      alert("Username cannot be empty & does not contain spaces");
      setUsernameE(true);
      return false;
    }
    if (
      !("Password" in allFdata) ||
      allFdata?.Password.trim() === "" ||
      /\s/.test(allFdata.Password)
    ) {
      // code to execute if allFdata.username is empty or contains spaces
      alert("Password cannot be empty & does not contain spaces");
      setPassE(true);
      return false;
    }
    if (!("Fname" in allFdata) || allFdata.Fname.trim() === "") {
      // code to execute if allFdata.username is empty or contains spaces
      alert("First Name cannot be empty & does not contain spaces");
      setFNanmeE(true);
      return false;
    }
    if (!("Lname" in allFdata) || allFdata.Lname.trim() === "") {
      // code to execute if allFdata.username is empty or contains spaces
      alert("Last Name cannot be empty & does not contain spaces");
      setLNameE(true);
      return false;
    }
    if (!("Address" in allFdata) || allFdata.Address.trim() === "") {
      // code to execute if allFdata.username is empty or contains spaces
      alert("Address cannot be empty & does not contain spaces");
      setAddE(true);
      return false;
    }
    if (
      !("City" in allFdata) ||
      allFdata.City.trim() === "" ||
      /\s/.test(allFdata.City)
    ) {
      // code to execute if allFdata.username is empty or contains spaces
      alert("City cannot be empty & does not contain spaces");
      setCityE(true);
      return false;
    }
    if (
      !("Country" in allFdata) ||
      allFdata.Country.trim() === "" ||
      /\s/.test(allFdata.Country)
    ) {
      // code to execute if allFdata.username is empty or contains spaces
      alert("Country cannot be empty & does not contain spaces");
      setCountryE(true);
      return false;
    }
    return true;
  };

  const flagsTrue = () => {
    setIdE(false);
    setUsernameE(false);
    setPassE(false);
    setFNanmeE(false);
    setLNameE(false);
    setAddE(false);
    setCityE(false);
    setCountryE(false);
    setRoleE(false);
  };

  return (
    <>
      <Helmet>
        <title> Profile | DocGIS</title>
      </Helmet>
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            {t("Profile")}
          </Typography>
          <Button
            size="large"
            color="error"
            variant="contained"
            onClick={() => navigate("/dashboard/app")}
            sx={{ mr: "20px", width: "180px", height: "40px" }}
          >
            Cancel
          </Button>
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
              <TextField
                onChange={handleChange}
                error={idE}
                value={allFdata?.UserID}
                required
                id="outlined-required"
                type="number"
                name="UserID"
                label={t("UserID")}
                disabled
              />{" "}
              <br />
              <TextField
                onChange={handleChange}
                error={usernameE}
                value={allFdata?.Username}
                disabled
                required
                type="text"
                id="outlined-required"
                name="Username"
                label={t("Username")}
              />{" "}
              {/* <br />
              <TextField
                onChange={handleChange}
                value={allFdata?.Password}
                error={passE}
                required
                id="outlined-required"
                name="Password"
                label={t("Password")}
              />{" "} */}
              <br />
              <TextField
                onChange={handleChange}
                value={allFdata?.Fname}
                error={fNanmeE}
                required
                id="outlined-required"
                name="Fname"
                label={t("First Name")}
              />{" "}
              <br />
              <TextField
                onChange={handleChange}
                value={allFdata?.Lname}
                error={lNameE}
                required
                id="outlined-required"
                name="Lname"
                label={t("Last Name")}
              />{" "}
              <br />
              <TextField
                onChange={handleChange}
                // error={cityE}
                // required
                value={allFdata?.phone}
                type="number"
                id="outlined-required"
                name="phone"
                label={t("Phone")}
              />{" "}
              <br />
              <TextField
                onChange={handleChange}
                value={allFdata?.Address}
                error={addE}
                required
                id="outlined-required"
                name="Address"
                label={t("Address")}
              />{" "}
              <br />
              <TextField
                onChange={handleChange}
                value={allFdata?.City}
                error={cityE}
                required
                id="outlined-required"
                name="City"
                label={t("City")}
              />{" "}
              <br />
              <TextField
                onChange={handleChange}
                value={allFdata?.Country}
                error={countryE}
                required
                id="outlined-required"
                name="Country"
                label={t("Country")}
              />{" "}
              <br />
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  style={{
                    height: "50px",
                    margin: "10px",
                    marginBottom: "20px",
                    width: "230px",
                    background: "green",
                    marginRight: "20px",
                  }}
                  onClick={() => { }}
                  variant="contained"
                >
                  {isLoading ? (
                    <CircularProgress color="success" size={18} />
                  ) : (
                    t("Update Profile")
                  )}
                </Button>
                {shouldRenderButton && (
                  <div>
                    <Button
                      style={{
                        height: "50px",
                        margin: "10px",
                        marginBottom: "20px",
                        width: "230px",
                        background: "orange",
                        marginRight: "20px",
                      }}
                      onClick={openModal}
                      variant="contained"
                    >
                      Add sign
                    </Button>
                    <SignatureModal
                      isOpen={isModalOpen}
                      onClose={closeModal}
                      onSave={handleSave}
                      fetchUserData={fetchUserData}
                    />
                  </div>
                )}
              </div>
            </Box>
          </Scrollbar>
        </Card>
      </Container>
    </>
  );
};

export default Profile;
