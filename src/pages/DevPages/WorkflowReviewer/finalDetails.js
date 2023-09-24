import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card, Container, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Table, TableContainer, TableHead, TableBody, TableCell, TableRow ,CircularProgress} from "@material-ui/core";
import { Button } from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";
import ImageViewComponent from "./ImageView";
import { generateSignsHTML, handleGeneratePDF } from "./Utils";


const FinalDetails = () => {
  const navigate = useNavigate();
  const { uid } = useParams();
  const [fData, setFData] = useState([]);
  const [wfD, setWfD] = useState({});
  const [btnEnable, setEnable] = useState(false);
  const [var_myName, setVarMyName] = useState("");
  const [var_myUname, setVarMyUname] = useState("");
  const [var_mySign, setVarMySign] = useState("");
  const [loading, setLoading] = useState(false);

  const apiUrl = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    getData();
  }, []);

  const callARApi = async (id, status) => {
    try {
      const url = `${apiUrl}/final-approval/${wfD.form_name}/${id}/${status}`;
      const response = await axios.put(url);
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  };


  const handleApprove = async (id) => {
    const status = "Approved";
    try {
      await callARApi(id, status);
      await getData();
    } catch (error) {
      console.error("Error Approving:", error);
    }

  };

  const handleReject = async (id) => {
    const status = "Rejected";
    try {
      await callARApi(id, status);
      await getData();
    } catch (error) {
      console.error("Error Approving:", error);
    }
  };

  const handleDownloadPDF = async (id) => {
    setLoading(true);
    generateSignsHTML(wfD, id)
      .then((combinedHTML) => {
        handleGeneratePDF(uid, wfD, var_myName, var_mySign, combinedHTML);
      })
      .catch((error) => {
        console.error(`Error generating HTML content: ${error.message}`);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const getData = async () => {
    let adminD = localStorage.getItem("adminInfo");
    let finalAdminD = JSON.parse(adminD);
    //console.log("HERE : I WANT :: ", finalAdminD)
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
          onClick={() => navigate("/dashboard/finalApproval")}
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
                          <TableCell style={{ fontWeight: "bold" }}>REV_COUNTS</TableCell>
                          <TableCell style={{ fontWeight: "bold" }}>ACTION</TableCell>
                        </TableRow>
                      </TableHead>
                      {/*TABLE BODY STARTS*/}
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
                            <TableCell style={{ fontWeight: "bold" }}>
                              {(() => {
                                const approvedCount = rowData.ApprovedBy ? rowData.ApprovedBy.split(',').length : 0;
                                const rejectedCount = rowData.RejectedBy ? rowData.RejectedBy.split(',').length : 0;
                                const totalCount = approvedCount + rejectedCount;
                                const reviewerCount = wfD?.reviewer ? wfD.reviewer.split(',').length : 0;
                                return `${totalCount} / ${reviewerCount}`;
                              })()}
                            </TableCell>
                            <TableCell>
                              {(() => {
                                const approvedCount = rowData.ApprovedBy ? rowData.ApprovedBy.split(',').length : 0;
                                const rejectedCount = rowData.RejectedBy ? rowData.RejectedBy.split(',').length : 0;
                                const totalCount = approvedCount + rejectedCount;
                                const reviewerCount = wfD?.reviewer ? wfD.reviewer.split(',').length : 0;
                                if (totalCount < reviewerCount) {
                                  return (
                                    <Typography variant="body1">
                                      Waiting for reviewers
                                    </Typography>
                                  );
                                } else if (totalCount === reviewerCount && rowData.finalApproval !== "None") {
                                  return (
                                    <>
                                    {loading ? (
                                      <CircularProgress size={24} color="inherit" /> // Show circular progress when loading
                                    ) : (
                                      <Button
                                        style={{ margin: "2vh", width: "12vh" }}
                                        variant="contained"
                                        size="large"
                                        color="primary"
                                        onClick={() => handleDownloadPDF(rowData.id)}
                                        disabled={btnEnable || loading} 
                                      >
                                        Download PDF
                                      </Button>
                                    )}
                                  </>
                                  );
                                } else if (totalCount === reviewerCount && rowData.finalApproval === "None") {
                                  return (
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
                                  );
                                } else {
                                  return null;
                                }
                              })()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      {/*TABLE BODY ENDS*/}
                    </Table>
                  </TableContainer>

                </div>
              </>
            ) : (
              <div>
                <h4>No Data</h4>{" "}
                <Button
                  style={{ margin: "2vh", width: "12vh" }}
                  onClick={() => navigate("/dashboard/finalApproval")}
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

export default FinalDetails;
