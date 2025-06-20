import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IProjectState } from "../../interfaces/interfaces";

const initialState: IProjectState = {
  selectedProjectId: null,
  groupChatProjectId: null,
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setSelectedProjectId(state, action: PayloadAction<string | null>) {
      state.selectedProjectId = action.payload;
    },
    setGroupChatProjectId(state, action: PayloadAction<string | null>) {
      state.groupChatProjectId = action.payload;
    },
  },
});

export const {setSelectedProjectId, setGroupChatProjectId} = projectSlice.actions;

export default projectSlice.reducer;
