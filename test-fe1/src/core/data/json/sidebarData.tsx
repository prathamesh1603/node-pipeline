import { all_routes } from "../../../feature-module/router/all_routes";
const route = all_routes;
export const SidebarData = [
  {
    label: "MAIN MENU",
    submenuOpen: true,
    showSubRoute: false,
    submenuHdr: "Main",
    submenuItems: [
      {
        label: "Dashboard",
        icon: "ti ti-layout-2",
        submenu: true,
        showSubRoute: false,

        submenuItems: [
          { label: "Leads Dashboard", link: route.leadsDashboard },
          { label: "Deals Dashboard", link: route.dealsDashboard },
          { label: "Product Dashboard", link: route.productDashboard },
        ],
      },
    ],
  },
  {
    label: "CRM",
    submenuOpen: true,
    showSubRoute: false,
    submenuHdr: "Inventory",

    submenuItems: [
      {
        label: "Leads",
        link: route.leads,
        subLink1: route.leadsDetails,
        icon: "ti ti-chart-arcs",
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Accounts",
        link: route.accounts,
        subLink1: route.accountGrid,
        subLink2: route.accountDetails,
        icon: "ti ti-user-up",
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Deals",
        link: route.deals,
        subLink2: route.dealsDetails,
        icon: "ti ti-medal",
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Products",
        link: route.products,
        icon: "ti ti-atom-2",
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Companies",
        link: route.companies,
        subLink1: route.companyDetails,
        // subLink2: route.companiesGrid,
        icon: "ti ti-building-community",
        showSubRoute: false,
        submenu: false,
      },
    ],
  },
  {
    label: "REPORTS",
    submenuOpen: true,
    showSubRoute: false,
    submenuHdr: "Finance & Accounts",
    submenuItems: [
      {
        label: "Reports",
        submenu: true,
        showSubRoute: false,
        icon: "ti ti-file-invoice",
        submenuItems: [
          {
            label: "Lead Reports",
            link: route.leadReports,
            showSubRoute: false,
          },
          {
            label: "Deal Reports",
            link: route.dealReports,
            showSubRoute: false,
          },
          {
            label: "Product Reports",
            link: route.productReports,
            showSubRoute: false,
          },
        ],
      },
    ],
  },
];
