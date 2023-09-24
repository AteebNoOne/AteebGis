import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
// @mui
import { styled, alpha } from "@mui/material/styles";
import {
  Box,
  Link,
  Button,
  Drawer,
  Typography,
  Avatar,
  Stack,
} from "@mui/material";
// mock
import account from "../../../_mock/account";
// hooks
import useResponsive from "../../../hooks/useResponsive";
// components
import Logo from "../../../components/logo";
import Scrollbar from "../../../components/scrollbar";
import NavSection from "../../../components/nav-section";
import axios from "axios";
//
// import navConfig from './config';

// ----------------------------------------------------------------------

const NAV_WIDTH = 280;

const StyledAccount = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
}));

// ----------------------------------------------------------------------

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

export default function Nav({ openNav, onCloseNav }) {
  const { pathname } = useLocation();
  const [adminInfo, setAdminInfo] = useState({});
  const [navConfig, setNavConfig] = useState([]);

  const isDesktop = useResponsive("up", "lg");
  const apiUrl = process.env.REACT_APP_BASE_URL;
  useEffect(() => {
    const daataa = localStorage.getItem("adminInfo");
    setAdminInfo(JSON.parse(daataa));
    if (openNav) {
      onCloseNav();
    }
  }, [pathname]);

  useEffect(() => {
    getMenu();
  }, []);


  const getMenu = () => {
    let userData = JSON.parse(localStorage.getItem("adminInfo"));
    let userAccess = userData?.menu?.split(",");
    let menuArr = [];
    let adminInit = false;
    axios.get(`${apiUrl}/workflow`)
    .then((response) => {
      console.log("WF RESP DIRECT: ", response)
      if (response.data[0].admin_users.includes(userData.username)) {
        adminInit = true;
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
    axios
      .get(`${apiUrl}/menu`)
      .then((response) => {
        console.log("Data retrieved successfully:", response.data);
        const temp = response.data;
        let navData = temp?.map((item) => {
          if (userAccess.includes(item.name)) {
            menuArr.push({
              title: item.name,
              path: item.route,
              icon: item.icon,
            });
          }
        });
        if(adminInit){
          menuArr.push({
            id: 18,
            title: "Workflow Admin Initiator",
            path: "/dashboard/initiateWorkflow",
            icon: "flow.png",
          });
        }
        if (
          userData.menu !== "dashboard,Workflow Reviewer" &&
          userData.menu !== "Workflow Reviewer,dashboard" &&
          userData.menu !== "dashboard,FinalApproval" &&
          userData.menu !== "FinalApproval,dashboard"
        ) {
          menuArr.push({
            id: 15,
            title: "navigation",
            path: "/dashboard/navigation",
            icon: "gis.png",
          });
          menuArr.push({
            id: 16,
            title: "notification",
            path: "/dashboard/notification",
            icon: "notification.png",
          });
          menuArr.push({
            id: 17,
            title: "mobile routes",
            path: "/dashboard/mobileRoutes",
            icon: "flow.png",
          });
        }
        setNavConfig(menuArr);
      })
      .catch((error) => {
        console.error("An error occurred while retrieving data:", error);
        // Handle the error response here
      });
  };

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        "& .simplebar-content": {
          height: 1,
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Box sx={{ px: 2.5, py: 3, display: "inline-flex" }}>
        <Logo />
      </Box>

      <Box sx={{ mb: 5, mx: 2.5 }}>
        <Link underline="none">
          <StyledAccount>
            <Avatar src={account.photoURL} alt="photoURL" />

            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ color: "text.primary" }}>
                {adminInfo?.full_name}
              </Typography>

              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {adminInfo?.role}
              </Typography>
            </Box>
          </StyledAccount>
        </Link>
      </Box>

      <NavSection data={navConfig} />

      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV_WIDTH },
      }}
    >
      {isDesktop ? (
        <Drawer
          open
          variant="permanent"
          PaperProps={{
            sx: {
              width: NAV_WIDTH,
              bgcolor: "background.default",
              borderRightStyle: "dashed",
            },
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: { width: NAV_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}
