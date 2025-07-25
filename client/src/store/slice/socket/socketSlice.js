// import { createSlice } from '@reduxjs/toolkit';
// import { io } from 'socket.io-client';

// const initialState = {
//   socket: null,
// };

// const socketSlice = createSlice({
//   name: 'socket',
//   initialState,
//   reducers: {
//     initializeSocket: (state, action) => {
//       if (!state.socket) {
//         const socket = io(import.meta.env.VITE_DB_ORIGIN, {
//           withCredentials: true,
//           query: { userId: action?.payload }, // e.g., seekerId or donorId
//         });

//         state.socket = socket;
//       }
//     },

//     disconnectSocket: (state) => {
//       if (state.socket) {
//         state.socket.disconnect();
//         state.socket = null;
//       }
//     },
//   },
// });

// export const { initializeSocket, setSocket, disconnectSocket } = socketSlice.actions;
// export default socketSlice.reducer;



import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isConnected: false,
};

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    setSocketConnected: (state, action) => {
      state.isConnected = action.payload;
    },
  },
});


export const { setSocketConnected } = socketSlice.actions;
export default socketSlice.reducer;
