import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  AuthState,
  LoginInitialData,
  resetInitialData,
  SignupInitialData,
} from "../interface";
import api from "../../../utils/api";

const initialState: AuthState = {
  token: localStorage?.getItem("token")
    ? (localStorage.getItem("token") as string)
    : "",
  user: localStorage?.getItem("user")
    ? JSON.parse(localStorage.getItem("user") as string)
    : null,
  isLoggedIn: localStorage?.getItem("isLoggedIn")
    ? JSON.parse(localStorage.getItem("isLoggedIn") as string)
    : false,
  status: "idle",
  errorMsg: "",
  fetchRoleData: false,
  fetchCompanyData: false,
  companyNameArr: localStorage?.getItem("companyNameArr")
    ? JSON.parse(localStorage.getItem("companyNameArr") as string)
    : [],
  roleNamesArr: localStorage?.getItem("roleNameArr")
    ? JSON.parse(localStorage.getItem("roleNameArr") as string)
    : [],
};

export const loginForm = createAsyncThunk(
  "/login/user",
  async (data: LoginInitialData, thunkAPI) => {
    try {
      const res = await api.post("/auth/login", {
        ...data,
        populate: "role,ofCompany",
        selectPopulate: "name",
      });

      if (res) {
        return res.data;
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.msg || "Please check Your internet connection"
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "/auth/logout",
  async (_, thunkAPI) => {
    try {
      const res = await api.post("/auth/logout"); // Call the backend logout API
      if (res) {
        return res.data;
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.msg || "Error logging out. Please try again."
      );
    }
  }
);

export const signupForm = createAsyncThunk(
  "/signup/user",
  async (data: SignupInitialData, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/signup", data);
      if (res) {
        return res.data;
      }
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.msg || "Please check Your internet connection"
      );
    }
  }
);

export const resetForm = createAsyncThunk(
  "/user/reset-password",
  async (data: resetInitialData, thunkAPI) => {
    try {
      const res = await api.patch("/user/reset-password", {
        ...data,
        populate: "role,ofCompany",
        selectPopulate: "name",
      });
      if (res) {
        return res.data;
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.msg || "Please check Your internet connection"
      );
    }
  }
);

const authSlice = createSlice({
  name: "Auth",
  initialState,
  reducers: {
    resetAuthState: (state) => {
      state.status = "idle";
      state.errorMsg = "";
    },
    setCompanyNameArray: (state, action) => {
      state.companyNameArr = action.payload;
    },
    setRoleNameArr: (state, action) => {
      state.roleNamesArr = action.payload;
    },
    resetFetchCompanyRoleState: (state) => {
      state.fetchCompanyData = false;
      state.fetchRoleData = false;
    },
    setFetchCompanyData: (state) => {
      state.fetchCompanyData = true;
    },
    setFetchRoleData: (state) => {
      state.fetchRoleData = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupForm.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signupForm.fulfilled, (state, action) => {
        if (action?.payload?.status) {
          localStorage.setItem("token", action?.payload?.token);
          localStorage.setItem("isLoggedIn", JSON.stringify(true));
          localStorage.setItem("user", JSON.stringify(action?.payload?.data));
          state.status = "success";
          state.user = action?.payload?.data;
          state.isLoggedIn = true;
        }
      })
      .addCase(signupForm.rejected, (state, action) => {
        state.status = "failed";
        state.errorMsg = `${action.payload}`;
      })
      .addCase(loginForm.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginForm.fulfilled, (state, action) => {
        if (action?.payload?.status) {
          localStorage.setItem("token", action?.payload?.token);
          localStorage.setItem("isLoggedIn", JSON.stringify(true));
          localStorage.setItem("user", JSON.stringify(action?.payload?.data));
          state.user = action?.payload?.data;
          state.isLoggedIn = true;
          if (state.user.role.name === "super-admin") {
            state.fetchRoleData = true;
            state.fetchCompanyData = true;
          }
          if (state.user.role.name === "company-admin") {
            state.fetchRoleData = true;
          }
        }
      })
      .addCase(loginForm.rejected, (state, action) => {
        state.status = "failed";
        state.errorMsg = `${action.payload}`;
      })
      .addCase(resetForm.pending, (state) => {
        state.status = "loading";
      })
      .addCase(resetForm.fulfilled, (state, action) => {
        if (action?.payload?.status) {
          localStorage.setItem("token", action?.payload?.token);
          localStorage.setItem("isLoggedIn", JSON.stringify(true));
          state.status = "success";
          state.isLoggedIn = true;
        }
      })
      .addCase(resetForm.rejected, (state, action) => {
        state.status = "failed";
        state.errorMsg = `${action.payload}`;
      })
      .addCase(logoutUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.token = "";
        state.user = null;
        state.isLoggedIn = false;
        state.status = "idle";
        state.errorMsg = "";
        state.fetchRoleData = false;
        state.fetchCompanyData = false;
        state.companyNameArr = [];
        state.roleNamesArr = [];
        localStorage.clear();
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = "failed";
        state.errorMsg = `${action.payload}`;
      });
  },
});

export const {
  resetAuthState,
  setCompanyNameArray,
  setRoleNameArr,
  resetFetchCompanyRoleState,
  setFetchCompanyData,
  setFetchRoleData,
} = authSlice.actions;

export default authSlice.reducer;
