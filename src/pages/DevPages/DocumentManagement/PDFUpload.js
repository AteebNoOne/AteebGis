import React, { useState, useCallback } from "react";
import {
    Card,
    Stack,
    Button,
    Container,
    Typography,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    LinearProgress,
    Alert
} from "@mui/material";
import Iconify from "src/components/iconify/Iconify";
import DescriptionIcon from '@mui/icons-material/Description';
import API_BASE_URL from "./apiConfig";
import axios from "axios";
import { useTranslation } from "react-i18next";

const PDFUploader = () => {
    const {t} = useTranslation();
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [error, setError] = useState("");
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [snackProperty,setSnackProperty] = useState(null);
    const [snackMessage,setSnackMessage] = useState("");

    const handleDrop = useCallback((event) => {
        event.preventDefault();
        event.stopPropagation();
        setError("");

        const files = event.dataTransfer.files;

        const allowedFileTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // XLSX MIME type
            "image/png",
            "image/jpeg"
        ];        
        const fileCountLimit = 100;

        // Check if the number of files exceeds the limit
        if (files.length + selectedFiles.length > fileCountLimit) {
            setError(t(`You can upload a maximum of ${fileCountLimit} files.`));
            return;
        }

        // Check if all files are of the allowed file types
        for (let i = 0; i < files.length; i++) {
            if (!allowedFileTypes.includes(files[i].type)) {
                setError(t("Only PDF/DOCS/XLSX/Image files are allowed."));
                return;
            }
        }

        // Check for duplicate filenames
        const existingFilenames = selectedFiles.map(file => file.name);
        const duplicateFiles = Array.from(files).filter(file => existingFilenames.includes(file.name));

        if (duplicateFiles.length > 0) {
            const duplicateFilenames = duplicateFiles.map(file => file.name).join(", ");
            setError(t(`File(s) "${duplicateFilenames}" already selected.`));
            return;
        }

        const fileList = Array.from(files);
        setSelectedFiles((prevFiles) => [...prevFiles, ...fileList]);
    }, [selectedFiles,t]);

    const handleDragOver = useCallback((event) => {
        event.preventDefault();
        event.stopPropagation();
    }, []);

    const handleFileInputChange = (event) => {
        setError("");
        const files = event.target.files;

        const allowedFileTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", 
            "image/png",
            "image/jpeg"
        ];
        const fileCountLimit = 100;

        if (files.length + selectedFiles.length > fileCountLimit) {
            setError(t(`You can upload a maximum of ${fileCountLimit} files.`));
            return;
        }

        for (let i = 0; i < files.length; i++) {
            if (!allowedFileTypes.includes(files[i].type)) {
                setError(t("Only PDF/DOCX/XLSX and Image files are allowed."));
                return;
            }
        }

        const existingFilenames = selectedFiles.map(file => file.name);
        const duplicateFiles = Array.from(files).filter(file => existingFilenames.includes(file.name));

        if (duplicateFiles.length > 0) {
            const duplicateFilenames = duplicateFiles.map(file => file.name).join(", ");
            setError(t(`File(s) "${duplicateFilenames}" already selected.`));
            return;
        }

        const fileList = Array.from(files);
        setSelectedFiles((prevFiles) => [...prevFiles, ...fileList]);
    };

    const handleRemoveFile = (fileToRemove) => {
        setSelectedFiles((prevFiles) => prevFiles.filter(file => file !== fileToRemove));
    };

    const handleClearAll = () => {
        setSelectedFiles([]);
    };

    const renderSelectedFiles = () => {
        return selectedFiles.map((file, index) => (
            <ListItemButton key={index}>
                <ListItemIcon>
                    <DescriptionIcon />
                </ListItemIcon>
                <ListItemText primary={file.name} />
                <Button onClick={() => handleRemoveFile(file)}>Close</Button>
            </ListItemButton>
        ));
    };

    const handleContinueUpload = () => {
        setShowConfirmationDialog(true);
    };

    const handleConfirmationDialogClose = (confirmed) => {
        setError("");
        setShowConfirmationDialog(false);
        if (confirmed) {
            setUploading(true);
            setProgress(0);

            const formData = new FormData();
            selectedFiles.forEach((file) => {
                formData.append("files", file);
            });

            axios
                .post(API_BASE_URL, formData, {
                    onUploadProgress: (progressEvent) => {
                        const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setProgress(percentage);
                    },
                })
                .then((response) => {
                    if(response.status === 200){
                        setUploading(false);
                        setSelectedFiles([]); 
                        setSnackProperty("success");
                        setSnackMessage(t("Successfully uploaded file(s)."))
                        setShowSnackbar(true);
                    }
                    console.log(response);
                })
                .catch((error) => {
                    console.log("Checks error ",error)
                    setError(t("An error occurred during file upload."));
                    setUploading(false);
                    setSnackProperty("error");
                    setSnackMessage(t("An Error Occurred!"));
                    setShowSnackbar(true);
                });
        }
    };


    return (
        <Card>
            <Container>
                <Stack spacing={2}>
                    <Typography variant="h6" component="h2">
                        {t("Upload PDF/DOCX/XLSX/Image Files")}
                    </Typography>
                    <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        style={{
                            border: "2px dashed #aaa",
                            padding: "2rem", /* Increase the padding to increase the height */
                            borderRadius: "4px",
                            display: "flex", /* Add flexbox layout */
                            justifyContent: "center", /* Center the items horizontally */
                            alignItems: "center", /* Center the items vertically */
                            flexDirection: "column", /* Align items vertically */
                        }}
                    >
                        <Typography variant="body2" color="textSecondary">
                            {t("Drag and drop files here or click the button below to upload.")}
                        </Typography>
                        <input
                            type="file"
                            accept="application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, image/png, image/jpeg"
                            multiple
                            onChange={handleFileInputChange}
                            style={{ display: "none" }}
                            id="file-input"
                        />
                        <label htmlFor="file-input">
                            <Button variant="contained" component="span"
                                startIcon={
                                    <Iconify icon="eva:upload-fill" />
                                }
                            >
                                {t("Upload Files")}
                            </Button>
                        </label>
                    </div>
                    {selectedFiles.length > 0 && (
                        <>
                            <Button onClick={handleClearAll} variant="outlined" color="secondary">
                                {t("Clear All")}
                            </Button>
                            <List subheader={<ListSubheader>{t("Selected Files")}</ListSubheader>}>
                                {renderSelectedFiles()}
                            </List>
                            {!uploading && (
                                <Button onClick={handleContinueUpload} variant="contained" color="primary">
                                    {t("Continue")}
                                </Button>
                            )}
                        </>
                    )}
                    {error && (
                        <Typography variant="body2" color="error">
                            {error}
                        </Typography>
                    )}
                </Stack>
            </Container>

            {/* Confirmation Dialog */}
            <Dialog open={showConfirmationDialog} onClose={() => handleConfirmationDialogClose(false)}>
                <DialogTitle>{"Confirm Upload"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {t(`Are you sure you want to upload ${selectedFiles.length} files to the server?`)}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleConfirmationDialogClose(false)} color="primary">
                        {t("No")}
                    </Button>
                    <Button onClick={() => handleConfirmationDialogClose(true)} color="primary">
                        {t("Yes")}
                    </Button>
                </DialogActions>
            </Dialog>
            {/* Progress Bar */}
            {uploading && (
                <LinearProgress variant="determinate" value={progress} />
            )}
            {showSnackbar && (
                <div>
                    <Alert onClose={() => setShowSnackbar(false)} severity={snackProperty} sx={{ margin: '10px' }}>
                        {snackMessage}
                    </Alert>
                </div>
            )}
        </Card>
    );
};

export default PDFUploader;
