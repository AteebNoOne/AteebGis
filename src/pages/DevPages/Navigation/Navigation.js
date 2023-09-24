import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Iconify from "src/components/iconify/Iconify";
import {
  Card,
  Grid,
  TextField,
  Button,
  Container,
  Stack,
  Typography,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TableRow,
  TableBody,
  Table,
  TableCell,
  TableContainer,
  Modal,
  Box,
  Paper,
  TableHead,
  CircularProgress,
  Input,
} from "@mui/material";
import Scrollbar from "src/components/scrollbar/Scrollbar";
import { useTranslation } from "react-i18next";
import { MapboxGLComponent } from "src/components/MapBoxGL";
import LocationInput from "src/components/MapInput";
import moment from "moment";
import axios from "axios";
import MaterialTable from "material-table";
import { tableIcons } from "src/constants/tableIcons";

const Navigation = () => {
  const { t } = useTranslation();
  const [stockNumber, setStockNumber] = useState("");
  const [name, setName] = useState("");
  const [gpsNumber, setGpsNumber] = useState("");
  const [description, setDescription] = useState("");
  const [userName, setUserName] = useState("");
  const [userRoleSelected, setUserRoleSelected] = useState("");
  const [mapSec, setMapSec] = useState("gisList");
  const [userList, setUserList] = React.useState([]);
  const [userRole, setUserRole] = React.useState([]);
  const [selectedUsersList, setSelectedUsers] = useState([]);
  const [parcelData, setParcelData] = useState([]);
  const [gpsCords, setGpscords] = useState([]);
  const [parcelDetailsD, setParcelDetialsD] = useState({});
  const [open, setOpen] = useState(false);
  const [navigations, setNavigations] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const [id, setId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [openNavigationModal, setOpenNavigationModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [isReload, setIsReload] = useState(false);
  const [createdDate, setCreatedDate] = useState("");
  const [isDirection, setIsDirection] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({ lat: 0, lng: 0 });
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  const apiUrl = process.env.REACT_APP_BASE_URL;
  const storageUrl = process.env.REACT_APP_UPLOAD_URL;
  // const destination = { lat: 37.7749, lng: -122.4194 }; // Replace with your destination coordinates
  const [destination, setDestination] = useState({ lat: 0, lng: 0 });
  console.log("destination", destination);
  console.log("current Location", currentLocation);
  const handleOpenNavigationModal = () => setOpenNavigationModal(true);
  const handleCloseNavigationModal = () => {
    setIsDirection(false);
    setOpenNavigationModal(false);
  };
  const handleOpenDetailModal = () => setOpenDetailModal(true);
  const handleCloseDetailModal = () => {
    clearState();
    setOpenDetailModal(false);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    height: 220,
    bgcolor: "background.paper",
    borderRadius: "8px",
    boxShadow: 24,
    p: 4,
  };
  const detailsStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "60%",
    height: "80%",
    maxHeight: "85%",
    overflowY: "auto",
    bgcolor: "background.paper",
    borderRadius: "8px",
    boxShadow: 24,
    p: 4,
  };
  const navigationStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "60%",
    height: "82%",
    maxHeight: "85%",
    overflowY: "auto",
    bgcolor: "background.paper",
    borderRadius: "8px",
    boxShadow: 24,
    p: 4,
  };
  useEffect(() => {
    if (isReload) {
      window.location.reload();
    }
    setIsReload(false);
  }, [isReload]);
  // Function to handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files;
    setSelectedFile(file);
  };

  // Function to handle file upload
  const handleUpload = async () => {
    console.log("Uploading file:", selectedFile);
    setImageUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    Array.from(selectedFile).forEach((file) => {
      formData.append("files", file);
    });
    formData.append("type", "navigation");
    formData.append("category", stockNumber);

    try {
      const response = await axios.post(`${storageUrl}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("File Response", response.data.downloadLinks);
      setImageUrl(response.data.downloadLinks[0]);
      setImageUploading(false);
      alert("Image Uploaded Successfully");
    } catch (error) {
      // Handle error
      console.error(error);
    }
  };
  const getNavigations = () => {
    axios
      .get(`${apiUrl}/fetch-gps-data`)
      .then((res) => {
        console.log("navigation response", res.data);
        setNavigations(res.data);
      })
      .catch((err) => {
        console.error("Error", err);
      });
  };
  useEffect(() => {
    getNavigations();
  }, []);
  useEffect(() => {
    console.log("parcelDetailsD", parcelDetailsD);
  }, [parcelDetailsD]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    let userDetails = JSON.parse(localStorage.getItem("adminInfo"));
    getData();
    setUserName(userDetails?.full_name);
    getRole();
  }, []);

  const validation = () => {
    if (!stockNumber || stockNumber.trim().length < 1) {
      alert("Stock Number is required");
      return false;
    } else if (!name || name.trim().length < 1) {
      alert("Name is required");
      return false;
    } else if (!gpsNumber) {
      alert("GPS Points is required");
      return false;
    }
    return true;
  };
  const next = () => {
    const isValid = validation();
    if (isValid) {
      setIsLoading(true);
      const data = {
        username: userName,
        timestamp: new Date().toLocaleString().split(",")[0],
        stock_number: stockNumber,
        name: name,
        gps_points: gpsNumber,
        description: description ? description : "",
        images: imageUrl ? imageUrl : "",
      };
      if (id) {
        axios
          .put(`${apiUrl}/update-gps-data/${id}`, data)
          .then((res) => {
            console.log("Edit response", res);
            setIsReload(true);
            setMapSec("gisList");
            setIsLoading(false);
          })
          .catch((err) => {
            console.log("error", err);
          });
      } else {
        axios
          .post(`${apiUrl}/insert-gps-data`, data)
          .then((res) => {
            console.log("response", res);
            setIsReload(true);
            setMapSec("gisList");
            setIsLoading(false);
          })
          .catch((err) => {
            console.log("error", err);
          });
      }
    }
  };

  const getRole = async () => {
    try {
      const response = await axios.get(`${apiUrl}/roles`);
      // console.log(response.data);
      setUserRole(response.data);
    } catch (error) {
      // Handle errors
      console.error(error);
    }
  };

  const getData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/gisadmin`);
      console.log(response.data);
      // setUserRole(response.data);
      const sortedData = response.data.sort((a, b) => {
        // Assuming the timestamp field is named "timestamp"
        const timestampA = new Date(a.date);
        const timestampB = new Date(b.date);
        return timestampB - timestampA; // Sort in descending order
      });
      setParcelData(sortedData);
      sortedData.map((details) => {
        if (details.parcel == parcelDetailsD?.parcel) {
          setParcelDetialsD(details);
        }
      });
    } catch (error) {
      // Handle errors
      console.error(error);
    }
  };
  React.useEffect(() => {
    if (userRoleSelected !== "") {
      axios
        .get(`${apiUrl}/admin/${userRoleSelected}`)
        .then((res) => {
          // console.log(res.data);
          const options = res.data.map((item) => ({
            label: item.full_name,
            value: item.username,
          }));
          setUserList(options);
          setSelectedUsers([]);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [userRoleSelected]);
  const clearState = () => {
    setIsUpdate(false);
    setStockNumber("");
    setName("");
    setDescription("");
    setGpsNumber("");
    setImageUrl("");
    setCreatedDate("");
    setId(null);
  };
  const handleUpdateRow = async (rowData) => {
    setMapSec("gisParcel");
    setIsUpdate(true);
    setStockNumber(rowData?.stock_number);
    setName(rowData?.name);
    setDescription(rowData?.description);
    setGpsNumber(rowData?.gps_points);
    setId(rowData?.id);
  };
  const handleDeleteRow = async () => {
    setIsDeleteLoading(true);
    const response = await axios.delete(`${apiUrl}/delete-gps-data/${id}`);
    console.log("Delete Response", response);
    setIsDeleteLoading(false);
    setId(null);
    window.location.reload();
  };
  const handleDetails = (rowData) => {
    handleOpenDetailModal();
    setStockNumber(rowData?.stock_number);
    setName(rowData?.name);
    setDescription(rowData?.description);
    setGpsNumber(rowData?.gps_points);
    setImageUrl(rowData?.images);
    setCreatedDate(rowData?.timestamp);
  };
  const handleGetNavigationClick = (rowData) => {
    handleOpenNavigationModal();
    let gpsPoint = rowData?.gps_points;
    if (gpsPoint.length > 1) {
      let lat = parseFloat(gpsPoint?.split(",")[0]);
      let lng = parseFloat(gpsPoint?.split(",")[1]);
      const location = { lat, lng };
      setDestination(location);
    }
  };
  const manageCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentLocation(currentLocation);
          setIsDirection(true);
        },
        (error) => {
          console.error("Error getting current location:", error);
        }
      );
    } else {
      console.error("Geolocation is not available in this browser.");
    }
  };
  const getCurrentLocation = (type) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          if (type === "google") {
            redirectToGoogleMaps(currentLocation, destination);
          } else {
            redirectToAppleMaps(currentLocation, destination);
          }
        },
        (error) => {
          console.error("Error getting current location:", error);
        }
      );
    } else {
      console.error("Geolocation is not available in this browser.");
    }
  };

  const redirectToGoogleMaps = (startLocation, destination) => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${startLocation.lat},${startLocation.lng}&destination=${destination.lat},${destination.lng}`;
    window.open(url, "_blank");
  };
  const redirectToAppleMaps = (startLocation, destination) => {
    const url = `maps://maps.apple.com/?saddr=${startLocation.lat},${startLocation.lng}&daddr=${destination.lat},${destination.lng}&dirflg=d`;
    window.open(url, "_blank");
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
          justifyContent="space-between"
          mb={5}
        >
          {mapSec === "gisMap" ||
          mapSec === "gisParcel" ||
          mapSec === "gisParcel2" ||
          mapSec === "gisDetails" ? (
            <>
              <Button
                variant="contained"
                style={{ background: "red" }}
                onClick={() => setMapSec("gisList")}
                startIcon={<Iconify icon="mdi-light:cancel" />}
              >
                {t("Cancel")}
              </Button>
            </>
          ) : (
            <>
              <Typography variant="h4" gutterBottom>
                {/* {t("Navigation")} */}
              </Typography>

              <Button
                variant="contained"
                onClick={() => {
                  setId(null);
                  setMapSec("gisParcel");
                  clearState();
                }}
                startIcon={<Iconify icon="eva:plus-fill" />}
              >
                {t("Add Navigation")}
              </Button>
            </>
          )}
        </Stack>
        <Card>
          {mapSec === "gisMap" ? (
            <MapboxGLComponent />
          ) : mapSec === "gisParcel" ? (
            <div style={{ padding: "20px" }}>
              <Grid container spacing={2}>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItem: "center",
                    mt: 4,
                  }}
                >
                  <TextField
                    label="Admin Name"
                    disabled={true}
                    type="text"
                    value={userName}
                    sx={{ width: "48%" }}
                  />
                  <TextField
                    label="Creation Date"
                    disabled={true}
                    value={new Date().toLocaleString().split(",")[0]}
                    sx={{ width: "48%" }}
                  />
                </Box>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItem: "center",
                    mt: 4,
                  }}
                >
                  <TextField
                    label="Stock Number"
                    placeholder="Enter Stock Number"
                    type="number"
                    value={stockNumber}
                    onChange={(e) => {
                      setStockNumber(e.target.value);
                    }}
                    sx={{ mb: 3, width: "48%" }}
                  />
                  <TextField
                    label="Name"
                    placeholder="Enter Name"
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                    value={name}
                    sx={{ mb: 3, width: "48%" }}
                  />
                </Box>
                <TextField
                  label="Description"
                  placeholder="Enter description"
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                  value={description}
                  multiline
                  minRows={5}
                  sx={{ mb: 3 }}
                  fullWidth
                />
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItem: "center",
                    mt: 4,
                  }}
                >
                  <TextField
                    label="GPS Point"
                    value={gpsNumber}
                    onChange={(e) => setGpsNumber(e.target.value)}
                    fullWidth
                    type={"text"}
                    sx={{ mb: 3, width: "50%" }}
                  />
                  <div
                    style={{
                      width: "48%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Input
                      type="file"
                      inputProps={{ accept: "image/*" }}
                      onChange={handleFileChange}
                    />
                    <label
                      htmlFor="image-upload"
                      style={{ marginRight: "10px" }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleUpload}
                      >
                        {imageUploading ? (
                          <CircularProgress sx={{ color: "white" }} size={22} />
                        ) : (
                          "Upload Image"
                        )}
                      </Button>
                    </label>
                  </div>
                </Box>
                <Box sx={{ width: "50%" }}>
                  <LocationInput />
                </Box>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={next}
                    sx={{ mt: 4, width: "140px", height: "44px" }}
                  >
                    {isLoading ? (
                      <CircularProgress sx={{ color: "white" }} size={22} />
                    ) : (
                      "Save"
                    )}
                  </Button>
                </Box>
              </Grid>
            </div>
          ) : mapSec === "gisList" ? (
            <>
              <Scrollbar>
                <MaterialTable
                  title=""
                  columns={[
                    {
                      title: "Stock Number",
                      field: "stock_number",
                    },
                    {
                      title: "Stock Name",
                      field: "name",
                    },
                    {
                      title: "Creation Date",
                      field: "timestamp",
                    },
                    {
                      title: "",
                      render: (rowData) => (
                        <Button
                          variant="contained"
                          onClick={() => handleGetNavigationClick(rowData)}
                        >
                          Get Direction
                        </Button>
                      ),
                    },
                    {
                      title: "",
                      render: (rowData) => (
                        <Button
                          variant="contained"
                          onClick={() => handleDetails(rowData)}
                        >
                          Details
                        </Button>
                      ),
                    },
                  ]}
                  data={navigations}
                  icons={tableIcons}
                  options={{
                    search: true,
                    sorting: true,
                    pageSize: 5,
                    paging: true,
                    actionsColumnIndex: -1,
                  }}
                  actions={[
                    {
                      icon: tableIcons.Edit,
                      tooltip: "Edit Navigation",
                      onClick: (event, rowData) => {
                        handleUpdateRow(rowData);
                      },
                    },
                    (rowData) => ({
                      icon: tableIcons.Delete,
                      tooltip: "Delete Navigation",
                      onClick: (event, rowData) => {
                        handleOpenModal();
                        setId(rowData?.id);
                      },
                      disabled: false,
                    }),
                  ]}
                />
              </Scrollbar>
            </>
          ) : (
            <></>
          )}
        </Card>
        <Modal
          open={open}
          onClose={handleClose}
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            marginTop: "10%",
          }}
        >
          <Box sx={{ width: 400, bgcolor: "background.paper", p: 2 }}>
            <MapboxGLComponent customCords={gpsCords} />
            <Button onClick={handleClose}>Close</Button>
          </Box>
        </Modal>
      </Container>
      {/* Delete Modal */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h3" component="h2">
            Are you sure?
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Do you really want to delete this admin?
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              mt: 6,
            }}
          >
            <Button
              variant="contained"
              size="medium"
              onClick={() => {
                handleCloseModal();
                setId(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              size="medium"
              color="error"
              onClick={() => handleDeleteRow()}
            >
              {isDeleteLoading ? (
                <CircularProgress sx={{ color: "white" }} size={22} />
              ) : (
                "Delete"
              )}
            </Button>
          </Box>
        </Box>
      </Modal>
      {/* Details Modal */}
      <Modal
        open={openDetailModal}
        onClose={handleCloseDetailModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={detailsStyle}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Typography id="modal-modal-title" variant="h3">
              Navigation Details
            </Typography>
            <Button
              variant="contained"
              size="medium"
              color="error"
              onClick={() => {
                handleCloseDetailModal();
              }}
            >
              Cancel
            </Button>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography id="modal-modal-title" variant="h6">
              Stock Number :
            </Typography>
            <Typography
              id="modal-modal-description"
              sx={{ ml: 2, maxWidth: "50%", wordBreak: "break-word" }}
            >
              {stockNumber}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography id="modal-modal-title" variant="h6">
              Location name :
            </Typography>
            <Typography
              id="modal-modal-description"
              sx={{ ml: 2, maxWidth: "50%", wordBreak: "break-word" }}
            >
              {name}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography id="modal-modal-title" variant="h6">
              Point Latitude :
            </Typography>
            <Typography
              id="modal-modal-description"
              sx={{ ml: 2, maxWidth: "50%", wordBreak: "break-word" }}
            >
              {gpsNumber.length > 1 ? gpsNumber?.split(",")[0] : "..."}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography id="modal-modal-title" variant="h6">
              Point Longitude :
            </Typography>
            <Typography
              id="modal-modal-description"
              sx={{ ml: 2, maxWidth: "50%", wordBreak: "break-word" }}
            >
              {gpsNumber.length > 1 ? gpsNumber?.split(",")[1] : "..."}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography id="modal-modal-title" variant="h6">
              Description :
            </Typography>
            <Typography
              id="modal-modal-description"
              sx={{ ml: 2, maxWidth: "50%", wordBreak: "break-word" }}
            >
              {description}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography id="modal-modal-title" variant="h6">
              Image Link :
            </Typography>
            <Typography
              id="modal-modal-description"
              sx={{ ml: 2, maxWidth: "50%", wordBreak: "break-word" }}
            >
              {imageUrl}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography id="modal-modal-title" variant="h6">
              Creator Name :
            </Typography>
            <Typography
              id="modal-modal-description"
              sx={{ ml: 2, maxWidth: "50%", wordBreak: "break-word" }}
            >
              {userName}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography id="modal-modal-title" variant="h6">
              Created Date :
            </Typography>
            <Typography
              id="modal-modal-description"
              sx={{ ml: 2, maxWidth: "50%", wordBreak: "break-word" }}
            >
              {createdDate}
            </Typography>
          </Box>
        </Box>
      </Modal>
      {/* Navigation Modal */}
      <Modal
        open={openNavigationModal}
        onClose={handleCloseNavigationModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={navigationStyle}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography id="modal-modal-title" variant="h3">
              Map
            </Typography>
            <Button
              variant="contained"
              size="medium"
              color="error"
              onClick={() => {
                handleCloseNavigationModal();
              }}
            >
              Cancel
            </Button>
          </Box>
          <Box>
            {isDirection ? (
              <Box sx={{ width: "80%" }}>
                <LocationInput
                  destination={destination}
                  currentLocation={currentLocation}
                />
              </Box>
            ) : (
              <Box sx={{ width: "80%" }}>
                <LocationInput destination={false} currentLocation={false} />
              </Box>
            )}
          </Box>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 4,
            }}
          >
            <Button
              variant="contained"
              size="medium"
              onClick={() => {
                manageCurrentLocation();
              }}
            >
              Get Direction
            </Button>
            <Button
              variant="contained"
              size="medium"
              onClick={() => {
                getCurrentLocation("google");
              }}
            >
              Use Google Map
            </Button>
            <Button
              variant="contained"
              size="medium"
              onClick={() => {
                getCurrentLocation("apple");
              }}
            >
              Use Apple Map
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default Navigation;
