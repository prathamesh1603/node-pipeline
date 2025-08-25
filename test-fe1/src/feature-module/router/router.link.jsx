import { Navigate, Route } from "react-router";
import { all_routes } from "./all_routes";
import DealsDashboard from "../mainMenu/dealsDashboard";

import ComingSoon from "../pages/comingSoon";
import Manageusers from "../crm/manageUsers/containers/ManageUsers";

import Companies from "../crm/companies/containers/companies";
import Leads from "../crm/leads/containers/Leads";
import Login from "../auth/login";
import Register from "../auth/register";
import ResetPassword from "../auth/resetPassword";
import ForgotPassword from "../auth/forgotPassword";

import LeadsDashboard from "../mainMenu/leadsDashboard";

import RolesPermissions from "../crm/manageRoles/containers/rolesPermissions";
import Permission from "../crm/manageRoles/containers/permission";
import ContactStages from "../crmSetting/stages/containers/StagesList";
import CompanyDetails from "../crm/companies/containers/CompanyDetails";
import Products from "../crm/products/containers/Products";
import UserDetails from "../crm/manageUsers/containers/UserDetails";
import LeadsDetails from "../crm/leads/actions/LeadsDetails";
import EditCompany from "../crm/companies/actions/EditCompany";
import EditProductPage from "../crm/products/actions/EditProductPage";
import EditUser from "../crm/manageUsers/actions/EditUser";
import EditLead from "../crm/leads/actions/EditLead";
import EditDeal from "../crm/deals/actions/EditDeal";
import DealsDetails from "../crm/deals/actions/DealsDetails";
import Settings from "../crmSetting/settings";
import Accounts from "../crm/accounts/containers/Accounts";
import AccountsDetails from "../crm/accounts/containers/AccountsDetails";
import AccountGridLayout from "../crm/accounts/components/AccountGridLayout";
import LeadReport from "../reports/lead/leadReport";
import DealReport from "../reports/deal/dealReport";
import ProductDashboard from "../mainMenu/productDashboard";
import ProductReport from "../reports/product/productReport";
import Deals from "../crm/deals/containers/Deals";
import EmailVerification from "../auth/emailVerification";
import UnderMaintenance from "../pages/underMaintenance";
import FieldPermissions from "../crmSetting/customModulesAndFields/containers/FieldPermissions";
import FieldListing from "../crmSetting/customModulesAndFields/containers/FieldListing";
import CreateEditCustomField from "../crmSetting/customModulesAndFields/containers/CreateEditCustomField";
import CustomModulesAndFields from "../crmSetting/customModulesAndFields/containers/CustomModulesAndFields";
const route = all_routes;

export const publicRoutes = [
  {
    path: route.dealsDashboard,
    element: <DealsDashboard />,
    route: Route,
    title: "Deals Dashboard",
  },
  {
    path: "/",
    name: "Root",
    element: <Navigate to="/login" />,
    route: Route,
    title: "Login",
  },

  {
    path: route.accounts,
    element: <Accounts />,
    route: Route,
    title: "Accounts",
  },
  {
    path: route.accountGrid,
    element: <AccountGridLayout />,
    route: Route,
    title: "Accounts Grid",
  },
  {
    path: route.accountDetails,
    element: <AccountsDetails />,
    route: Route,
    title: "Accounts Details",
  },

  {
    path: route.manageusers,
    element: <Manageusers />,
    route: Route,
    title: "Manage Users",
  },
  {
    path: route.editUserDetails,
    element: <EditUser />,
    route: Route,
    title: "Edit User Details",
  },

  {
    path: route.deals,
    element: <Deals />,
    route: Route,
    title: "Deals",
  },
  {
    path: route.editDealDetails,
    element: <EditDeal />,
    route: Route,
    title: "Edit deals Details",
  },
  {
    path: route.dealsDetails,
    element: <DealsDetails />,
    route: Route,
    title: "Deals Details",
  },

  {
    path: route.companies,
    element: <Companies />,
    route: Route,
    title: "Companies",
  },

  {
    path: route.editLeadDetails,
    element: <EditLead />,
    route: Route,
    title: "Edit Leads Details",
  },
  {
    path: route.leadsDetails,
    element: <LeadsDetails />,
    route: Route,
    title: "Leads Details",
  },
  {
    path: route.leads,
    element: <Leads />,
    route: Route,
    title: "Leads",
  },
  {
    path: route.companies,
    element: <Companies />,
    route: Route,
    title: "Companies",
  },

  {
    path: route.settings,
    element: <Settings />,
    route: Route,
    title: "CRM Settings",
  },

  {
    path: route.customModule,
    element: <CustomModulesAndFields />,
    route: Route,
    title: "Custom Modules",
  },

  {
    path: route.leadsDashboard,
    element: <LeadsDashboard />,
    route: Route,
    title: "Leads Dashboard",
  },
  {
    path: route.productDashboard,
    element: <ProductDashboard />,
    route: Route,
    title: "Product Dashboard",
  },

  {
    path: route.dealReports,
    element: <DealReport />,
    route: Route,
    title: "Deal Reports",
  },
  {
    path: route.leadReports,
    element: <LeadReport />,
    route: Route,
    title: "Lead Reports",
  },
  {
    path: route.productReports,
    element: <ProductReport />,
    route: Route,
    title: "Product Reports",
  },

  {
    path: route.stages,
    element: <ContactStages />,
    route: Route,
    title: "Contact Stage",
  },

  {
    path: route.rolesPermissions,
    element: <RolesPermissions />,
    route: Route,
    title: "Roles Permissions",
  },

  {
    path: route.fieldPermissions,
    element: <FieldPermissions />,
    route: Route,
    title: "Field Permissions",
  },
  {
    path: route.fieldListing,
    element: <FieldListing />,
    route: Route,
    title: "Fields",
  },
  {
    path: route.moduleFields,
    element: <CreateEditCustomField />,
    route: Route,
    title: "Fields",
  },

  {
    path: route.products,
    element: <Products />,
    route: Route,
    title: "Products",
  },
  {
    path: route.editProductDetails,
    element: <EditProductPage />,
    route: Route,
    title: "Edit Product Details",
  },

  {
    path: route.companyDetails,
    element: <CompanyDetails />,
    // element: <ComingSoon />,
    route: Route,
    title: "Company Details",
  },

  {
    path: route.editCompanyDetails,
    element: <EditCompany />,
    route: Route,
    title: "Edit Company Details",
  },
  {
    path: route.userDetails,
    element: <UserDetails />,
    // element: <ComingSoon />,
    route: Route,
    title: "User Details",
  },

  {
    path: route.permissions,
    element: <Permission />,
    route: Route,
    title: "Permission",
  },
];

export const authRoutes = [
  {
    path: route.comingSoon,
    element: <ComingSoon />,
    route: Route,
    title: "ComingSoon",
  },
  {
    path: route.login,
    element: <Login />,
    route: Route,
    title: "Login",
  },
  {
    path: route.register,
    element: <Register />,
    route: Route,
    title: "Register",
  },

  {
    path: route.emailVerification,
    element: <EmailVerification />,
    route: Route,
    title: "EmailVerification",
  },

  {
    path: route.resetPassword,
    element: <ResetPassword />,
    route: Route,
    title: "Reset Password",
  },
  {
    path: route.forgotPassword,
    element: <ForgotPassword />,
    route: Route,
    title: "Forgot Password",
  },

  {
    path: route.underMaintenance,
    element: <UnderMaintenance />,
    route: Route,
    title: "Under Maintenance",
  },
];
