import React, { useState, useEffect, useCallback } from "react";
import { TextField, Typography, Container } from "@mui/material";
import axios from "axios";
import API_BASE_URL from "./apiConfig";
import debounce from "lodash/debounce";
import { useTranslation } from "react-i18next";

const FolderCreator = ({setSelectedFolder}) => {
    const { t } = useTranslation();
    const [folderName, setFolderName] = useState("");
    const [error, setError] = useState("");
    const [validating, setValidating] = useState(false);

    useEffect(() => {
        if (folderName.length < 1) {
            setError("");
        }
    }, [folderName]);

    const validateFolder = useCallback(
        debounce((inputFolderName) => {
            if (inputFolderName === "Nokeywords") {
                setError(t("Default key can't be used as a folder name"));
                setValidating(false);
                return;
              }
            if (inputFolderName.length >= 5) {
                setValidating(true);
                axios
                    .get(`${API_BASE_URL}validate?folderName=${inputFolderName}`)
                    .then((response) => {
                        if (response.data === true) {
                            setSelectedFolder(inputFolderName)
                            setError("");
                        } else {
                            setSelectedFolder("")
                            setError(<div>{t("Folder with name: ")}<strong>{inputFolderName}</strong>{t(" Already Exist! Choose another name")}</div>);
                        }
                    })
                    .catch((error) => {
                        //console.error("Error validating folder:", error);
                        setError(t("An error occurred while validating the folder."));
                    })
                    .finally(() => {
                        setValidating(false);
                    });
            } else {
                setError(t("Folder name must be at least 5 characters long"));
                setValidating(false);
            }
        }, 200), 
        []
    );
    

    const handleChange = (event) => {
        const inputFolderName = event.target.value;
        setFolderName(inputFolderName);
        validateFolder(inputFolderName);
    };

    const handleCreateFolder = () => {
        if (folderName.length >= 5) {
            axios
                .post(`${API_BASE_URL}create`, { folderName })
                .then(() => {
                    //console.log("Folder created successfully!");
                })
                .catch((error) => {
                    //console.error("Error creating folder:", error);
                });
        }
    };

    return (
        <Container>
            <Typography variant="h5" component="div">
                Create a New Folder
            </Typography>
            <Container
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "10px",
                    padding: 2,
                    maxWidth: 300,
                }}
            >
                <TextField
                    label={t("Folder Name")}
                    variant="outlined"
                    value={folderName}
                    onChange={handleChange}
                    error={Boolean(error)}
                    helperText={error}
                />
                <Typography
                    variant="contained"
                    onClick={handleCreateFolder}
                    disabled={folderName.length < 5 || Boolean(error) || validating}
                >
                    {validating ? t("Validating...") : ""}
                </Typography>
            </Container>
        </Container>
    );
};

export default FolderCreator;
