import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Iconify from "src/components/iconify/Iconify";
import {
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Container,
  Stack,
  Typography,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  IconButton,
  TableContainer,
  Modal,
  Box,
  CircularProgress,
} from "@mui/material";
import Scrollbar from "src/components/scrollbar/Scrollbar";
import InfoIcon from "@mui/icons-material/Info";
import moment from "moment";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, ContentState, convertFromRaw, convertToRaw } from "draft-js";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { tableIcons } from "src/constants/tableIcons";
import MaterialTable from "material-table";

const WorkflowManagement = () => {
  const { t } = useTranslation();
  const [initiarRole1, setInitiarRole1] = React.useState("");
  const [groupBy, setGroupBy] = React.useState("");
  const [county, setCounty] = React.useState("");
  const [selectedFinalApproval, setSelectedFinalApproval] = React.useState("");
  const [WorkflowData, setworkflowData] = React.useState([]);
  const [isChecked, setIsChecked] = React.useState(false);
  const [selectedForm, setSelectedForm] = React.useState("");
  const [selectedReviewer, setSelectedReviewer] = React.useState([]);
  const [inputValue, setInputValue] = React.useState("");
  const [adminData, setAdminData] = React.useState([]);
  const [userList, setUserList] = React.useState([]);
  const [userRole, setUserRole] = React.useState([]);
  const [editorState, setEditorState] = React.useState(() =>
    EditorState.createEmpty()
  );
  const [showCreateWorkflow, setShowCreateWorkflow] = useState(false);
  const [formOption, setFormOption] = React.useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedAdminUsers, setSelectedAdminUsers] = useState([]);
  const [groupSec, setGroupSec] = useState(false);
  const [wfGroup, setWFGroup] = useState("");
  const [adminList, setAdminList] = React.useState([]);
  const [groupByFetch, setGroupByFetch] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [id, setId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [canSubmit,setCanSubmit] = useState(false)
  const apiUrl = process.env.REACT_APP_BASE_URL;
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => {
    setId(null);
    setOpenModal(false);
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

  useEffect(() => {
    // Check if all values are not null or empty
    if (
      groupBy !== '' &&
      initiarRole1 !== '' &&
      selectedUsers.length > 0 &&
      selectedForm !== '' &&
      selectedReviewer !== '' &&
      selectedFinalApproval !== '' &&
      inputValue !== ''
    ) {
      setCanSubmit(true);
    } else {
      setCanSubmit(false);
    }
  }, [groupBy, initiarRole1, selectedUsers, selectedForm, selectedReviewer, selectedFinalApproval, inputValue]);

  const handleReviewerChange = (event) => {
    const { value } = event.target;
    setSelectedReviewer(value); // Set the selected reviewers as an array of values
  };

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  React.useEffect(() => {
    fetchGroupByWf();
    getworkflow();
    getAdminDB();
    getFormList();
    getRole();
  }, []);

  React.useEffect(() => {
    if (initiarRole1 !== "") {
      axios
        .get(`${apiUrl}/user/${initiarRole1}`)
        .then((res) => {
          // console.log(res.data);
          const options = res.data.map((item) => ({
            label: `${item.Fname} ${item.Lname}`,
            value: `${item.u_id} - ${item.Fname} ${item.Lname}`,
          }));
          setSelectedUsers(options.map((i) => i.value));
          setUserList(options);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [initiarRole1]);

  const fetchGroupByWf = () => {
    axios
      .get(`${apiUrl}/group_by`)
      .then((res) => {
        // console.log("GRUAASD",res.data);
        setGroupByFetch(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getAdminDB = async () => {
    try {
      const response = await axios.get(`${apiUrl}/admin_management`);
      // console.log(response.data);
      const options = response.data.map((item) => ({
        label: item.full_name,
        value: item.username,
      }));
      setAdminList(options);
      // setSelectedAdminUsers(options.map((i) => i.value));

      await setAdminData(response.data);
    } catch (error) {
      // Handle errors
      console.error(error);
    }
  };

  const getworkflow = async () => {
    try {
      const response = await axios.get(`${apiUrl}/workflow`);
      // console.log(response.data);
      const sortedData = response.data.sort((a, b) => {
        // Assuming the timestamp field is named "timestamp"
        const timestampA = new Date(a.timestamp);
        const timestampB = new Date(b.timestamp);
        return timestampB - timestampA; // Sort in descending order
      });
      console.log("sortedData", sortedData);
      const dummyData = sortedData.map((item, index) => ({
        id: item?.id,
        group_by: item.group_by,
        initiator_role: item?.initiator_role,
        workflow_prefix: item?.workflow_prefix,
        form_name: item?.form_name,
        timestamp: moment(item?.timestamp).format("MMM Do YY | h:mm A"),
        wfStatus: item?.wfStatus.toUpperCase(),
        admin_users: item?.admin_users,
        reviewer: item?.reviewer,
        final_approval: item?.final_approval,
        pdfContent: item?.pdfContent,
      }));
      console.log("dummyData", dummyData);
      await setworkflowData(dummyData);
    } catch (error) {
      // Handle errors
      console.error(error);
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
  const getFormList = async () => {
    try {
      const response = await axios.get(`${apiUrl}/tables`);
      let tables = response.data?.tables
        ?.filter((item) => item.split("_")[0] === "form")
        ?.map((item) => {
          return { value: item, lable: item.split("_")[1] };
        });
      // console.log(tables);
      setFormOption(tables);
    } catch (error) {
      // Handle errors
      console.error(error);
    }
  };

  const handleFormChange = (event) => {
    setSelectedForm(event.target.value);
  };

  const submitToDB = async () => {
    setIsLoading(true);
    const status = selectedReviewer?.map((i, index) => {
      return {
        name: i,
        s_no: index + 1,
        status: "pending",
      };
    });
    // let doc = await uploadFile();
    let adminFlag = `${selectedAdminUsers?.length > 0 ? "True" : "False"}`;
    let initiator_data = [];
    let admin_data = [];
    selectedUsers?.map((item) => {
      initiator_data?.push({
        name: item,
        reviewer: selectedReviewer?.map((i, index) => ({
          sn: index + 1,
          name: i,
          status: "False",
        })),
        userStatus: "False",
        finalStatus: "False",
      });
    });

    selectedAdminUsers?.map((item) => {
      admin_data.push({
        name: item,
        reviewer: selectedReviewer?.map((i, index) => ({
          sn: index + 1,
          name: i,
          status: "False",
        })),
        adminStatus: "False",
        finalStatus: "False",
      });
    });
    let pdfText = handleGeneratePDF();
    const data = {
      initiator_role: initiarRole1,
      admin_users: selectedAdminUsers?.toString(),
      initiator_users: selectedUsers?.toString(),
      workflow_prefix: inputValue,
      form_name: selectedForm,
      reviewer: selectedReviewer?.toString(),
      final_approval: selectedFinalApproval,
      group_by: groupBy,
      county,
      documents: "",
      timestamp: `${new Date()}`,
      admin: adminFlag,
      status: JSON.stringify(status),
      wfStatus: "pending",
      initiator_status: JSON.stringify(initiator_data),
      admin_status: JSON.stringify(admin_data),
      pdfContent: pdfText,
    };
    if (isUpdate) {
      axios
        .put(`${apiUrl}/workflow-update/${id}`, data)
        .then((res) => {
          console.log("Edit Response", res);
          clearState();
          alert("Updated Successfully");
          window.location.reload();
          getworkflow();
          setIsLoading(false);
        })
        .catch((err) => {
          console.log("Error", err);
        });
    } else {
      
            axios
        .post(`${apiUrl}/workflow`, data)
        .then((response) => {
          clearState();
          getworkflow();
          alert("Added Successfully");
          window.location.reload();
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error)
          alert("Something went wrong");
        });
        
       console.log(data)
    }
  };

  const handleSelectChange = (event) => {
    const { value } = event.target;
    setSelectedUsers(value);
  };
  const handleAdminSelectChange = (event) => {
    const { value } = event.target;
    setSelectedAdminUsers(value);
  };

  const uploadGroup = () => {
    axios
      .post(`${apiUrl}/group_by`, { groupBy: wfGroup })
      .then((response) => {
        setWFGroup("");
        alert("Added Successfully");
        window.location.reload();
      })
      .catch((error) => {
        alert("Something went wrong");
      });
    // console.log("GROUP NAME", wfGroup);
  };

  const handleGeneratePDF = () => {
    const contentState = editorState.getCurrentContent();
    const contentRaw = convertToRaw(contentState);
    const contentHTML = draftToHtml(contentRaw);
  
    if (contentHTML) {
      return contentHTML;
    } else {
      return "";
    }
  }; 

  const clearState = () => {
    setId(null);
    setIsUpdate(false);
    setInputValue("");
    setSelectedAdminUsers([]);
    setSelectedForm("");
    setSelectedReviewer([]);
    setSelectedFinalApproval("");
    setEditorState(EditorState.createEmpty());
    setIsChecked(false);
  };
  const handleUpdateRow = async (rowData) => {
    setShowCreateWorkflow(true);
    setId(rowData?.id);
    setIsUpdate(true);
    console.log("rowData", rowData);
    setGroupBy(rowData?.group_by);
    setInitiarRole1(rowData?.initiator_role);
    setInputValue(rowData?.workflow_prefix);
    setSelectedAdminUsers(rowData?.admin_users.split(", "));
    setSelectedForm(rowData?.form_name);
    setSelectedReviewer(rowData?.reviewer.split(", "));
    setSelectedFinalApproval(rowData?.final_approval);
    
    if (rowData?.pdfContent?.length > 1) {
      setIsChecked(true);
      const blocksFromHtml = htmlToDraft(rowData?.pdfContent);
const { contentBlocks, entityMap } = blocksFromHtml;
const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);

      const newEditorState = EditorState.createWithContent(contentState);
      setEditorState(newEditorState);
    }
  };
  const handleDeleteRow = () => {
    setIsDeleteLoading(true);
    axios
      .delete(`${apiUrl}/workflow/${id}`)
      .then((res) => {
        console.log("Delete Response", res);
        setIsDeleteLoading(false);
        setId(null);
        handleClose();
        getworkflow();
        //  window.location.reload();
      })
      .catch((err) => {
        setIsDeleteLoading(false);
        console.log("Error", err);
      });
  };

  return (
    <>
      <Helmet>
        <title>WorkflowManagement</title>
      </Helmet>
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          {/* <Typography variant="h4" gutterBottom>
            {t("Workflow Management")}
          </Typography> */}

          {!showCreateWorkflow ? (
            <>
              {!groupSec && (
                <>
                  <Button
                    variant="contained"
                    onClick={() => {
                      setShowCreateWorkflow(true);
                      setId(null);
                      setIsUpdate(false);
                    }}
                    startIcon={<Iconify icon="eva:plus-fill" />}
                  >
                    {t("Add Workflow")}
                  </Button>

                  <Button
                    style={{ width: "180px", height: "40px" }}
                    onClick={() => setGroupSec(true)}
                    variant="contained"
                    color="success"
                  >
                    {t("Create Group")}
                  </Button>
                </>
              )}
              {groupSec && (
                <>
                  <TextField
                    onChange={(e) => setWFGroup(e.target.value)}
                    required
                    id="outlined-required"
                    type="text"
                    value={wfGroup}
                    name="wfGroup"
                    label={t("Create Group")}
                    style={{ width: "400px" }}
                  />
                  <Button
                    style={{ width: "180px", height: "40px" }}
                    onClick={() => uploadGroup()}
                    variant="contained"
                    color="success"
                  >
                    {t("Add Group")}
                  </Button>
                  <Button
                    onClick={() => {
                      setGroupSec(false);
                      setWFGroup("");
                    }}
                    variant="contained"
                    style={{
                      width: "180px",
                      height: "40px",
                      background: "red",
                    }}
                  >
                    {t("Cancel")}
                  </Button>
                </>
              )}
            </>
          ) : (
            <Button
              variant="contained"
              onClick={() => setShowCreateWorkflow(false)}
              style={{ background: "red", width: "150px" }}
            >
              {t("Cancel")}
            </Button>
          )}
        </Stack>

        {showCreateWorkflow ? (
          <Card>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={12}>
                  <FormControl fullWidth>
                    <InputLabel id="group_by">{t("Group By")}</InputLabel>
                    <Select
                      labelId="Group By"
                      id="group_by"
                      value={groupBy}
                      onChange={(e) => setGroupBy(e.target.value)}
                    >
                      {groupByFetch?.map((item) => {
                        return (
                          <MenuItem value={item?.groupBy}>
                            {item?.groupBy}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={8} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id="Initiator Role">
                      {t("Initiator Role")}
                    </InputLabel>
                    <Select
                      labelId="Initiator Role"
                      id="Initiator Role"
                      value={initiarRole1}
                      onChange={(event) => setInitiarRole1(event.target.value)}
                    >
                      {userRole?.map((item) => {
                        return (
                          <MenuItem value={item.role}>{item.role}</MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={4} sm={6}>
                  <TextField
                    label={t("Workflow Prefix")}
                    value={inputValue}
                    fullWidth
                    onChange={(e) => setInputValue(e.target.value)}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={12}>
                  <FormControl fullWidth>
                    <InputLabel id="initiator-role2">
                      {t("Initiator all Users")}
                    </InputLabel>
                    <Select
                      labelId="initiator-role2"
                      id="initiator-role2"
                      multiple
                      value={selectedUsers}
                      onChange={handleSelectChange}
                      // renderValue={(selected) => selected.join(", ")}
                    >
                      {userList?.map((item) => (
                        <MenuItem key={item.value} value={item.value}>
                          <Checkbox
                            checked={selectedUsers.includes(item.value)}
                          />
                          {item.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id="admin-users">
                      {t("Admin all Users")}
                    </InputLabel>
                    <Select
                      labelId="admin-users"
                      id="admin-users"
                      multiple
                      value={selectedAdminUsers}
                      onChange={handleAdminSelectChange}
                      renderValue={(selected) => selected.join(", ")}
                    >
                      {adminList?.map((item) => (
                        <MenuItem key={item.value} value={item.value}>
                          <Checkbox
                            checked={selectedAdminUsers.includes(item.value)}
                          />
                          {item.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={12}>
                  <FormControl fullWidth>
                    <InputLabel id="form-select-label">
                      {t("Choose a Form")}
                    </InputLabel>
                    <Select
                      labelId="form-select-label"
                      id="form-select"
                      value={selectedForm}
                      onChange={handleFormChange}
                      style={{ textTransform: "capitalize" }}
                    >
                      {formOption.map((form) => (
                        <MenuItem
                          value={form.value}
                          style={{ textTransform: "capitalize" }}
                        >
                          {form.lable}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={12}>
                  <FormControl fullWidth>
                    <InputLabel id="Reviewer">
                      {t("Select Multiple Reviewers")}
                    </InputLabel>
                    <Select
                      labelId="Reviewer"
                      id="Reviewer"
                      value={selectedReviewer}
                      onChange={handleReviewerChange}
                      multiple
                    >
                      {adminData?.map((item) => {
                        return (
                          <MenuItem value={item?.username}>
                            {item?.full_name}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={12}>
                  <FormControl fullWidth>
                    <InputLabel id="Final Approval">
                      {t("Final Approval Role")}
                    </InputLabel>
                    <Select
                      labelId={t("Final Approval")}
                      id="Final Approval"
                      value={selectedFinalApproval}
                      onChange={(e) => setSelectedFinalApproval(e.target.value)}
                    >
                      {adminData?.map((item) => {
                        return (
                          <MenuItem value={item?.username}>
                            {item?.full_name}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                      />
                    }
                    label={t("Have PDF Document")}
                  />
                  {isChecked && (
                    <>
                      <IconButton
                        aria-label="delete"
                        onClick={() => setOpen(true)}
                      >
                        <InfoIcon />
                      </IconButton>

                      <div
                        style={{
                          width: "800px",
                          height: "500px",
                          border: "1px solid #ccc",
                          overflow: "scroll",
                        }}
                      >
                        <Editor
                          editorState={editorState}
                          onEditorStateChange={(newEditorState) =>
                            setEditorState(newEditorState)
                          }
                          wrapperClassName="wrapper-class"
                          editorClassName="editor-class"
                          toolbarClassName="toolbar-class"
                        />
                        {/* <button onClick={handleGeneratePDF}>Download PDF</button> */}
                      </div>
                    </>
                  )}
                </Grid>
              </Grid>
            </CardContent>
            <Button
              style={{
                height: "50px",
                margin: "10px",
                marginBottom: "20px",
                width: "230px",
                background: "green",
              }}
              disabled={!canSubmit}
              onClick={() => submitToDB()}
              variant="contained"
            >
              {isLoading ? (
                <CircularProgress sx={{ color: "white" }} size={22} />
              ) : isUpdate ? (
                t("Update Workflow")
              ) : (
                t("Add Workflow")
              )}
            </Button>
          </Card>
        ) : (
          <Card>
            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <MaterialTable
                  title=""
                  columns={[
                    {
                      title: "SL NO",
                      field: "id",
                    },
                    { title: "GroupBy", field: "group_by" },
                    {
                      title: "Initiator Role",
                      field: "initiator_role",
                    },
                    { title: "Workflow Prefix", field: "workflow_prefix" },
                    { title: "Form Id", field: "form_name" },
                    { title: "Created On", field: "timestamp" },
                    { title: "Status", field: "wfStatus" },
                  ]}
                  data={WorkflowData}
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
                      tooltip: "Edit Workflow",
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
                      disabled: false,
                    }),
                  ]}
                />
              </TableContainer>
            </Scrollbar>
          </Card>
        )}
        <Modal open={open} onClose={() => setOpen(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              minWidth: 400,
              maxWidth: 600,
            }}
          >
            <Typography variant="h5">Details of variables</Typography>
            <Typography variant="body1">{`{{ID}}`} for User ID</Typography>
            <Typography variant="body1">{`{{UserName}}`} for user name{" "}</Typography>
            <Typography variant="body1">{`{{Name}}`} for first name</Typography>
            <Typography variant="body1">{`{{LName}}`} for last name</Typography>
            <Typography variant="body1">{`{{Address}}`} for Address</Typography>
            <Typography variant="body1">{`{{City}}`} for city</Typography>
            <Typography variant="body1">{`{{Country}}`} for country</Typography>
            <Typography variant="body1">{`{{Role}}`} for role </Typography>
          </Box>
        </Modal>
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
              Do you really want to delete this workflow?
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
      </Container>
    </>
  );
};

export default WorkflowManagement;
