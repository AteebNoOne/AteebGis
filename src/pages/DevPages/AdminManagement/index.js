import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { filter } from "lodash";
import { sentenceCase } from "change-case";
import { useState, useEffect, forwardRef } from "react";
import TextField from "@mui/material/TextField";
//mui icons for table

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
  CircularProgress,
  Modal,
  Box,
} from "@mui/material";
import axios from "axios";
// components
import Iconify from "src/components/iconify/Iconify";
import Scrollbar from "src/components/scrollbar/Scrollbar";
// sections
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
// mock
import { useTranslation } from "react-i18next";
import MaterialTable from "material-table";
import { tableIcons } from "src/constants/tableIcons";

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

const AdminManagement = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(null);
  const [addAdminSec, setAddAdminSec] = useState(false);
  const [allAdminData, setAllAdminData] = useState({});
  console.log("allAdminData", allAdminData);
  const [selectedValues, setSelectedValues] = useState("");
  const [selectedMenu, setSelectedMenu] = useState([]);
  const [menuList, setMenuList] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [adminData, setAdminData] = useState([]);
  const [roleSection, setRoleSection] = useState(false);
  const [ipRole, setIpRole] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);
  const [id, setId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);
  const apiUrl = process.env.REACT_APP_BASE_URL;

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

  useEffect(() => {
    getAdminDB();
    getMenuList();
    getRoleList();
  }, []);

  console.log("Admin Dataaaaaaa: ", allAdminData);
  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleSelectChange = (event) => {
    setSelectedValues(event.target.value);
  };
  const handleMenuChange = (event) => {
    setSelectedMenu(event.target.value);
  };

  console.log("Selected Value: ", selectedValues);

  const adminOnChange = (e) => {
    const key = e.target.name;
    const value = e.target.value;
    setAllAdminData({
      ...allAdminData,
      [key]: value,
    });
  };

  const validateFields = () => {
    if (allAdminData.full_name.trim().length === 0) {
      alert("Please enter full name");
      return false;
    }
    if (allAdminData.phone.toString().trim().length === 0) {
      alert("Please enter phone number");
      return false;
    }
    if (allAdminData.username.trim().length === 0) {
      alert("Please enter username");
      return false;
    }
    if (allAdminData.password.trim().length === 0) {
      alert("Please enter password");
      return false;
    }
    if (selectedValues.length === 0) {
      alert("Please select role");
      return false;
    } else {
      return true;
    }
  };

  const submitToDB = async () => {
    if (isUpdate) {
      setIsLoading(true);
      const valid = validateFields();
      if (valid) {
        const finalData = {
          full_name: allAdminData?.full_name,
          phone: allAdminData?.phone,
          username: allAdminData?.username,
          password: allAdminData?.password,
          role: selectedValues,
        };
        const response = await axios.put(
          `${apiUrl}/admin_management/${id}`,
          finalData
        );
        setIsLoading(false);
        alert("successfully updated");
        window.location.reload();
        console.log("response", response);
      }
    } else {
      const valid = validateFields();
      if (valid) {
        const finalData = {
          full_name: allAdminData?.full_name,
          phone: allAdminData?.phone,
          username: allAdminData?.username,
          password: allAdminData?.password,
          role: selectedValues,
          menu: selectedMenu.join(","),
          sign: "",
          sign_added: "False",
        };
        // console.log("final", finalData);
        try {
          // Send the POST request
          const response = await axios.post(
            `${apiUrl}/admin_management`,
            finalData
          );

          // Handle the response
          // console.log(response.data);
          window.location.reload();
        } catch (error) {
          // Handle errors
          console.error(error);
        }
        alert("Added Successfully");
        // console.log('ALL DATA', finalData);
      }
    }
  };

  const getMenuList = () => {
    axios
      .get(`${apiUrl}/menu`)
      .then((response) => {
        setMenuList(response.data);
        console.log("Data retrieved successfully:", response.data);
        // Handle the successful response and access the retrieved data here
      })
      .catch((error) => {
        console.error("An error occurred while retrieving data:", error);
        // Handle the error response here
      });
  };

  const getRoleList = () => {
    axios
      .get(`${apiUrl}/admin-roles`)
      .then((response) => {
        setRoleList(response.data);
        console.log("Data retrieved successfully:", response.data);
        // Handle the successful response and access the retrieved data here
      })
      .catch((error) => {
        console.error("An error occurred while retrieving data:", error);
        // Handle the error response here
      });
  };
  const getAdminDB = async () => {
    try {
      const response = await axios.get(`${apiUrl}/admin_management`);
      console.log("----", response.data);
      await setAdminData(response.data);
    } catch (error) {
      // Handle errors
      console.error(error);
    }
  };

  const uploadAddRole = async () => {
    if (ipRole != "") {
      try {
        await axios.post(`${apiUrl}/admin-roles`, {
          name: `${ipRole}`,
        });
        alert("Added Successfully");
        setIpRole("");
        window.location.reload();
        // console.log(response.data); // Handle the response data as needed
      } catch (error) {
        console.error(error); // Handle any errors that occur
        alert("ERROR", JSON.stringify(error));
      }
    } else {
      alert("Please Enter the Role");
    }
  };
  const clearState = () => {
    const dummyData = {
      full_name: "",
      phone: "",
      username: "",
      password: "",
    };
    setAllAdminData(dummyData);
    setSelectedValues("");
    setSelectedMenu([]);
  };
  const handleUpdateRow = async (rowData) => {
    setAddAdminSec(true);
    setIsUpdate(true);
    const dummyData = {
      full_name: rowData?.full_name,
      phone: rowData?.phone,
      username: rowData?.username,
      password: rowData?.password,
    };
    setAllAdminData(dummyData);
    setSelectedValues(rowData.role);
    setSelectedMenu(rowData.menu.split(","));
    setId(rowData?.id);
  };
  const handleDeleteRow = async () => {
    setIsDeleteLoading(true);
    const response = await axios.delete(`${apiUrl}/admin_management/${id}`);
    console.log("Delete Response", response);
    setIsDeleteLoading(false);
    setId(null);
    window.location.reload();
  };

  return (
    <>
      <Helmet>
        <title> Admin | DocGIS</title>
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
                {t("Admin Management")}
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
              {addAdminSec ? (
                <span></span>
              ) : (
                <Button
                  onClick={() => {
                    setAddAdminSec(true);
                    setIsUpdate(false);
                    setId(null);
                    clearState();
                  }}
                  variant="contained"
                  startIcon={<Iconify icon="eva:plus-fill" />}
                >
                  {t("Add New Admin")}
                </Button>
              )}
            </>
          )}
        </Stack>

        {/* --------------------------------------------------------------- This card section is for admin list starts here  ----------------------------------------------------------*/}

        {!addAdminSec && (
          <Card>
            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <MaterialTable
                  title=""
                  columns={[
                    {
                      title: t("ID"),
                      field: "id",
                    },
                    { title: t("Name"), field: "full_name" },
                    {
                      title: t("Phone"),
                      field: "phone",
                    },
                    { title: t("Username"), field: "username" },
                    // { title: "Password", field: "password" },
                    { title: t("Role"), field: "role" },
                  ]}
                  data={adminData}
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
                      tooltip: t("Edit Admin"),
                      onClick: (event, rowData) => {
                        handleUpdateRow(rowData);
                      },
                    },
                    (rowData) => ({
                      icon: tableIcons.Delete,
                      tooltip: t("Delete Admin"),
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
        {/* --------------------------------------------------------------- admin list end here --------------------------------------------------------------- */}

        {/* /.//.//.///./././././././././/./././././././././././././././././././././/./././././././././././././././././././..//././././././././././././. */}

        {/* --------------------------------------------------------------- Create Admin Form  ----------------------------------------------------------*/}
        {addAdminSec && (
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
                  required
                  id="outlined-required"
                  onChange={adminOnChange}
                  value={allAdminData?.full_name}
                  name="full_name"
                  label={isUpdate ? "" : t("Full Name")}
                />{" "}
                <br />
                <TextField
                  required
                  id="outlined-required"
                  type="number"
                  onChange={adminOnChange}
                  value={allAdminData?.phone}
                  name="phone"
                  label={isUpdate ? "" : t("Phone")}
                />{" "}
                <br />
                <TextField
                  required
                  id="outlined-required"
                  onChange={adminOnChange}
                  value={allAdminData?.username}
                  name="username"
                  label={isUpdate ? "" : t("Username")}
                />{" "}
                <br />
                <TextField
                  required
                  id="outlined-required"
                  onChange={adminOnChange}
                  value={allAdminData?.password}
                  name="password"
                  label={isUpdate ? "" : t("Password")}
                />{" "}
                <br />
                {/* <TextField required id="outlined-required" onChange={adminOnChange} name="Role" label="Role" /> <br /> */}
                <div>
                  <FormControl style={{ width: "60%", marginLeft: "10px" }}>
                    <InputLabel id="select-multiple-label">
                      {t("Select Role")}
                    </InputLabel>
                    <Select
                      labelId="select-multiple-label"
                      id="select-multiple"
                      label={t("Select Role")}
                      value={selectedValues}
                      onChange={handleSelectChange}
                      renderValue={(selected) => selected} // Display the selected values in the dropdown
                    >
                      {roleList.map((item) => {
                        return (
                          <MenuItem value={item.name}>{item.name}</MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                  {/* <Button style={{marginLeft:"20px",height:"55px"}} variant="contained" onClick={handleAddValues}>
                    Insert Selected Roles 
                  </Button> */}
                </div>
                <div>
                  <FormControl
                    style={{
                      width: "60%",
                      marginLeft: "10px",
                      marginTop: "1rem",
                    }}
                  >
                    <InputLabel id="select-multiple-label-menu">
                      {t("Select Menu")}
                    </InputLabel>
                    <Select
                      labelId="select-multiple-label-menu"
                      id="select-multiple"
                      label={t("Select Menu")}
                      multiple
                      value={selectedMenu}
                      onChange={handleMenuChange}
                      renderValue={(selected) => selected.join(", ")} // Display the selected values in the dropdown
                    >
                      {menuList.map((item) => {
                        return (
                          <MenuItem value={item.name}>
                            {item.name.toUpperCase()}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                  {/* <Button style={{marginLeft:"20px",height:"55px"}} variant="contained" onClick={handleAddValues}>
                    Insert Selected Roles 
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
                  onClick={() => submitToDB()}
                  variant="contained"
                >
                  {isLoading ? (
                    <CircularProgress color="success" size={18} />
                  ) : isUpdate ? (
                    t("Update Admin")
                  ) : (
                    t("Add Admin")
                  )}
                </Button>
                <Button
                  style={{
                    height: "50px",
                    margin: "10px",
                    marginBottom: "20px",
                    width: "230px",
                    background: "red",
                  }}
                  onClick={() => setAddAdminSec(false)}
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
                handleClose();
                setId(null);
              }}
            >
              Cancle
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
    </>
  );
};

export default AdminManagement;
