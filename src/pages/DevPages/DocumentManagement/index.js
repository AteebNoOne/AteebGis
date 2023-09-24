import React, { useState, useEffect } from "react";
import {
  Card,
  Stack,
  Button,
  Container,
  Alert,
} from "@mui/material";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Helmet } from "react-helmet-async";
import Iconify from "src/components/iconify/Iconify";
import Scrollbar from "src/components/scrollbar/Scrollbar";
import Box from "@mui/material/Box";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useTranslation } from "react-i18next";
import CreateRule from "./CreateRule";
import API_BASE_URL from "./apiConfig";
import PDFUploader from "./PDFUpload";
import DownloadButton from "./DownloadBtn";
import FolderList from "./FolderList";
import MoveFiletopMenu from "./MoveFiletopMenu";
import DestinationChooser from "./DestinationChooser";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CurrentFolderInfo from "./CurrentFolderInfo";
import axios from "axios";
import Modal from "./Emailfunctions/connectEmail"
import SwipeableEdgeDrawer from "./Emailfunctions/SwipeableDrawer";

const AddRuleComponent = () => {
  return <CreateRule />;
};

const EmailDisconnectDialog = ({ open, onClose, onDisconnect }) => {
  const { t } = useTranslation();
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t("Confirm Email Disconnection")}</DialogTitle>
      <DialogContent>
        {t(`Are you sure you want to disconnect your email: ${localStorage.getItem("connectedEmail")}?`)}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {t("Cancel")}
        </Button>
        <Button onClick={onDisconnect} color="primary">
          {t("Disconnect")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const DocumentManagement = () => {
  const { t } = useTranslation();

  const [emailConnected, setEmailConnected] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("connectedEmail")) {
      setEmailConnected(true);
      console.log("Connected email:", localStorage.getItem("connectedEmail"));
    }
  }, []);

  const handleDisconnectConfirmed = () => {
    // Make a POST request to the disconnect-email API
    fetch(`${API_BASE_URL}disconnect-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Specify the content type
      },
      body: JSON.stringify({
        email: localStorage.getItem("connectedEmail")
      })
    })
      .then(response => {
        if (response.ok) {
          // Success
          localStorage.removeItem("connectedEmail");
          setEmailConnected(false);
          console.log('Email disconnected successfully');
        } else {
          // Handle error
          console.error('Failed to disconnect email');
        }
      })
      .catch(error => {
        console.error('An error occurred:', error);
      })
      .finally(() => {
        setIsConfirmOpen(false); // Close the dialog regardless of success or failure
      });
  };
  const handleConnectEmail = () => {
    if (emailConnected) {
      setIsConfirmOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };


  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  const buttonColor = emailConnected ? 'error' : 'success';
  const buttonText = emailConnected ? t('Disconnect') : t('Connect email');
  const [sectionDoc, setSectionDoc] = useState(false);
  const [currentDirectory, setCurrentDirectory] = useState({
    folderList: [],
    selectedFolderName: "",
    subFolderList: [],
    selectedSubFolderName: "",
    fileLists: [],
    inSubDirectory: false,
    inFiles: false,
    showUpOneLevelButton: true,
  });
  const [selectedSubfolder, setSelectedSubfolder] = useState("");
  const [clickUpload, setClickUpload] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [message, setMessage] = useState(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertSeverty, setAlertSeverty] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [isTriggered, setIsTriggered] = useState(false);
  useEffect(() => {
    if (!isTriggered) {
      getData();
      setIsTriggered(true);
    }
    if (isEdited) {
      currentDirectory.subFolderList = "";
      getSubFolder(currentDirectory.selectedFolderName);
      setIsEdited(false);
    }
  }, [isEdited, currentDirectory, isTriggered]);

  const getData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/directories`);
      setCurrentDirectory((prev) => ({
        ...prev,
        folderList: response.data,
      }));
    } catch (error) {
      console.log(error);
      setMessage("Network error refresh the page");
      setAlertSeverty("error");
      setIsAlertOpen(true);
    }
  };

  const [hasSubdirectories, setHasSubdirectories] = useState(false);
  useEffect(() => {
    setHasSubdirectories(currentDirectory.subFolderList.length > 0);
  }, [currentDirectory.subFolderList]);

  const getSubFolder = async (directory) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/subdirectories?directoryname=${directory}`
      );

      // Check if the response data is an empty array (no subdirectories)
      if (response.data.length === 0) {
        setMessage(`Folder ${directory} is empty.`);
        setAlertSeverty("info");
        setIsAlertOpen(true);
        setCurrentDirectory((prev) => ({
          ...prev,
          selectedFolderName: directory,
          selectedSubFolderName: "",
          fileLists: [],
          inSubDirectory: false,
          inFiles: false,
        }));
      } else {
        setCurrentDirectory((prev) => ({
          ...prev,
          subFolderList: response.data,
          selectedFolderName: directory,
          selectedSubFolderName: "",
          fileLists: [],
          inSubDirectory: true,
          inFiles: false,
        }));
      }
    } catch (error) {
      setMessage("Network error refresh the page");
      setAlertSeverty("error");
      setIsAlertOpen(true);
    }
  };

  const getFiles = async (subdirectory) => {
    setSelectedSubfolder(subdirectory);
    const directoryname = `${currentDirectory.selectedFolderName}/${subdirectory}/${currentDirectory.selectedSubFolderName}`;
    try {
      const response = await axios.get(
        `${API_BASE_URL}/getFiles?directoryname=${directoryname}`
      );
      setCurrentDirectory((prev) => ({
        ...prev,
        fileLists: response.data,
        inFiles: true,
      }));
    } catch (error) {
      setMessage("Network error refresh the page");
      setAlertSeverty("error");
      setIsAlertOpen(true);
    }
  };

  const handleFileDownload = (filename) => {
    return (
      <DownloadButton
        directory={currentDirectory.selectedFolderName}
        subfolder={selectedSubfolder}
        filename={filename}
      />
    );
  };

  const handleAddRule = () => {
    setSectionDoc(true);
    setClickUpload(false);
    setSelectedFiles([]);
  };

  const handleUploadFiles = () => {
    setSelectedFiles([]);
    fetch(`${API_BASE_URL}/rules`)
      .then((response) => response.json())
      .then((data) => {
        if (data.count <= 0) {
          setMessage("Must have at least 1 rule.");
          setAlertSeverty("error");
          setIsAlertOpen(true);
        } else {
          setSectionDoc(true);
          setClickUpload(true);
        }
      })
      .catch((error) => {
        console.error("Error fetching data from the API:", error);
      });
  };

  const handleCancel = () => {
    setSectionDoc(false);
    setCurrentDirectory((prev) => ({
      ...prev,
      inSubDirectory: prev.inSubDirectory,
      inFiles: prev.inFiles,
      showUpOneLevelButton: true,
    }));
  };
  const handleGoBackToMain = () => {
    setCurrentDirectory({
      folderList: [],
      selectedFolderName: "",
      subFolderList: [],
      selectedSubFolderName: "",
      fileLists: [],
      inSubDirectory: false,
      inFiles: false,
      showUpOneLevelButton: true,
    });
    setSelectedFiles([]);
    setSelectedSubfolder("");
    getData();
  };

  const handleFileSelect = (file) => {
    const newFilePath = `${currentDirectory.selectedFolderName}/${selectedSubfolder}/${file}`;

    if (selectedFiles.includes(newFilePath)) {
      setSelectedFiles((prev) =>
        prev.filter((selectedFile) => selectedFile !== newFilePath)
      );
    } else {
      setSelectedFiles((prev) => [...prev, newFilePath]);
    }
  };

  const [showChooseDestination, setShowChooseDestination] = useState(false);
  const handleMoveSelectedFiles = () => {
    console.log("Moving selected files:", selectedFiles);
    setShowChooseDestination(true);
  };

  const handleCancelSelection = () => {
    setSelectedFiles([]);
  };

  const handleMoveConfirm = (selectedDirectory, selectedSubdirectory) => {
    console.log(
      "Move API call:",
      selectedFiles,
      selectedDirectory,
      "/",
      selectedSubdirectory
    );
    const target = selectedFiles;
    const destination = `${selectedDirectory}/${selectedSubdirectory}`;
    const requestBody = {
      target: target,
      destination: destination,
    };

    axios
      .post(`${API_BASE_URL}move`, requestBody)
      .then((response) => {
        console.log("Move API Response:", response.data);
        window.location.reload();
      })
      .catch((error) => {
        console.error("Move API Error:", error);
      });
  };

  const openDeleteConfirmation = () => {
    setShowDeleteConfirmation(true);
  };

  const closeDeleteConfirmation = () => {
    setShowDeleteConfirmation(false);
    setSelectedFolderToDelete("");
    setSelectedSubfolderToDelete("");
  };

  const handleDeleteFolder = async (folder) => {
    if (folder === "Nokeywords") {
      setMessage(`Can't delete default folder ${folder}`);
      setAlertSeverty("info");
      setIsAlertOpen(true);
      return;
    }
    openDeleteConfirmation();
    setSelectedFolderToDelete(folder);
  };

  const [selectedFolderToDelete, setSelectedFolderToDelete] = useState("");
  const [selectedSubfolderToDelete, setSelectedSubfolderToDelete] =
    useState("");

  const handleDeleteSubfolder = async (subfolder) => {
    if (
      currentDirectory.selectedFolderName === "Nokeywords" &&
      subfolder === "files"
    ) {
      setMessage(`Can't delete default sub folder ${subfolder}`);
      setAlertSeverty("info");
      setIsAlertOpen(true);
      return;
    }
    openDeleteConfirmation();
    setSelectedSubfolderToDelete(subfolder);
  };

  const confirmDeleteFolder = async () => {
    try {
      await axios.delete(
        `${API_BASE_URL}/directories/${selectedFolderToDelete}`
      );

      setCurrentDirectory((prev) => ({
        ...prev,
        folderList: prev.folderList.filter((f) => f !== selectedFolderToDelete),
      }));

      if (currentDirectory.selectedFolderName === selectedFolderToDelete) {
        setCurrentDirectory((prev) => ({
          ...prev,
          selectedFolderName: "",
          subFolderList: [],
          inSubDirectory: false,
          selectedSubFolderName: "",
          fileLists: [],
          inFiles: false,
          showUpOneLevelButton: true,
        }));
      }

      setMessage(`Successfully deleted ${selectedFolderToDelete}`);
      setAlertSeverty("success");
      setIsAlertOpen(true);
    } catch (error) {
      setMessage("Failed to delete folder. Please try again.");
      setAlertSeverty("error");
      setIsAlertOpen(true);
    } finally {
      // Close the confirmation dialogue after the deletion is complete (success or failure)
      closeDeleteConfirmation();
    }
  };

  const confirmDeleteSubfolder = async () => {
    try {
      const directoryname = `${currentDirectory.selectedFolderName}/${selectedSubfolderToDelete}`;
      await axios.delete(`${API_BASE_URL}/subdirectories/${directoryname}`);
      getData();
      setCurrentDirectory((prev) => ({
        ...prev,
        subFolderList: prev.subFolderList.filter(
          (sf) => sf !== selectedSubfolderToDelete
        ),
      }));

      if (
        currentDirectory.selectedSubFolderName === selectedSubfolderToDelete
      ) {
        setCurrentDirectory((prev) => ({
          ...prev,
          selectedSubFolderName: "",
          fileLists: [],
          inFiles: false,
        }));
      }

      setMessage(`Successfully deleted ${selectedSubfolderToDelete}`);
      setAlertSeverty("success");
      setIsAlertOpen(true);
    } catch (error) {
      setMessage("Failed to delete subfolder. Please try again.");
      setAlertSeverty("error");
      setIsAlertOpen(true);
    } finally {
      // Close the confirmation dialogue after the deletion is complete (success or failure)
      closeDeleteConfirmation();
    }
  };

  const hideAlert = () => {
    setIsAlertOpen(false);
  };

  useEffect(() => {
    if (isAlertOpen) {
      const timeout = setTimeout(hideAlert, 3000);
      return () => clearTimeout(timeout);
    }
  }, [isAlertOpen]);

  const handleSubfolderClick = (subfolder) => {
    getFiles(subfolder);
    setSelectedSubfolder(subfolder); // Set the selectedSubfolder state when you click on a subfolder
    setCurrentDirectory((prev) => ({
      ...prev,
      inFiles: false, // Set inFiles to false when you click on a subfolder
    }));
  };

  return (
    <>
      <Helmet>
        <title>DocumentManagement</title>
      </Helmet>
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          {sectionDoc ? (
            <>
              <Button
                onClick={handleCancel}
                style={{ background: "red" }}
                variant="contained"
              >
                {t("Cancel")}
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={handleAddRule}
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
              >
                {t("Add Rule")}
              </Button>
              <Button
                onClick={handleConnectEmail}
                variant="contained"
                color={buttonColor}
                startIcon={<Iconify icon="eva:plus-fill" />}
              >
                {buttonText}
              </Button>
              {localStorage.getItem("connectedEmail") && <SwipeableEdgeDrawer connected={emailConnected} fileUrl={`${API_BASE_URL}/emailLogs/${localStorage.getItem("connectedEmail")}.txt`}/>}
              <Modal showModal={isModalOpen} onClose={handleCloseModal} setEmailConnected={setEmailConnected} />
              <EmailDisconnectDialog
                open={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onDisconnect={handleDisconnectConfirmed}
              />
              <Button
                onClick={handleUploadFiles}
                variant="contained"
                startIcon={<Iconify icon="eva:cloud-upload-fill" />}
              >
                {t("Upload")}
              </Button>
            </>
          )}
        </Stack>
        <div>
          <MoveFiletopMenu
            selectedFiles={selectedFiles}
            handleMoveSelectedFiles={handleMoveSelectedFiles}
            handleCancelSelection={handleCancelSelection}
            t={t}
          />
        </div>
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
              {sectionDoc ? (
                <>
                  {clickUpload ? (
                    <PDFUploader
                      onCancel={handleCancel}
                    />
                  ) : (
                    <AddRuleComponent onCancel={handleCancel} />
                  )}
                </>
              ) : (
                <>
                  <CurrentFolderInfo
                    folderName={currentDirectory.selectedFolderName}
                    subfolders={selectedSubfolder}
                    inFiles={currentDirectory.inFiles} // Pass the inFiles prop here
                    onSubfolderClick={handleSubfolderClick}
                  />
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    {currentDirectory.showUpOneLevelButton && (
                      <Button
                        onClick={() => {
                          if (currentDirectory.inFiles) {
                            setCurrentDirectory((prev) => ({
                              ...prev,
                              fileLists: [],
                              inFiles: false,
                            }));
                            setSelectedFiles([]);
                          } else if (currentDirectory.inSubDirectory) {
                            setCurrentDirectory((prev) => ({
                              ...prev,
                              selectedFolderName: "",
                              subFolderList: [],
                              inSubDirectory: false,
                              selectedSubFolderName: "",
                            }));
                            setSelectedSubfolder("");
                            setSelectedFiles([]);
                          }
                        }}
                        variant="outlined"
                        disabled={
                          !hasSubdirectories || !currentDirectory.inSubDirectory
                        }
                        startIcon={<ArrowBackIcon />}
                      >
                        Up One Level
                      </Button>
                    )}
                    <Button
                      onClick={handleGoBackToMain}
                      variant="contained"
                      disabled={
                        !hasSubdirectories || !currentDirectory.inSubDirectory
                      }
                      startIcon={<ArrowBackIcon />}
                    >
                      {t("Back to Directories")}
                    </Button>
                  </div>
                  {showChooseDestination && (
                    <DestinationChooser
                      open={showChooseDestination}
                      onClose={() => setShowChooseDestination(false)}
                      directories={currentDirectory.folderList}
                      onMoveConfirm={handleMoveConfirm}
                    />
                  )}
                  {!sectionDoc && (
                    <>
                      <div className="container">
                        <div>
                          <Dialog
                            open={showDeleteConfirmation}
                            onClose={closeDeleteConfirmation}
                          >
                            <DialogTitle>Confirm Delete</DialogTitle>
                            <DialogContent>
                              Are you sure you want to delete "
                              {selectedFolderToDelete
                                ? selectedFolderToDelete
                                : selectedSubfolderToDelete}
                              "?
                            </DialogContent>
                            <DialogActions>
                              <Button
                                onClick={closeDeleteConfirmation}
                                color="primary"
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={
                                  selectedSubfolderToDelete
                                    ? confirmDeleteSubfolder
                                    : confirmDeleteFolder
                                }
                                color="primary"
                                autoFocus
                              >
                                Delete
                              </Button>
                            </DialogActions>
                          </Dialog>
                        </div>
                        {currentDirectory.inFiles ? (
                          <List
                            sx={{
                              width: "100%",
                              maxWidth: 360,
                              bgcolor: "background.paper",
                            }}
                            component="nav"
                            aria-labelledby="nested-list-subheader"
                            subheader={
                              <ListSubheader
                                component="div"
                                id="nested-list-subheader"
                              >
                                Files
                              </ListSubheader>
                            }
                          >
                            {currentDirectory.fileLists.map((file) => (
                              <ListItemButton
                                key={file}
                                onClick={() => handleFileSelect(file)}
                              >
                                <ListItemIcon>
                                </ListItemIcon>
                                <ListItemText primary={file} />
                                {handleFileDownload(file)}
                              </ListItemButton>
                            ))}
                          </List>
                        ) : currentDirectory.subFolderList.length > 0 ? (
                          <FolderList
                            setIsEdited={setIsEdited}
                            selectedFolder={currentDirectory.selectedFolderName}
                            data={currentDirectory.subFolderList}
                            onClick={getFiles}
                            onDelete={handleDeleteSubfolder}
                            place={"Rules"}
                          />
                        ) : (
                          <FolderList
                            data={currentDirectory.folderList}
                            onClick={getSubFolder}
                            onDelete={handleDeleteFolder}
                            place={"Directories"}
                          />
                        )}
                      </div>
                    </>
                  )}
                </>
              )}
            </Box>
          </Scrollbar>
        </Card>
        {isAlertOpen && (
          <Alert
            severity={alertSeverty}
            onClose={() => setIsAlertOpen(false)}
            sx={{ margin: "10px" }}
          >
            {message}
          </Alert>
        )}
      </Container>
    </>
  );
};

export default DocumentManagement;
