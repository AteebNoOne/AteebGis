import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Card,
  Container,
  Stack,
  Typography,
  Button,
  Modal,
} from "@mui/material";
import Divider from "@mui/material/Divider";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useTranslation } from "react-i18next";
import axios from "axios";
import moment from "moment";

const FinalApproval = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [wfSection, setWfSection] = useState(false);
  const [allData, setAllData] = useState([]);
  const [workFlowD, setWorkFlowD] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const [statusCheck, setStatusCheck] = useState([]);
  const [adminLocal, setAdminLocal] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allRevs, setAllRevs] = useState([]);
  const apiUrl = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    fetchReviewerData();
  }, []);

  const fetchReviewerData = async () => {
    let adminData = localStorage.getItem("adminInfo");
    let adminUserName = JSON.parse(adminData);
    setAdminLocal(adminUserName?.username);
    console.log("adminUserName?.username.data", adminUserName?.username);
    try {
      const response = await axios.get(
        `${apiUrl}/workflow-final-approval/${adminUserName?.username}`
      );
      console.log("response.data", response.data);
      setAllData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const selectWf = async (item) => {
    // console.log("item", item);
    await setWorkFlowD(item);
    let allUD = parseData(item.initiator_users);
    // console.log("allUD", allUD);
    await setAllUsers(allUD);
    console.log("allUD", allUD);

    let statusD = StatusParseData(item?.initiator_status);
    setStatusCheck(statusD);
    // console.log("item.initiator_status",item?.initiator_status);
    console.log("statusD", statusD);

    setWfSection(true);
  };

  const parseData = (data) => {
    // Split the data string by comma and iterate over the resulting array
    const items = data.split(",");
    const formattedData = [];

    items.forEach((item) => {
      // Split each item by the dash (-) to separate ID and name
      const [id, name] = item.trim().split(" - ");
      formattedData.push({ id, name });
    });

    return formattedData;
  };

  const StatusParseData = (responseData) => {
    const parsedData = JSON.parse(responseData);
    // console.log("parsedData", responseData);

    const formattedData = parsedData.map((item) => {
      const idNameParts = item.name.split(" - ");
      const id = idNameParts[0];
      const name = idNameParts[1];
      const userStatus = item.userStatus;
      const reviewers = item.reviewer.map((reviewer) => {
        const { sn, name, status } = reviewer;
        return { sn, name, status };
      });

      const finalStatus = item.finalStatus;

      return { id, name, reviewers, finalStatus, userStatus };
    });

    return formattedData;
  };


  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Helmet>
        <title>Final Approval Panel</title>
      </Helmet>
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Final Approval Panel
          </Typography>
          {wfSection && (
            <Button
              onClick={() => setWfSection(false)}
              style={{ background: "red", width: "12vh" }}
              variant="contained"
            >
              {t("Close")}
            </Button>
          )}
        </Stack>
        <Card>
          {wfSection ? (
            <div>
              <TableContainer component={Paper}>
                <h3 style={{ textAlign: "center" }}>Workflow Details</h3>
                <Table sx={{ minWidth: 650 }} aria-label="caption table">
                  {/* <caption>Workflow Details</caption> */}
                  <TableHead>
                    <TableRow>
                      <TableCell>Group By</TableCell>
                      <TableCell align="left">Workflow Prefix</TableCell>
                      <TableCell align="left">Form Chosen</TableCell>
                      <TableCell align="left">All Reviewers</TableCell>
                      <TableCell align="left">Final Approval</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        {workFlowD?.group_by}
                      </TableCell>
                      <TableCell align="left">
                        {workFlowD?.workflow_prefix}
                      </TableCell>
                      <TableCell align="left">{workFlowD?.form_name}</TableCell>
                      <TableCell align="left">{workFlowD?.reviewer}</TableCell>
                      <TableCell align="left">
                        {workFlowD?.final_approval}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                {/* Users Table here with the View button */}

                <h3 style={{ textAlign: "center", padding: "2vh" }}>
                  Initiators Lists
                </h3>
                <Table sx={{ minWidth: 650 }} aria-label="caption table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">User ID</TableCell>
                      <TableCell align="center">User Full Name</TableCell>
                      <TableCell align="center">Status</TableCell>
                      <TableCell align="center">Review</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {allUsers?.map((item, index) => {
                      return (
                        <TableRow>
                          <TableCell align="center" component="th" scope="row">
                            {item?.id}
                          </TableCell>
                          <TableCell align="center">{item?.name}</TableCell>

                          <TableCell align="center">
                            {statusCheck?.map((statt) => {
                              if (
                                item?.id === statt?.id &&
                                statt.finalStatus === "False" &&
                                statt.userStatus === "False"
                              ) {
                                return (
                                  <Button
                                    variant="contained"
                                    color="info"
                                    // onClick={()=>openModal(rev)}
                                  >
                                    Waiting
                                  </Button>
                                );
                              } else if (
                                item?.id === statt?.id &&
                                statt.finalStatus === "False" &&
                                statt.userStatus === "True"
                              ) {
                                return (
                                  <Button variant="contained" color="warning">
                                    Pending
                                  </Button>
                                );
                              } else if (
                                item?.id === statt?.id &&
                                statt.finalStatus === "False" &&
                                statt.userStatus === "Rejected"
                              ) {
                                return (
                                  <Button variant="contained" color="error">
                                    Rejected
                                  </Button>
                                );
                              } else if (item?.id === statt?.id) {
                                return (
                                  <Button variant="contained" color="success">
                                    Reviewed
                                  </Button>
                                );
                              }
                            })}
                          </TableCell>

                          <TableCell align="center">
                            <Button
                              variant="outlined"
                              onClick={() => {
                                localStorage.setItem(
                                  "wftobereview",
                                  JSON.stringify(workFlowD)
                                );
                                navigate(
                                  `/dashboard/finalDetails/${workFlowD?.id}&${workFlowD?.form_name}&${item?.id}`
                                );
                              }}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          ) : (
            <>
              <TableContainer>
                <Table style={{ overflow: "scroll" }}>
                  <TableHead>
                    {allData.length > 0 &&
                      allData?.map((item, index) => {
                        return (
                          <>
                            <TableRow onClick={() => selectWf(item)}>
                              <TableCell>{index + 1}.</TableCell>
                              <TableCell>
                                <AccountTreeOutlinedIcon />
                              </TableCell>
                              <TableCell style={{ fontWeight: "bold" }}>
                                {item?.workflow_prefix.toUpperCase()}
                              </TableCell>
                              <TableCell>
                                {moment(item?.timestamp).format(
                                  "MMMM Do YYYY | h:mm A"
                                )}
                              </TableCell>
                              <TableCell>
                                {item?.wfStatus.toUpperCase()}
                              </TableCell>
                            </TableRow>
                            <Divider style={{ margin: "2px" }} />
                          </>
                        );
                      })}
                  </TableHead>
                </Table>
              </TableContainer>
            </>
          )}
        </Card>
      </Container>
    </>
  );
};

export default FinalApproval;
