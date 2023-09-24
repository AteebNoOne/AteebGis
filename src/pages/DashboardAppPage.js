import { Helmet } from "react-helmet-async";
import { Grid, Container, Typography,Alert } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";


// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const { t } = useTranslation();
  const [uD, setUd] = useState();
  const [message, setMessage] = useState(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("");

  const storageUrl = process.env.REACT_APP_UPLOAD_URL;
  useEffect(() => {
    let lsud = localStorage.getItem("adminInfo");
    setUd(JSON.parse(lsud));
  }, []);

  useEffect(() => {
    const shouldRenderAlert = (uD?.menu === "dashboard,Workflow Reviewer" || uD?.menu === "Workflow Reviewer,dashboard" ||
      uD?.menu === "dashboard,FinalApproval" || uD?.menu === "FinalApproval,dashboard") && uD?.sign_added === 'False';
  
    if (shouldRenderAlert) {
      setMessage(t('Please add your signature to continue!, If you added the signature already logout and login again.'));
      setAlertSeverity("warning");
      setIsAlertOpen(true);
    }
    else{
      setIsAlertOpen(false);
    }
  }, [uD]); 
  


  return (
    <>
      <Helmet>
        <title>{t("Dashboard | DocGIS")}</title>
      </Helmet>
      
      <Container maxWidth="xl">
      {isAlertOpen && (
          <Alert
            severity={alertSeverity}
            onClose={() => setIsAlertOpen(false)}
            sx={{ margin: "10px" }}
          >
            {message}
          </Alert>
        )}
        <Typography variant="h4" sx={{ mb: 5 }}>
          {/* {t("DocGis")} | {t("Dashboard")} */}
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={6}>
            <Typography variant="h5" sx={{ mb: 5, mt: 16 }}>
              {t("Hello ")}{uD?.full_name?.toUpperCase()},
            </Typography>

            <Typography sx={{ mb: 5 }}>{t("WELCOME TO DOCGIS.")}</Typography>

            <Typography sx={{ mb: 5 }}>{t("PHONE : ")}{uD?.phone}</Typography>

            <Typography sx={{ mb: 5 }}>{t("USERNAME : ")}{uD?.username}</Typography>

            <Typography sx={{ mb: 5 }}>{t("ROLE : ")}{uD?.role}</Typography>

            <Typography sx={{ mb: 5 }}>{t("RULE's ASSIGNED : ")}{uD?.role}</Typography>

            <Typography sx={{ mb: 5 }}>
              {t("SIGN's ADDED : ")}{uD?.sign_added ?? "NO"}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <Typography variant="h5" sx={{ mb: 5, ml: 4 }}>
              {t("Download Mobile Application")}
            </Typography>
            <a href={`${storageUrl}/download/app/APK/docgis.apk`} download>
              <div>
                <img
                  style={{
                    height: "55vh",
                    width: "32vh",
                    borderRadius: "40px",
                    border: "3px black solid",
                  }}
                  alt=''
                  src={`${storageUrl}/download/app/images/WhatsApp%20Image%202023-07-25%20at%2019.07.48.jpeg`}
                />
              </div>
            </a>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
