// UserWorkFlow.js
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card, Container, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Table, TableContainer, TableHead, TableBody, TableCell, TableRow } from "@material-ui/core";
import { Button } from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";
import ImageViewComponent from "./ImageView";


const UserWorkFlow = () => {
  const navigate = useNavigate();
  const { uid } = useParams();
  const [fData, setFData] = useState([]);
  const [wfD, setWfD] = useState({});
  const [btnEnable, setEnable] = useState(false);
  const [var_myName, setVarMyName] = useState("");
  const [var_myUname, setVarMyUname] = useState("");
  const [var_mySign, setVarMySign] = useState("");
  const apiUrl = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    getData();
  }, []);

  const callARApi = async (id, data) => {
    try {
      const url = `${apiUrl}/reviewer-approval/${wfD.form_name}/${id}`;
      const response = await axios.put(url, data);
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error; 
    }
  };


  const handleApprove = async (id) => {
    const username = var_myUname;
    const approvalStatus = "approved";
    const data = { username, approvalStatus };

    try {
      await callARApi(id, data);
      await getData();
    } catch (error) {
      console.error("Error Approving:", error);
    }
  };

  const handleReject = async (id) => {
    const username = var_myUname;
    const approvalStatus = "rejected";
    const data = { username, approvalStatus };

    try {
      await callARApi(id, data);
      await getData();
    } catch (error) {
      console.error("Error Rejecting:", error);
    }
  };


  const getData = async () => {
    let adminD = localStorage.getItem("adminInfo");
    let finalAdminD = JSON.parse(adminD);
    console.log("HERE : I WANT :: ", finalAdminD)
    setVarMyName(finalAdminD?.full_name);
    setVarMyUname(finalAdminD?.username);
    setVarMySign(finalAdminD?.sign);
    const id = finalAdminD?.id;
    const str = `${uid}`;
    const [item1, item2, item3] = str.split("&");
    const responseWF = await axios.get(`${apiUrl}/workflow/${item1}`);
    let wfAllD = responseWF.data;
    setWfD(wfAllD);
    const jsonData = {
      item1,
      item2,
      item3,
    };

    let response;
    try {
      response = await axios.get(
        `${apiUrl}/fetch-data/${jsonData?.item2}/${jsonData?.item1}/${jsonData?.item3}`
      );
      setFData(response?.data);
      setWfD(wfAllD);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  return (
    <>
      <Helmet>
        <title>Reviewer Panel</title>
      </Helmet>
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Reviewer Panel - {wfD?.workflow_prefix}
          </Typography>
        </Stack>
        <Button
          style={{ margin: "2vh", width: "12vh" }}
          onClick={() => navigate("/dashboard/workflowReviewer")}
          variant="contained"
          size="large"
          color="warning"
        >
          Close
        </Button>
        <Card>
          <div style={{ padding: "2vh" }}>
            {fData.length > 0 ? (
              <>
                <div>
                  <TableContainer>
                    <Table style={{ overflow: "scroll" }}>
                      <TableHead>
                        <TableRow>
                          {/* Add a header for SN */}
                          <TableCell style={{ fontWeight: "bold" }}>SN</TableCell>
                          {Object.keys(fData[0])
                            .filter(
                              (key) =>
                                key.toUpperCase() !== "ID" &&
                                key.toUpperCase() !== "WORKFLOW" &&
                                key.toUpperCase() !== "USERID" &&
                                key.toUpperCase() !== "APPROVEDBY" &&
                                key.toUpperCase() !== "REJECTEDBY" &&
                                key.toUpperCase() !== "FINALAPPROVAL"
                            )
                            .map((key) => (
                              <TableCell key={key} style={{ fontWeight: "bold" }}>
                                {key.toUpperCase()}
                              </TableCell>
                            ))}
                          <TableCell colSpan={2} style={{ fontWeight: "bold" }}>
                            Reviewer's Status
                          </TableCell>
                          <TableCell style={{ fontWeight: "bold" }}>ACTION</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {fData.map((rowData, rowIndex) => (
                          <TableRow key={rowIndex}>
                            {/* Display serial number starting from 1 */}
                            <TableCell>{rowIndex + 1}</TableCell>
                            {Object.entries(rowData)
                              .filter(
                                ([key]) =>
                                  key.toUpperCase() !== "ID" &&
                                  key.toUpperCase() !== "WORKFLOW" &&
                                  key.toUpperCase() !== "USERID" &&
                                  key.toUpperCase() !== "APPROVEDBY" &&
                                  key.toUpperCase() !== "REJECTEDBY" &&
                                  key.toUpperCase() !== "FINALAPPROVAL"
                              )
                              .map(([key, value]) => (
                                <TableCell key={key}>
                                  {typeof value === "string" &&
                                    /\.(jpg|jpeg|png|gif|bmp)$/i.test(value) ? (
                                    <ImageViewComponent imageUrl={value} />
                                  ) : (
                                    value
                                  )}
                                </TableCell>
                              ))}
                            <TableCell colSpan={2}>
                              {rowData.ApprovedBy ? (
                                <span style={{ backgroundColor: "lightgreen", marginRight: "10px" }}>
                                  {rowData.ApprovedBy}
                                </span>
                              ) : null}
                              {rowData.RejectedBy ? (
                                <span style={{ backgroundColor: "lightcoral", marginRight: "10px" }}>
                                  {rowData.RejectedBy}
                                </span>
                              ) : null}
                            </TableCell>
                            <TableCell>
                              {console.log("rowData.ApprovedBy:", rowData.ApprovedBy)}
                              {console.log("rowData.RejectedBy:", rowData.RejectedBy)}
                              {console.log("var_myUname:", var_myUname)}

                              {rowData.ApprovedBy && rowData.ApprovedBy.split(',').map(name => name.trim()).includes(var_myUname) ? (
                                <Typography variant="body1" style={{ color: "green", fontWeight: "bold" }}>
                                  Approved by you
                                </Typography>
                              ) : rowData.RejectedBy && rowData.RejectedBy.split(',').map(name => name.trim()).includes(var_myUname) ? (
                                <Typography variant="body1" color="error" fontWeight="bold">
                                  Rejected by you
                                </Typography>
                              ) : (
                                <>
                                  <Button
                                    style={{ margin: "2vh", width: "12vh" }}
                                    variant="contained"
                                    size="large"
                                    color="success"
                                    onClick={() => handleApprove(rowData.id)}
                                    disabled={btnEnable}
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    style={{ margin: "2vh", width: "12vh" }}
                                    variant="contained"
                                    size="large"
                                    color="error"
                                    onClick={() => handleReject(rowData.id)}
                                    disabled={btnEnable}
                                  >
                                    Reject
                                  </Button>
                                </>
                              )}
                            </TableCell>



                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                </div>
              </>
            ) : (
              <div>
                <h4>No Data</h4>{" "}
                <Button
                  style={{ margin: "2vh", width: "12vh" }}
                  onClick={() => navigate("/dashboard/workflowReviewer")}
                  variant="contained"
                  size="large"
                  color="warning"
                >
                  Close
                </Button>
              </div>
            )}
          </div>
        </Card>
      </Container>
    </>
  );
};

export default UserWorkFlow;
