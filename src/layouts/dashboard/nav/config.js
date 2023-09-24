// component
import SvgColor from "../../../components/svg-color";
// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}`} sx={{ width: 1, height: 1 }} />
);
const loggedData = JSON.parse(localStorage.getItem("adminInfo"));
const logIn = () => {
  if (loggedData?.role === "Super_Admin") {
    return [
      {
        title: "dashboard",
        path: "/dashboard/app",
        icon: icon("ic_analytics.svg"),
      },
      {
        title: "admin management",
        path: "/dashboard/adminManagement",
        icon: icon("ic_lock.svg"),
      },
      {
        title: "user management",
        path: "/dashboard/user",
        icon: icon("ic_user.svg"),
      },
      {
        title: "workflow management",
        path: "/dashboard/workflowManagement",
        icon: icon("workflow.png"),
      },
      {
        title: "document management",
        path: "/dashboard/documentManagement",
        icon: icon("document.png"),
      },
      {
        title: "gis admin",
        path: "/dashboard/gisAdmin",
        icon: icon("gis.png"),
      },
      {
        title: "create forms",
        path: "/dashboard/forms",
        icon: icon("ic_forms.svg"),
      },
      // {
      //   title: "create Menu",
      //   path: "/dashboard/createMenu",
      //   icon: icon("ic_forms.svg"),
      // },
    ];
  } else if (loggedData?.role === "Workflow_Reviewer") {
    return [
      {
        title: "user management",
        path: "/dashboard/user",
        icon: icon("ic_user.svg"),
      },
    ];
  } else if (loggedData?.role === "Workflow_Admin") {
    return [
      {
        title: "workflow management",
        path: "/dashboard/workflowManagement",
        icon: icon("workflow.png"),
      },
    ];
  } else {
    return [];
  }
};
var navConfig = [...logIn()];

export default navConfig;
