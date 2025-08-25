import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  darkMode: false,
  activityTogglePopup: false,
  activityTogglePopupTwo: false,
  activityTogglePopupThree: false,
  toggleAddCampaign: false,
  themeSettings: false,
  modalTitle: "",
  addTogglePopupTwo: false,
  headerCollapse: false,
  mobileSidebar: false,
  miniSidebar: false,
  expandMenu: false,
  selectedId: "",
  selectedData: [],
  companyId: null,
  roles: [],
  filters: {
    searchKey: undefined,
    searchText: undefined,
    filterStatus: undefined,
    selectedCompany: null,
  },
  showModal: true,
};
const commonSlice = createSlice({
  name: "CRMS",
  initialState,
  reducers: {
    setDarkMode: (state, { payload }) => {
      state.darkMode = payload;
    },
    setActivityTogglePopup: (state, { payload }) => {
      state.activityTogglePopup = payload;
    },
    setAddTogglePopupTwo: (state, { payload }) => {
      state.addTogglePopupTwo = payload;
    },
    setActivityTogglePopupTwo: (state, { payload }) => {
      state.activityTogglePopupTwo = payload;
    },
    setActivityTogglePopupThree: (state, { payload }) => {
      state.activityTogglePopupThree = payload;
    },
    setToggleAddCampaign: (state, { payload }) => {
      state.toggleAddCampaign = payload;
    },
    setThemeSettings: (state, { payload }) => {
      state.themeSettings = payload;
    },
    setModalTitle: (state, { payload }) => {
      state.modalTitle = payload;
    },
    setHeaderCollapse: (state, { payload }) => {
      state.headerCollapse = payload;
    },
    setMobileSidebar: (state, { payload }) => {
      state.mobileSidebar = payload;
    },
    setMiniSidebar: (state, { payload }) => {
      state.miniSidebar = payload;
    },
    setExpandMenu: (state, { payload }) => {
      state.expandMenu = payload;
    },
    setSelectedId: (state, { payload }) => {
      state.selectedId = payload;
    },
    setSelectedData: (state, { payload }) => {
      state.selectedData = payload;
    },
    setRoles: (state, { payload }) => {
      if (!state.roles.includes(payload)) {
        state.roles.push(payload);
      }
    },
    setFilters: (state, { payload }) => {
      state.filters = {
        ...state.filters,
        ...payload, // Merge with existing filters
      };
    },
    resetFilters: (state) => {
      state.filters = {
        searchKey: undefined,
        searchText: undefined,
        filterStatus: undefined,
        selectedCompany: null,
      };
    },
    setShowModal: (state, { payload }) => {
      state.showModal = payload;
    },

    setCompanyId: (state, { payload }) => {
      state.companyId = payload;
    },
  },
});

export const { setDarkMode, setToggleAddCampaign, setAddTogglePopupTwo } =
  commonSlice.actions;
export const {
  setActivityTogglePopup,
  setHeaderCollapse,
  setMobileSidebar,
  setMiniSidebar,
  setExpandMenu,
} = commonSlice.actions;
export const { setActivityTogglePopupTwo } = commonSlice.actions;
export const { setActivityTogglePopupThree } = commonSlice.actions;
export const { setThemeSettings } = commonSlice.actions;
export const { setModalTitle, setShowModal, setCompanyId } =
  commonSlice.actions;
export const {
  setSelectedId,
  setSelectedData,
  setRoles,
  setFilters,
  resetFilters,
} = commonSlice.actions;

export default commonSlice.reducer;
export const setToogleHeader = (payload) => ({
  type: "toggle_header",
  payload,
});
