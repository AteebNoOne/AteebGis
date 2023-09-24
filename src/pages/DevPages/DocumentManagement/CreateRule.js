import React, { useState, useEffect } from "react";
import {
    Container,
    Button,
    Box,
    Typography,
} from "@mui/material";
import Iconify from "src/components/iconify/Iconify";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import FolderSelector from './Selectfolder';
import FolderCreator from './CreateFolder'
import RuleComponent from "./RuleName";
import KeywordComponent from "./KeywordComponent";
import Submit from "./Submit";


const styles = {
    formContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "5%",
    },
    fieldContainer: {
        marginBottom: "5%",
        width: "100%",
    },
};

const CreateRule = () => {
    const [processOption, setProcessOption] = useState("");
    const [prev, setPrev] = useState("");
    const [selectedFolder, setSelectedFolder] = useState("");
    const [ruleName, setRuleName] = useState("");
    const [keywords, setKeywords] = useState([]);
    const { t } = useTranslation();

    useEffect(() => {

        const interval = setInterval(() => {

        }, 500);


        return () => clearInterval(interval);
    }, []);



    const handleSelectFolder = () => {
        setProcessOption("select");
    };

    const handleCreateFolder = () => {
        setProcessOption("create");
    };

    const handleBack = () => {
        console.log(selectedFolder)
        if (processOption === "rule") {
            setProcessOption(prev);
        }
        else {
            setSelectedFolder("");
            setProcessOption("");
        }
    };

    const handleNext = () => {
        setPrev(processOption);
        setProcessOption("rule");
    };
    return (
        <Container style={styles.formContainer}
        >
            <Helmet>
                <title>{t("Select a folder")}</title>
            </Helmet>
            <Typography variant="h1" component="div" marginBottom={"30pt"}>
                {t("Add a new rule")}
            </Typography>
            {processOption !== "" && (
                <Box
                    style={{ marginBottom: "10pt" }}
                >
                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleBack}
                    >
                        <Iconify icon="bi:arrow-left" style={{ marginRight: "8px" }} />
                        {t("Back")}
                    </Button>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleNext}
                        style={{ marginLeft: "100pt" }}
                        disabled={!selectedFolder}
                    >
                        {t("Next")}
                        <Iconify icon="bi:arrow-right" style={{ marginLeft: "8px" }} />
                    </Button>
                </Box>
            )}

            {processOption === "" && (
                <React.Fragment>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleSelectFolder}
                        fullWidth
                        style={{ marginBottom: "20px" }}
                    >
                        {t("Select Folder")}
                    </Button>
                    <Typography variant="h4" component="div"
                        style={{ marginBottom: "20px" }}
                    >
                        {t("OR")}
                    </Typography>

                    {/* Option 2: Create New Folder */}
                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleCreateFolder}
                        fullWidth
                        style={{ marginBottom: "20px" }}
                    >
                        {t("Create a new folder")}
                    </Button>
                </React.Fragment>
            )}

            {processOption === "select" && (
                <FolderSelector setFolderName={setSelectedFolder} />
            )}

            {processOption === "create" && (
                <FolderCreator setSelectedFolder={setSelectedFolder} />
            )}

            {processOption === "rule" && (
                <RuleComponent folderName={selectedFolder} setRule={setRuleName} />
            )}
            {processOption === "rule" && (
                <KeywordComponent setKey={setKeywords} />
            )}
            {processOption === "rule" && (
                <Submit 
                folderName={selectedFolder}
                ruleName={ruleName} 
                keywords={keywords} />
            )}
        </Container>
    );
};

export default CreateRule;
