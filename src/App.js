import { BrowserRouter, Switch, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
// routes
import Router from "./routes";
import React, { useState } from "react";
// theme
import ThemeProvider from "./theme";
// components
import { StyledChart } from "./components/chart";
import ScrollToTop from "./components/scroll-to-top";
// layouts
import DashboardLayout from "./layouts/dashboard";
import axios from "axios";
import SimpleLayout from "./layouts/simple";
//
import UserPage from "./pages/UserPage";
import LoginPage from "./pages/LoginPage";
import Page404 from "./pages/Page404";
import DashboardAppPage from "./pages/DashboardAppPage";
import AddUser from "./pages/DevPages/AddUser";
import AdminManagement from "./pages/DevPages/AdminManagement";
import WorkflowManagement from "./pages/DevPages/WorkflowManagement";
import CreateForms from "./pages/DevPages/CreateForms";
import CreateMenu from "./pages/DevPages/CreateMenu";
import DocumentManagement from "./pages/DevPages/DocumentManagement";
import WorkflowReviewer from "./pages/DevPages/WorkflowReviewer";
import GisAdmin from "./pages/DevPages/GisManagement/gisAdmin";
import UserWorkFlow from "./pages/DevPages/WorkflowReviewer/userWF";
import FinalApproval from "./pages/DevPages/WorkflowReviewer/finalApproval";
import FinalDetails from "./pages/DevPages/WorkflowReviewer/finalDetails";
import Navigation from "./pages/DevPages/Navigation/Navigation";
import Profile from "./pages/DevPages/Profile/Profile";
import NotificationPage from "./pages/DevPages/Notification/Notification";
import { app, messaging } from "./firebase";
import { getToken } from "firebase/messaging";

import MobileRoutes from "./pages/DevPages/MobileRoutes/MobileRoutes";
import AdminWorkflowComponent from "./pages/DevPages/Admin_WF_Initiator/index";
// ----------------------------------------------------------------------

export default function App() {
  const [login, setLogin] = React.useState(false);
  const [navConfig, setNavConfig] = React.useState([]);
  const apiUrl = process.env.REACT_APP_BASE_URL;
  const [adminInit,setAdminInit] = useState(false)

  let localRoutes = [
    {
      route: "/dashboard/app",
      element: <DashboardAppPage />,
    },
    {
      route: "/dashboard/user",
      element: <UserPage />,
    },
    {
      route: "/dashboard/addUser",
      element: <AddUser />,
    },
    {
      route: "/dashboard/adminManagement",
      element: <AdminManagement />,
    },
    {
      route: "/dashboard/workflowManagement",
      element: <WorkflowManagement />,
    },
    {
      route: "/dashboard/createForms",
      element: <CreateForms />,
    },
    {
      route: "/dashboard/createMenu",
      element: <CreateMenu />,
    },
    {
      route: "/dashboard/documentManagement",
      element: <DocumentManagement />,
    },
    {
      route: "/dashboard/gisAdmin",
      element: <GisAdmin />,
    },
    {
      route: "/dashboard/navigation",
      element: <Navigation />,
    },
    {
      route: "/dashboard/notification",
      element: <NotificationPage />,
    },
    {
      route: "/dashboard/mobileRoutes",
      element: <MobileRoutes />,
    },
    {
      route: "/dashboard/workflowReviewer",
      element: <WorkflowReviewer />,
    },
    {
      route: "/dashboard/finalApproval",
      element: <FinalApproval />,
    },
    {
      route: "/dashboard/profile",
      element: <Profile />,
    },
    {
      route: "/dashboard/initiateWorkflow",
      element: <AdminWorkflowComponent />,
    },
  ];
  React.useEffect(() => {
    let isLogin = localStorage.getItem("loginnn");
    let userData = JSON.parse(localStorage.getItem("adminInfo"));
    axios.get(`${apiUrl}/workflow`)
    .then((response) => {
      const found = response.data.some((item) => item.admin_users.includes(userData.username));
  
      if (found) {
        setAdminInit(true);
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
  
    let userAccess = userData?.menu?.split(",");
    if (userAccess?.length > 0) {
      userAccess?.push("navigation");
      userAccess?.push("profile");
      userAccess?.push("notification");
      userAccess?.push("mobile routes");
    }
    let menuArr = [];
    //console.log(isLogin);
    if (isLogin == "yes") {
      axios
        .get(`${apiUrl}/menu`)
        .then((response) => {
          const temp = response.data;
          temp.push({
            id: 15,
            name: "profile",
            route: "/dashboard/profile",
            icon: "gis.png",
          });
          temp.push({
            id: 15,
            name: "notification",
            route: "/dashboard/notification",
            icon: "notification.png",
          });
          temp.push({
            id: 16,
            name: "mobile routes",
            route: "/dashboard/mobileRoutes",
            icon: "flow.png",
          });
          
          //console.log("Data retrieved successfully:", temp);
          let navData = temp?.map((item) => {
            if (userAccess.includes(item.name)) {
              menuArr.push({
                path: item.route,
                element: localRoutes.filter(
                  (_item) => _item.route == item.route
                )?.[0]?.element,
              });
            }
          });
          setNavConfig(menuArr);
        })
        .catch((error) => {
          console.error("An error occurred while retrieving data:", error);
          // Handle the error response here
        });
      setLogin(true);
    } else {
      setLogin(false);
    }
  }, []);

  async function requestPermission() {
    try {
      const permission = await Notification.requestPermission();
      console.log("Permission:", permission);
    } catch (error) {
      console.error("Error requesting permission:", error);
    }
  }

  React.useEffect(() => {
    requestPermission();
  }, []);

  return (
    <HelmetProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            {!login ? (
              <>
                <Route path="/" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />
              </>
            ) : (
              <>
                <Route
                  path="/"
                  element={
                    <DashboardLayout Custom={() => <DashboardAppPage />} />
                  }
                />
                {navConfig.map((item) => {
                  return (
                    <Route
                      path={item.path}
                      element={<DashboardLayout Custom={() => item.element} />}
                    />
                  );
                })}
                <Route
                  path="/userWf/:uid"
                  element={<DashboardLayout Custom={() => <UserWorkFlow />} />}
                />
                <Route
                  path="/dashboard/finalDetails/:uid"
                  element={<DashboardLayout Custom={() => <FinalDetails />} />}
                />
                <Route
                  path="/dashboard/addUser"
                  element={<DashboardLayout Custom={() => <AddUser />} />}
                />
{adminInit && (
  <Route
    path="/dashboard/initiateWorkflow"
    element={<DashboardLayout Custom={() => <AdminWorkflowComponent />} />}
  />
)}
              </>
            )}
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </HelmetProvider>
  );
}
