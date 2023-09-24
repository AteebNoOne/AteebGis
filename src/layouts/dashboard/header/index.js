import PropTypes from "prop-types";
// @mui
import { styled } from "@mui/material/styles";
import {
  Box,
  Stack,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
} from "@mui/material";
// utils
import { bgBlur } from "../../../utils/cssStyles";
// components
import Iconify from "../../../components/iconify";
//
import Searchbar from "./Searchbar";
import AccountPopover from "./AccountPopover";
import LanguagePopover from "./LanguagePopover";
import NotificationsPopover from "./NotificationsPopover";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

// ----------------------------------------------------------------------

const NAV_WIDTH = 280;

const HEADER_MOBILE = 64;

const HEADER_DESKTOP = 92;

const StyledRoot = styled(AppBar)(({ theme }) => ({
  ...bgBlur({ color: theme.palette.background.default }),
  boxShadow: "none",
  [theme.breakpoints.up("lg")]: {
    width: `calc(100% - ${NAV_WIDTH + 1}px)`,
  },
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: HEADER_MOBILE,
  [theme.breakpoints.up("lg")]: {
    minHeight: HEADER_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

// ----------------------------------------------------------------------

Header.propTypes = {
  onOpenNav: PropTypes.func,
};

export default function Header({ onOpenNav }) {
  const { t } = useTranslation();
  const [heading, setHeading] = useState("app");
  const { pathname } = useLocation();

  useEffect(() => {
    const pageName = pathname.split("/")[2];
    if (pageName === "app") {
      setHeading("Dashboard");
    } else if (pageName === "adminManagement") {
      setHeading("Admin Management");
    } else if (pageName === "user") {
      setHeading("User Management");
    } else if (pageName === "workflowManagement") {
      setHeading("Workflow Management");
    } else if (pageName === "documentManagement") {
      setHeading("Document Management");
    } else if (pageName === "gisAdmin") {
      setHeading("Gis Admin");
    } else if (pageName === "createForms") {
      setHeading("Forms");
    } else if (pageName === "navigation") {
      setHeading("Navigation");
    } else if (pageName === "notification") {
      setHeading("Notification");
    } else if (pageName === "mobileRoutes") {
      setHeading("Mobile Routes");
    } else {
      setHeading("");
    }
  }, [pathname]);

  return (
    <StyledRoot>
      <StyledToolbar>
        <Typography variant="h4" gutterBottom color={"#000"}>
          {t(heading)}
        </Typography>
        <IconButton
          onClick={onOpenNav}
          sx={{
            mr: 1,
            color: "text.primary",
            display: { lg: "none" },
          }}
        >
          <Iconify icon="eva:menu-2-fill" />
        </IconButton>

        {/* <Searchbar /> */}
        {/* <Typography variant="h4" color={'black'} marginTop={'30px'} sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography> */}
        <Box sx={{ flexGrow: 1 }} />

        <Stack
          direction="row"
          alignItems="center"
          spacing={{
            xs: 0.5,
            sm: 1,
          }}
        >
          <LanguagePopover />
          <NotificationsPopover />
          <AccountPopover />
        </Stack>
      </StyledToolbar>
    </StyledRoot>
  );
}
