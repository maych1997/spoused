// chatSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk to fetch chat data from API
export const fetchChatData = createAsyncThunk(
    'chat/fetchChatData',
    async () => {
        const response = await axios.get('/path/to/getLastChatApi'); // Replace with the actual API path
        return response.data;
    }
);

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        chatData: [], // Array to store chat data
        status: 'idle', // loading, succeeded, failed
        error: null,
    },
    reducers: {
        updateChatData: (state, action) => {
            console.log("really amazing",action.payload);
            // Find the existing chat by ID and update it
            const existingChat = state.chatData.find(chat => chat.id === action.payload.id);
            if (existingChat) {
                existingChat.lastMessage = action.payload.lastMessage;
                existingChat.unseen = action.payload.unseen;
                existingChat.timeMessage = action.payload.timeMessage;
            } else {
                // Add new chat data if it doesn't exist
                state.chatData.push(action.payload);
            }
        },
    },
    extraReducers: (builder) => {

        builder
            .addCase(fetchChatData.pending, (state) => {
                state.status = 'loading';
                console.log('Fetching chat data...'); // Log when fetching starts
            })
            .addCase(fetchChatData.fulfilled, (state, action) => {
                // Update the state with the fetched data
                state.chatData = action.payload.map((chat) => ({
                    id: chat.lastMessage._id,
                    lastMessage: chat.lastMessage.content,
                    unseen: chat.numberOfUnseen,
                    timeMessage: chat.lastMessage.createdAt,
                }));
                state.status = 'succeeded';
                console.log('Chat data fetched successfully:', state.chatData); // Log the updated state
            })
            .addCase(fetchChatData.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
                console.error('Failed to fetch chat data:', action.error.message); // Log error
            });
    },
});

export const { updateChatData } = chatSlice.actions;
export default chatSlice.reducer;
export const selectChatData = (state) => state.chat.chatData;
