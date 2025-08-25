import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  fields: [], // Initial state for fields
  hasChanges: false, // Tracks if there are unsaved changes
};

const fieldSlice = createSlice({
  name: "field",
  initialState,
  reducers: {
    // Action to update a specific field
    updateField: (state, action) => {
      const { fieldGroupId, fieldId, updatedProperties } = action.payload;
      const fieldGroup = state.fields.find(
        (group) => group._id === fieldGroupId
      );
      if (fieldGroup) {
        const fieldIndex = fieldGroup.groupFields.findIndex(
          (field) => field._id === fieldId
        );
        if (fieldIndex !== -1) {
          fieldGroup.groupFields[fieldIndex] = {
            ...fieldGroup.groupFields[fieldIndex],
            ...updatedProperties,
          };
          state.hasChanges = true; // Mark state as having unsaved changes
        }
      }
    },
    // Action to update the group name
    updateGroupName: (state, action) => {
      const { fieldGroupId, newName } = action.payload;
      const fieldGroup = state.fields.find(
        (group) => group._id === fieldGroupId
      );
      if (fieldGroup) {
        fieldGroup.groupName = newName;
        state.hasChanges = true;
      }
    },
    // Action to initialize fields
    setFields: (state, action) => {
      state.fields = action.payload;
      state.hasChanges = false;
    },

    resetFields: (state) => {
      state.fields = [];
      state.hasChanges = false;
    },
  },
});

export const { updateField, updateGroupName, setFields, resetFields } =
  fieldSlice.actions;
export default fieldSlice.reducer;
