import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../Services/Axios";
import { toast } from "react-toastify";

// Async thunks
export const fetchUsers = createAsyncThunk(
  "userMaster/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/master-user/get");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error");
    }
  }
);

export const fetchDesignations = createAsyncThunk(
  "designation/fetchDesignations",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/designations/get");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error");
    }
  }
);

export const fetchDepartments = createAsyncThunk(
  "department/fetchDepartments",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/departments/get");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error");
    }
  }
);

export const addUser = createAsyncThunk(
  "userMaster/addUser",
  async (payload, { rejectWithValue }) => {
    try {
      // For general users, remove password fields from payload
      const dataToSend = { ...payload };
      if (dataToSend.userType !== "Admin") {
        delete dataToSend.password;
        delete dataToSend.confirmPassword;
      }

      const res = await API.post("/master-user/create", dataToSend);
      toast.success(res.data?.message || "User added successfully!");
      return {
        payload: dataToSend,
        response: res.data,
      };
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add user");
      return rejectWithValue(err.response?.data);
    }
  }
);

export const updateUser = createAsyncThunk(
  "userMaster/updateUser",
  async (payload, { rejectWithValue }) => {
    try {
      // For general users, remove password fields from payload
      const dataToSend = { ...payload };
      if (dataToSend.userType !== "Admin") {
        delete dataToSend.password;
        delete dataToSend.confirmPassword;
      }

      const response = await API.post(`/users/edit/${payload.id}`, dataToSend);
      toast.success(response.data?.message || "User updated successfully");
      return {
        ...dataToSend,
        response: response.data,
      };
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update user");
      return rejectWithValue(error.response?.data);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "userMaster/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      const res = await API.post(`/users/delete/${id}`);
      toast.success(res.data?.message || "User deleted successfully");
      return id;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
      return rejectWithValue(error.response?.data);
    }
  }
);

const UserMasterSlice = createSlice({
  name: "userMaster",
  initialState: {
    users: {
      total: 0,
      pages: 0,
      currentPage: 1,
      users: [],
    },
    designations: [],
    departments: [],
    status: "idle",
    error: null,
    isModalOpen: false,
    currentUser: null,
    operationStatus: "idle",
    operationError: null,
  },
  reducers: {
    openUserModal: (state, action) => {
      state.isModalOpen = true;
      state.currentUser = action.payload || null;
    },
    closeUserModal: (state) => {
      state.isModalOpen = false;
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users cases
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchDesignations.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDesignations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.designations = action.payload;
      })
      .addCase(fetchDesignations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchDepartments.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.departments = action.payload;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Add user cases
      .addCase(addUser.pending, (state) => {
        state.operationStatus = "loading";
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.operationStatus = "idle";

        // Generate a new unique ID if one isn't provided by the API
        const maxId =
          state.users.users.length > 0
            ? Math.max(
                ...state.users.users.map((u) =>
                  typeof u.id === "number" ? u.id : 0
                )
              )
            : 0;

        const newId = maxId + 1;

        // Get the response data and payload data
        const responseData = action.payload.response?.data || {};
        const submittedData = action.payload.payload;

        // Create a properly structured new user item
        const newUser = {
          id: responseData.id || newId,
          username: submittedData.username,
          designation: submittedData.designation,
          department: submittedData.department,
          status: submittedData.status || "Active",
          email: submittedData.email,
          mobile: submittedData.mobile,
          userType: submittedData.userType,
          mode: "added",
          createdAt: new Date().toISOString(),
        };

        // Insert the new user at the beginning of the array
        if (state.users && state.users.users) {
          state.users.users = [newUser, ...state.users.users];

          // Update total count
          state.users.total = (state.users.total || 0) + 1;
        }

        state.isModalOpen = false;
        state.currentUser = null;
      })
      .addCase(addUser.rejected, (state, action) => {
        state.operationStatus = "failed";
        state.operationError = action.payload;
      })

      // Update user cases
      .addCase(updateUser.pending, (state) => {
        state.operationStatus = "loading";
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.operationStatus = "idle";

        if (state.users && state.users.users) {
          state.users.users = state.users.users.map((user) => {
            if (user.id === action.payload.id) {
              return {
                ...user,
                username: action.payload.username,
                designation: action.payload.designation,
                department: action.payload.department,
                status: action.payload.status,
                email: action.payload.email,
                mobile: action.payload.mobile,
                userType: action.payload.userType,
                mode: "modified",
              };
            }
            return user;
          });
        }
        state.isModalOpen = false;
        state.currentUser = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.operationStatus = "failed";
        state.operationError = action.payload;
      })

      // Delete user cases
      .addCase(deleteUser.pending, (state) => {
        state.operationStatus = "loading";
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.operationStatus = "idle";

        if (state.users && state.users.users) {
          // Remove the user from the array
          state.users.users = state.users.users.filter(
            (user) => user.id !== action.payload
          );

          // Update total count
          if (state.users.total > 0) {
            state.users.total -= 1;
          }
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.operationStatus = "failed";
        state.operationError = action.payload;
      });
  },
});

export const { openUserModal, closeUserModal } = UserMasterSlice.actions;
export default UserMasterSlice.reducer;
