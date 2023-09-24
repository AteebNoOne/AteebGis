import React, { useEffect, useState } from "react";
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
  TableContainer,
  Modal,
  CircularProgress,
} from "@mui/material";
import { Helmet } from "react-helmet-async";
import Iconify from "src/components/iconify/Iconify";
import Scrollbar from "src/components/scrollbar/Scrollbar";
import Box from "@mui/material/Box";
import axios from "axios";
import "./forms.css";
import { useTranslation } from "react-i18next";
import { tableIcons } from "src/constants/tableIcons";
import MaterialTable from "material-table";

const types = ["VARCHAR", "INTEGER", "FLOAT", "DATE", "BOOLEAN"]; // Available types for dropdown
const selection = [
  "INPUT_TEXT",
  "INPUT_NUMBER",
  "INPUT_DATE",
  "SELECT_LIST",
  "RADIO_BUTTON",
  "SELECT_IMAGE",
];

const CreateForms = () => {
  const { t } = useTranslation();
  const [rows, setRows] = useState([
    {
      name: "",
      type: "VARCHAR",
      lengthValues: "",
      acceptNull: false,
      selection: "",
    },
  ]);
  const [createForm, setCreateForm] = useState(false);
  const [tableName, setTableName] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [tableE, setTableE] = useState(false);
  const [nameE, setNameE] = useState(false);
  const [lengthE, setLengthE] = useState(false);
  const [selectionE, setSelectionE] = useState(false);
  const [btnD, setBtnD] = useState(true);
  const [forms, setForms] = useState([]);
  const [columns, setColumns] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOpenModal(false);
    setFormName(null);
  };
  const [formName, setFormName] = useState(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const handleOpenDetailModal = () => setOpenDetailModal(true);
  const handleCloseDetailModal = () => {
    setOpenDetailModal(false);
  };
  const apiUrl = process.env.REACT_APP_BASE_URL;
  const detailsStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    height: "90%",
    maxHeight: "90%",
    overflowY: "auto",
    bgcolor: "background.paper",
    borderRadius: "8px",
    boxShadow: 24,
    p: 4,
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
  const handleRowChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };
  const getForms = () => {
    setIsLoading(true);
    axios
      .get(`${apiUrl}/tables`)
      .then((res) => {
        let filteredData = res?.data?.tables?.map((form, index) => ({
          id: index + 1,
          formName: form,
        }));
        setForms(filteredData);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log("Error", err);
      });
  };
  useEffect(() => {
    getForms();
  }, []);

  const handleAddMore = () => {
    let checkF = submitValuesCheck();
    checkF &&
      setRows([
        ...rows,
        {
          name: "",
          type: "VARCHAR",
          lengthValues: "",
          acceptNull: false,
          selection: "",
        },
      ]);
    setBtnD(false);
  };

  const submitValuesCheck = () => {
    setTableE(false);
    setNameE(false);
    setLengthE(false);
    setSelectionE(false);
    if (tableName === "") {
      setTableE(true);
      alert("The TableName should not be empty");
      return false;
    }
    if (/\s/.test(tableName)) {
      setTableE(true);
      alert("The TableName should not contain spaces");
      alert("HINT : You can do Table_Name");
      return false;
    }
    const lastRow = rows[rows.length - 1];
    if (lastRow.name === "") {
      setNameE(true);
      alert("Row Name should not be empty");
      return false;
    }
    if (/\s/.test(lastRow.name)) {
      setNameE(true);
      alert("Row Name should not contain spaces");
      alert("HINT : You can do Row_Name");
      return false;
    }
    if (lastRow.lengthValues === "") {
      setLengthE(true);
      alert("Please Submit Length");
      return false;
    }
    if (lastRow.selection === "") {
      setSelectionE(true);
      alert("Please Select Selection");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    let formDetails = rows.map((item) => {
      let opt = [];
      for (var key in item) {
        if (key.split("_")[0] == "options") {
          console.log(key + ":", item[key]);
          opt.push(item[key]);
        }
      }
      return {
        name: item.name,
        type: item.selection,
        selected_inputs: opt,
        isrequired: item.acceptNull,
      };
    });
    console.log(formDetails);
    let finalData = {
      name: `form_${tableName}`,
      inputs: JSON.stringify(
        formDetails.map((item) => ({
          name: item.name,
          type: item.type,
          isRequired: item.isrequired,
        }))
      ),
      select_vlaues: JSON.stringify(
        formDetails.map((item) => ({
          name: item.name,
          options: item.selected_inputs,
        }))
      ),
    };
    let q = rows.map((item) => {
      return `${item.name} ${item.type}${
        item?.lengthValues !== "" ? `(${item?.lengthValues})` : ""
      } ${item?.acceptNull ? 'null' : 'not null'}`;
    });
    q.push("workflow VARCHAR(250) null");
    q.push("userid VARCHAR(250) null");
    q.push("ApprovedBy VARCHAR(2000) null");
    q.push("RejectedBy VARCHAR(2000) null");
    q.push("finalApproval VARCHAR(20) DEFAULT 'None'");

  
    let columns = `id SERIAL PRIMARY KEY, ${q.join(', ')}`;
    console.log("columns", columns);
  
    try {
      const response = await axios.post(`${apiUrl}/create-table`, {
        tableName: `form_${tableName}`,
        columns,
      });
  
      console.log('Table creation Response:', response.data);
  
      try{
        const insertResponse = await axios.post(`${apiUrl}/formdetails`, finalData);
        console.log('Data Insertion Response:', insertResponse.data.message);
        alert(insertResponse.data.message);
        setRows([{ name: "", type: "", lengthValues: "", acceptNull: false }]);
        setTableName("");
      }
      catch(err){
        console.log(err)
      }
    } catch (error) {
      console.error("Error:", error.response.data);
      alert("Failed to create table or insert data.");
    }
  };
  
  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleDeleteOption = () => {
    if (options.length > 2) {
      setOptions(options.slice(0, -1));
    }
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const handleDetails = (rowData) => {
    handleOpenDetailModal();
    axios
      .get(`${apiUrl}/tables/${rowData?.formName}`)
      .then((res) => {
        console.log("Columns Response", res.data);
        let filteredData = res?.data?.columns.map((val, index) => ({
          id: index + 1,
          column: val?.column,
          dataType: val?.dataType,
        }));
        setColumns(filteredData);
      })
      .catch((err) => {
        console.log("Error", err);
      });
  };

  const handleDeleteRow = async () => {
    if (formName && !isDeleteLoading) {
      setIsDeleteLoading(true);
      const response = await axios.delete(`${apiUrl}/delete-table/${formName}`);
      console.log("Delete Response", response);
      setFormName(null);
      setIsDeleteLoading(false);
      window.location.reload();
    }
  };

  return (
    <>
      <Helmet>
        <title>CreateForms</title>
      </Helmet>
      <Container>
        {createForm ? (
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mb={5}
          >
            <Typography variant="h4" gutterBottom>
              {t("Create Forms")}
            </Typography>
            <Button
              variant="contained"
              onClick={() => setCreateForm(false)}
              startIcon={<Iconify icon="eva:minus-fill" />}
            >
              {t("Cancel")}
            </Button>
          </Stack>
        ) : (
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mb={5}
          >
            <Typography variant="h4" gutterBottom>
              {/* {t('Forms')} */}
            </Typography>
            <Button
              variant="contained"
              onClick={() => setCreateForm(true)}
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              {t("Add New Form")}
            </Button>
          </Stack>
        )}
        {createForm ? (
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
                    <Grid item xs={12}>
                      <TextField
                        style={{ width: "98%", marginBottom: "50px" }}
                        label={t("Enter Table Name")}
                        value={tableName}
                        error={tableE}
                        onChange={(e) => setTableName(e.target.value)}
                        required
                      />
                    </Grid>
                  </Grid>
                  {rows.map((row, index) => (
                    <div key={index} className="form">
                      <div className="form-row">
                        <Grid container>
                          <Grid item xs={6}>
                            <TextField
                              label={t("Name")}
                              value={row.name}
                              error={nameE}
                              onChange={(e) =>
                                handleRowChange(index, "name", e.target.value)
                              }
                              style={{ width: "95%", marginLeft: 0 }}
                              required
                            />
                          </Grid>

                          {/* <Grid item xs={2}>
                          <FormControl
                            fullWidth
                            style={{ marginTop: "8px", width: "14vh" }}
                          >
                            <InputLabel>{t("Type")}</InputLabel>
                            <Select
                              value={row.type}
                              onChange={(e) =>
                                handleRowChange(index, "type", e.target.value)
                              }
                              required
                            >
                              {types.map((option) => (
                                <MenuItem key={option} value={option}>
                                  {option}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid> */}

                          <Grid item xs={6}>
                            <TextField
                              style={{ marginTop: "7px", width: "95%" }}
                              label={t("Length/Values")}
                              value={row.lengthValues}
                              error={lengthE}
                              onChange={(e) =>
                                handleRowChange(
                                  index,
                                  "lengthValues",
                                  e.target.value
                                )
                              }
                              fullWidth
                              required
                            />
                          </Grid>

                          <Grid item xs={6}>
                            <FormControl
                              fullWidth
                              style={{ marginTop: "8px", width: "95%" }}
                              error={selectionE}
                              required
                            >
                              <InputLabel>{t("Selection")}</InputLabel>
                              <Select
                                value={row.selection}
                                onChange={(e) =>
                                  handleRowChange(
                                    index,
                                    "selection",
                                    e.target.value
                                  )
                                }
                                required
                              >
                                {selection.map((option) => (
                                  <MenuItem key={option} value={option}>
                                    {option}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>

                          <Grid item xs={6}>
                            <FormControlLabel
                              style={{ width: "40%", paddingTop: "12px" }}
                              control={
                                <Checkbox
                                  checked={row.acceptNull}
                                  onChange={(e) =>
                                    handleRowChange(
                                      index,
                                      "acceptNull",
                                      e.target.checked
                                    )
                                  }
                                />
                              }
                              label={t("Accept Null Values")}
                            />
                          </Grid>
                          {(rows[index]?.selection == "SELECT_LIST" ||
                            rows[index]?.selection == "RADIO_BUTTON") && (
                            <Grid item xs={12}>
                              {options.map((option, ind) => (
                                <TextField
                                  key={index}
                                  style={{ width: "98%" }}
                                  label="Enter Option to Choose"
                                  required
                                  value={rows[`options${ind}${index}`]}
                                  // onChange={(e) =>
                                  //   handleOptionChange(ind, e.target.value)
                                  // }
                                  onChange={(e) =>
                                    handleRowChange(
                                      index,
                                      `options_${ind}${index}`,
                                      e.target.value
                                    )
                                  }
                                />
                              ))}
                              <Button
                                style={{
                                  marginRight: "50px",
                                  width: "15vh",
                                  margin: "3vh 0 0 1vh",
                                }}
                                variant="contained"
                                color="primary"
                                className="addmore-button"
                                onClick={handleAddOption}
                              >
                                Add More Options
                              </Button>
                              <Button
                                style={{
                                  marginRight: "50px",
                                  width: "15vh",
                                  margin: "3vh 0 0 2vh",
                                }}
                                variant="outlined"
                                color="error"
                                className="addmore-button"
                                onClick={handleDeleteOption}
                              >
                                Delete
                              </Button>
                            </Grid>
                          )}
                        </Grid>
                      </div>

                      {index === rows.length - 1 && (
                        <div
                          style={{
                            textAlign: "center",
                            paddingTop: "40px",
                            paddingBottom: "20px",
                          }}
                          className="button-row"
                        >
                          <Button
                            style={{ marginRight: "50px", width: "150px" }}
                            variant="contained"
                            color="primary"
                            onClick={handleAddMore}
                            className="addmore-button"
                          >
                            {t("Add More")}
                          </Button>
                          <Button
                            style={{ width: "150px" }}
                            variant="contained"
                            color="primary"
                            type="button"
                            disabled={btnD}
                            className="submit-button"
                            onClick={() => handleSubmit()}
                          >
                            {t("Submit")}
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {/* <Button color="success" variant="contained">
                Create Form
              </Button> */}
              </Box>
            </Scrollbar>
          </Card>
        ) : (
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <MaterialTable
                title=""
                columns={[
                  {
                    title: "SL NO",
                    field: "id",
                  },
                  { title: " FORM NAME", field: "formName" },
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
                data={forms}
                icons={tableIcons}
                options={{
                  search: true,
                  sorting: true,
                  pageSize: 5,
                  paging: true,
                  actionsColumnIndex: -1,
                }}
                actions={[
                  (rowData) => ({
                    icon: tableIcons.Delete,
                    tooltip: "Delete User",
                    onClick: (event, rowData) => {
                      handleOpenModal();
                      setFormName(rowData?.formName);
                    },
                    disabled: false,
                  }),
                ]}
              />
            </TableContainer>
          </Scrollbar>
        )}
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
            Do you really want to delete this form?
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
                setFormName(null);
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
              Form Details
            </Typography>
            <Button
              variant="contained"
              size="medium"
              color="error"
              onClick={() => {
                handleCloseDetailModal();
              }}
            >
              Cancle
            </Button>
          </Box>
          <TableContainer>
            <MaterialTable
              title=""
              columns={[
                {
                  title: "Form Id",
                  field: "id",
                },
                {
                  title: "Column",
                  field: "column",
                },
                { title: "Data Type", field: "dataType" },
              ]}
              data={columns}
              icons={tableIcons}
              options={{
                search: false,
                sorting: true,
                paging: false,
              }}
            />
          </TableContainer>
        </Box>
      </Modal>
    </>
  );
};

export default CreateForms;
