import { useEffect, useState } from "react";
import { Navigate, useNavigate, useRoutes } from "react-router-dom";
// layouts
import DashboardLayout from "./layouts/dashboard";
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
import DocumentManagement from "./pages/DevPages/DocumentManagement";
import WorkflowReviewer from "./pages/DevPages/WorkflowReviewer";
import GisAdmin from "./pages/DevPages/GisManagement/gisAdmin";
import Navigation from "./pages/DevPages/Navigation/Navigation";
import Profile from "./pages/DevPages/Profile/Profile";
import Notification from "./pages/DevPages/Notification/Notification";
import MobileRoutes from "./pages/DevPages/MobileRoutes/MobileRoutes";
// ----------------------------------------------------------------------

export default function Router() {
  const navigate = useNavigate();
  const [details, setDetails] = useState({});
  useEffect(() => {
    const loggedIn = localStorage.getItem("loginnn");
    const loggedData = localStorage.getItem("adminInfo");
    setDetails(JSON.parse(loggedData));
    // console.log('KLLO', loggedData);
    if (loggedIn === "yes" && details?.role === "Super_Admin") {
      navigate("/dashboard/app");
    } else if (loggedIn === "yes" && details?.role === "User_Admin") {
      navigate("/dashboard/user");
    } else if (loggedIn === "yes" && details?.role === "Workflow_Admin") {
      navigate("/dashboard/workflowManagement");
    } else if (loggedIn === "yes" && details?.role === "Workflow_Reviewer") {
      navigate("/dashboard/workflowReviewer");
    } else {
      navigate("/login");
    }
  }, []);

  const loggedRoutes = () => {
    if (details?.role === "Super_Admin") {
      return [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: "app", element: <DashboardAppPage /> },
        { path: "user", element: <UserPage /> },
        { path: "addUser", element: <AddUser /> },
        { path: "adminManagement", element: <AdminManagement /> },
        { path: "workflowManagement", element: <WorkflowManagement /> },
        { path: "createForms", element: <CreateForms /> },
        { path: "documentManagement", element: <DocumentManagement /> },
        { path: "gisAdmin", element: <GisAdmin /> },
        { path: "navigation", element: <Navigation /> },
        { path: "mobileRoutes", element: <MobileRoutes /> },
        { path: "profile", element: <Profile /> },
        { path: "notification", element: <Notification /> },
      ];
    } else if (details?.role === "User_Admin") {
      return [
        { element: <Navigate to="/dashboard/user" />, index: true },
        { path: "user", element: <UserPage /> },
        { path: "addUser", element: <AddUser /> },
      ];
    } else if (details?.role === "Workflow_Admin") {
      return [
        {
          element: <Navigate to="/dashboard/workflowManagement" />,
          index: true,
        },
        { path: "workflowManagement", element: <WorkflowManagement /> },
        { path: "createForms", element: <CreateForms /> },
      ];
    } else if (details?.role === "Workflow_Reviewer") {
      return [
        { element: <Navigate to="/dashboard/workflowReviewer" />, index: true },
        { path: "workflowReviewer", element: <WorkflowReviewer /> },
      ];
    } else {
      return [];
    }
  };

  const routes = useRoutes([
    {
      path: "/dashboard",
      element: <DashboardLayout />,
      children: [...loggedRoutes()],
    },
    {
      path: "login",
      element: <LoginPage />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/login" />, index: true },
        { path: "404", element: <Page404 /> },
        { path: "*", element: <Navigate to="/404" /> },
      ],
    },
    {
      path: "*",
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
