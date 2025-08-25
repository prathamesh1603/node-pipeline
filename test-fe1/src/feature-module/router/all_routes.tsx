export const all_routes = {
  // dashboard routes
  dealsDashboard: "/dashboard/deals-dashboard",
  leadsDashboard: "/dashboard/leads-dashboard",
  productDashboard: "/dashboard/product-dashboard",

  //crm routes

  deals: "/crm/deals",
  editDealDetails: "/deals/edit/:id",
  dealsDetails: "/deals/:id",

  products: "/crm/products",
  productDetails: "/crm/product/:id",
  editProductDetails: "/crm/product/edit/:id",
  companyDetails: "/crm/company/:id",
  editCompanyDetails: "/crm/company/edit/:id",

  accounts: "/crm/accounts",
  accountGrid: "/crm/account-grid",
  accountDetails: "/crm/accounts/:id",
  companies: "/companies",
  leads: "/leads",
  editLeadDetails: "/leads/edit/:id",
  leadsDetails: "/leads/:id",

  comingSoon: "/coming-soon",

  // auth routes routes
  login: "/",
  register: "/register",
  forgotPassword: "/forgot-password",
  twoStepVerification: "/two-step-verification",
  success: "/success",
  emailVerification: "/email-verification",
  lockScreen: "/lock-screen",
  resetPassword: "/reset-password",

  // pages routes
  error404: "/error-404",
  error500: "/error-500",
  underMaintenance: "/under-maintenance",

  // settings routes
  settings: "/crm/settings",
  customModule: "/crm-settings/modules",
  fieldPermissions: "/crm-settings/modules/field-permissions",
  fieldListing: "/crm-settings/modules/field-listing",
  moduleFields: "/crm-settings/modules/fields",

  stages: "/crm-setting/stages",

  // reports routes
  companyReports: "/reports/company-reports",
  dealReports: "/reports/deal-reports",
  leadReports: "/reports/lead-reports",
  productReports: "/reports/product-reports",

  //userManagement routes
  deleteRequest: "/user-management/delete-request",
  rolesPermissions: "/user-management/roles-permissions",
  manageusers: "/user-management/manage-users",
  userDetails: "/user-management/manage-users/:id",
  editUserDetails: "/user-management/manage-users/edit/:id",
  permissions: "/user-management/permissions",
};
