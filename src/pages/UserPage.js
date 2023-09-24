import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import { CloudUpload } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import FormData from "form-data";
import { tableIcons } from "src/constants/tableIcons";
// @mui
import {
  Card,
  Stack,
  Button,
  Popover,
  MenuItem,
  Container,
  Typography,
  TableContainer,
  TextField,
  Modal,
  Box,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
// components
import Iconify from "../components/iconify";
import Scrollbar from "../components/scrollbar";
// sections
// mock
import { useTranslation } from "react-i18next";
import MaterialTable from "material-table";
// ----------------------------------------------------------------------

const useStyles = makeStyles((theme) => ({
  uploader: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  fileLabel: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 200,
    height: 200,
    border: `2px dashed ${theme.palette.primary.main}`,
    borderRadius: theme.shape.borderRadius,
    cursor: "pointer",
    marginBottom: theme.spacing(2),
  },
  uploadIcon: {
    fontSize: 48,
    marginRight: theme.spacing(1),
  },
  fileName: {
    fontWeight: "bold",
  },
  placeholder: {
    color: theme.palette.text.secondary,
  },
  uploadButton: {
    marginTop: theme.spacing(2),
  },
}));

export default function UserPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const classes = useStyles();
  const [open, setOpen] = useState(null);

  const [userList, setUserList] = useState([]);

  const [uploadExcel, setUploadExcel] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);

  const [roleSection, setRoleSection] = useState(false);

  const [ipRole, setIpRole] = useState("");
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [id, setId] = useState(null);
  const apiUrl = process.env.REACT_APP_BASE_URL;
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

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
  const handleCloseMenu = () => {
    setOpen(null);
  };

  useEffect(() => {
    axios
      .get(`${apiUrl}/users`)
      .then((res) => {
        // console.log(res.data);
        setUserList(res?.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile); // Get the selected file

      try {
        // Send the POST request
        const response = await axios.post(`${apiUrl}/users_excel`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        // Handle the response
        console.log(response.data);
        alert(t("successfully updated"));
        setUploadExcel(false);
      } catch (error) {
        // Handle errors
        console.error(error);
      }
    } else {
      console.log("No file selected");
    }
  };

  const uploadAddRole = async () => {
    if (ipRole != "") {
      try {
        await axios.post(`${apiUrl}/roles`, {
          role: `${ipRole}`,
        });
        alert(t("Added Successfully"));
        setIpRole("");
        // console.log(response.data); // Handle the response data as needed
      } catch (error) {
        console.error(error); // Handle any errors that occur
        alert(t("ERROR"), JSON.stringify(error));
      }
    } else {
      alert(t("Please Enter the Role"));
    }
  };
  const handleUpdateRow = (rowData) => {
    navigate(`/dashboard/addUser`, { state: { data: rowData } });
  };
  const handleDeleteRow = async () => {
    setIsDeleteLoading(true);
    const response = await axios.delete(`${apiUrl}/users/${id}`);
    //console.log("Delete Response", response);
    setIsDeleteLoading(false);
    setId(null);
    window.location.reload();
  };

  return (
    <>
      <Helmet>
        <title>{t("User | DocGIS")}</title>
      </Helmet>

      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          {roleSection ? (
            <>
              <TextField
                onChange={(e) => setIpRole(e.target.value)}
                required
                id="outlined-required"
                type="text"
                value={ipRole}
                name="role"
                label={t("Add Role")}
                style={{ width: "400px" }}
              />
              <Button
                style={{ width: "180px", height: "40px" }}
                onClick={() => uploadAddRole()}
                variant="contained"
                color="success"
              >
                {t("Add Role")}
              </Button>
              <Button
                onClick={() => {
                  setRoleSection(false);
                  setIpRole("");
                }}
                variant="contained"
                style={{ width: "180px", height: "40px", background: "red" }}
              >
                {t("Cancel")}
              </Button>
            </>
          ) : (
            <>
              {/* <Typography variant="h4" gutterBottom>
                {t("User Management")}
              </Typography> */}
              <Button
                style={{
                  width: "180px",
                  height: "40px",
                  background: "cyan",
                  color: "black",
                }}
                onClick={() => setRoleSection(true)}
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
              >
                {t("Add Role")}
              </Button>
              {!uploadExcel ? (
                <>
                  <Button
                    onClick={() => (window.location.href = `${apiUrl}/export`)}
                    style={{ width: "180px", height: "40px" }}
                    variant="contained"
                    color="secondary"
                  >
                    {t("Download All Users")}
                  </Button>
                  <Button
                    style={{ width: "180px", height: "40px" }}
                    onClick={() => setUploadExcel(true)}
                    variant="contained"
                    color="success"
                  >
                    {t("Excel Bulk Upload")}
                  </Button>
                  <Button
                    onClick={() => navigate("/dashboard/addUser")}
                    variant="contained"
                    style={{ width: "180px", height: "40px" }}
                    startIcon={<Iconify icon="eva:plus-fill" />}
                  >
                    {t("New User")}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => setUploadExcel(false)}
                    style={{ background: "red" }}
                    variant="contained"
                    color="success"
                  >
                    {t("Cancel")}
                  </Button>
                </>
              )}
            </>
          )}
        </Stack>

        {/* --------------------------------------------------------------- This card section is for user list starts here  ----------------------------------------------------------*/}

        {!uploadExcel && (
          <Card>
            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <MaterialTable
                  title=""
                  columns={[
                    {
                      title: "User ID",
                      field: "u_id",
                    },
                    { title: "First Name", field: "Fname" },
                    {
                      title: "Last Name",
                      field: "Lname",
                    },
                    { title: "Username", field: "Username" },
                    { title: "City", field: "City" },
                    { title: "Country", field: "Country" },
                    { title: "Address", field: "Address" },
                    { title: "Role", field: "Role" },
                  ]}
                  data={userList}
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
                      tooltip: "Edit User",
                      onClick: (event, rowData) => {
                        handleUpdateRow(rowData);
                      },
                    },
                    (rowData) => ({
                      icon: tableIcons.Delete,
                      tooltip: "Delete User",
                      onClick: (event, rowData) => {
                        handleOpen();
                        setId(rowData?.id);
                      },
                      disabled: isDeleteLoading,
                    }),
                  ]}
                />
              </TableContainer>
            </Scrollbar>
          </Card>
        )}
        {/* --------------------------------------------------------------- user list end here --------------------------------------------------------------- */}

        {/* /.//.//.///./././././././././/./././././././././././././././././././././/./././././././././././././././././././..//././././././././././././. */}

        {/* --------------------------------------------------------------- Upload Bulk Excel  ----------------------------------------------------------*/}

        {uploadExcel && (
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
                <div className={classes.uploader}>
                  <label htmlFor="file-input" className={classes.fileLabel}>
                    <CloudUpload className={classes.uploadIcon} />
                    {selectedFile ? (
                      <Typography
                        variant="subtitle1"
                        className={classes.fileName}
                      >
                        {selectedFile.name}
                      </Typography>
                    ) : (
                      <Typography
                        variant="subtitle1"
                        className={classes.placeholder}
                      >
                        {t("Choose an Excel file")}
                      </Typography>
                    )}
                  </label>
                  <input
                    hidden
                    type="file"
                    id="file-input"
                    onChange={handleFileChange}
                    accept=".xlsx, .xls"
                  />
                  {/* <Button variant="contained" color="primary" className={classes.uploadButton} onClick={handleUpload}>
                    Upload
                  </Button> */}
                </div>

                <Button
                  style={{
                    height: "50px",
                    margin: "10px",
                    marginBottom: "20px",
                    width: "230px",
                    background: "green",
                  }}
                  onClick={handleUpload}
                  variant="contained"
                >
                  {t("Upload User")}
                </Button>
                <Button
                  style={{
                    height: "50px",
                    margin: "10px",
                    marginBottom: "20px",
                    width: "230px",
                    background: "red",
                  }}
                  onClick={() => setUploadExcel(false)}
                  variant="contained"
                >
                  {t("Cancel")}
                </Button>
              </Box>
            </Scrollbar>
          </Card>
        )}
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            "& .MuiMenuItem-root": {
              px: 1,
              typography: "body2",
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem>
          <Iconify icon={"eva:edit-fill"} sx={{ mr: 2 }} />
          {t("Edit")}
        </MenuItem>

        <MenuItem sx={{ color: "error.main" }}>
          <Iconify icon={"eva:trash-2-outline"} sx={{ mr: 2 }} />
          {t("Delete")}
        </MenuItem>
      </Popover>
      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h3" component="h2">
            {t("Are you sure?")}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {t("Do you really want to delete this user?")}
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
                handleClose();
                setId(null);
              }}
            >
              {t("Cancle")}
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
                t("Delete")
              )}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
