import {createSlice} from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import chat from "@/screens/chat/Chat";

const initialState = {
    user: null,
    token: null,
    fullName: "", // Add fullName field
    loading: false, // Track loading state
    userMatches: [], // Store user matches data
    chatData: [],
    updatedMessages: [],
    imageUser:[],
};

// export const setUserMatches = (matches) => ({
//   type: "auth/setUserMatches",
//   payload: matches,
// });
//
// export const setLoadingComplete = (isLoadingComplete) => ({
//   type: "auth/setLoadingComplete",
//   payload: isLoadingComplete,
// });

export const updateFullName = (fullName) => ({
    type: "auth/updateFullName",
    payload: {fullName},
});
export const updateBirthday = (birthday) => ({
    type: "auth/updateBirthday",
    payload: {birthday},
});
export const updateAge = (Age) => ({
    type: "auth/updateAge",
    payload: {Age},
});
export const updateGender = (gender) => ({
    type: "auth/updateGender",
    payload: {gender},
});
export const updatePhone = (phoneNumber) => ({
    type: "auth/updatePhone",
    payload: {phoneNumber},
});
export const updateProfession = (profession) => ({
    type: "auth/updateProfession",
    payload: {profession},
});
export const updateEthnicGroup = (ethnicGroup) => ({
    type: "auth/updateEthnicGroup",
    payload: {ethnicGroup},
});
export const updateEducation = (education) => ({
    type: "auth/updateEducation",
    payload: {education},
});
export const updateLocation = (location) => ({
    type: "auth/updateLocation",
    payload: {location},
});
export const updateHeight = (height) => ({
    type: "auth/updateHeight",
    payload: {height},
});
export const updateMaritalStatus = (maritalStatus) => ({
    type: "auth/updateMaritalStatus",
    payload: {maritalStatus},
});

export const updatemyprofile = (myprofile) => ({
    type: "auth/updatemyprofile",
    payload: {myprofile},
});

export const updateDatingPreferences = (datingPreferences) => ({
    type: "auth/updateDatingPreferences",
    payload: {datingPreferences},
});
export const updateSmoking = (smoking) => ({
    type: "auth/updateSmoking",
    payload: {smoking},
});
export const updateChildren = (children) => ({
    type: "auth/updateChildren",
    payload: {children},
});
export const updatelookingFor = (lookingFor) => ({
    type: "auth/updatelookingFor",
    payload: {lookingFor},
});
export const updatereligion = (religion) => ({
    type: "auth/updatereligion",
    payload: {religion},
});
export const updatedrink = (drink) => ({
    type: "auth/updatedrink",
    payload: {drink},
});
export const updatestarSign = (starSign) => ({
    type: "auth/updatestarSign",
    payload: {starSign},
});
export const updateinterests = (interests) => ({

    type: "auth/updateinterests",
    payload: {interests},
});
export const updatepersonalityTraits = (personalityTraits) => ({
    type: "auth/updatepersonalityTraits",
    payload: {personalityTraits},
});
export const updatebiography = (biography) => ({
    type: "auth/updatebiography",
    payload: {biography},
});
export const updatephotos = (photos) => ({
    type: "auth/updatephotos",
    payload: {photos},
});
export const updateVideo = (videoUrl) => ({
    type: "auth/updateVideo",
    payload: {videoUrl},
});
export const clearPhotos = () => ({
    type: "auth/clearPhotos",
});

export const updateEthnicityFilter = (ethnicityfilter) => ({
    type: "auth/updateEthnicityFilter",
    payload: {ethnicityfilter},
});
export const updateGenderFilter = (genderfilter) => ({
    type: "auth/updateGenderFilter",
    payload: {genderfilter},
});
export const updateHeightFilter = (heightfilter) => ({
    type: "auth/updateHeightFilter",
    payload: {heightfilter},
});
export const updatemaritalstatusfilter = (maritalstatusfilter) => ({
    type: "auth/updatemaritalstatusfilter",
    payload: {maritalstatusfilter},
});
export const updatechildrenfilter = (childrenfilter) => ({
    type: "auth/updatechildrenfilter",
    payload: {childrenfilter},
});
export const updateeducationfilter = (educationfilter) => ({
    type: "auth/updateeducationfilter",
    payload: {educationfilter},
});
export const updateprofessionfilter = (professionfilter) => ({
    type: "auth/updateprofessionfilter",
    payload: {professionfilter},
});
export const updatelanguagefilter = (languagefilter) => ({
    type: "auth/updatelanguagefilter",
    payload: {languagefilter},
});
export const updatereligionfilter = (religionfilter) => ({
    type: "auth/updatereligionfilter",
    payload: {religionfilter},
});
export const updatesmokefilter = (smokefilter) => ({
    type: "auth/updatesmokefilter",
    payload: {smokefilter},
});
export const updatedrinkfilter = (drinkfilter) => ({
    type: "auth/updatedrinkfilter",
    payload: {drinkfilter},
});
export const updatestarsignfilter = (starsignfilter) => ({
    type: "auth/updatestarsignfilter",
    payload: {starsignfilter},
});
export const updateinterestsfilter = (interestsfilter) => ({
    type: "auth/updateinterestsfilter",
    payload: {interestsfilter},
});
export const updatetraitsfilter = (traitsfilter) => ({
    type: "auth/updatetraitsfilter",
    payload: {traitsfilter},
});
export const updateaudiofileredux = (audiofileredux) => ({
    type: "auth/updateaudiofileredux",
    payload: {audiofileredux},
});
export const updateimage1redux = (image1redux) => ({
    type: "auth/updateimage1redux",
    payload: {image1redux},
});
export const updateimage2redux = (image2redux) => ({
    type: "auth/updateimage2redux",
    payload: {image2redux},
});
export const updatebioredux = (bioredux) => ({
    type: "auth/updatebioredux",
    payload: {bioredux},
});
export const updateaudiofilefinalredux = (audiofilefinalredux) => ({
    type: "auth/updateaudiofilefinalredux",
    payload: {audiofilefinalredux},
});


export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login(state, action) {
            state.user = action.payload.user;
            state.token = action.payload.token;
            saveStateToStorage(state);
        },
        register(state, action) {
            state.user = action.payload.user;
            state.token = action.payload.token;
            saveStateToStorage(state);
        },
        logout(state) {
            state.user = null;
            state.token = null;
            console.log("remove the storage of the redux");
            clearStorage();
        },
        updateUser(state, action) {
            state.user = action.payload
            saveStateToStorage(state);
        },
        // New reducers for loading and user matches
        setUserMatches(state, action) {
            state.userMatches = action.payload;

        },
        // Reducer for setting chat data
        setChatData: (state, action) => {
            state.chatData = action.payload;
        },

        setImageUser: (state, action) => {
            state.imageUser = action.payload;

        },


        addImageUser: (state, action) => {
            if (!state.imageUser) {
                state.imageUser = []; // Ensure it's initialized
            }
            const newUserPhoto = action.payload;

            const existingIndex =state.imageUser.findIndex(
                user => user.id === newUserPhoto.id
            );


            if (existingIndex !== -1) {
                // Replace the existing message and ensure it includes "chat" and "messages" fields
                state.imageUser[existingIndex] = newUserPhoto;
            } else {
                state.imageUser.push(newUserPhoto);
            }

        },

        setUpdatedMessages: (state, action) => {
            state.updatedMessages = action.payload;
        },

        // Reducer for adding a new chat message
        // addChatMessage: (state, action) => {
        //     state.chatData.push(action.payload);
        // },

        addUpdatedMessages: (state, action) => {
            if (!state.updatedMessages) {
                state.updatedMessages = []; // Ensure it's initialized
            }
            const newMessage = action.payload;
            // console.log("newMessage:", newMessage);
            const existingIndex =state.updatedMessages.findIndex(
                chat => chat.lastMessage.chat === newMessage.lastMessage.chat
            );


            if (existingIndex !== -1) {
                // Replace the existing message and ensure it includes "chat" and "messages" fields
                state.updatedMessages[existingIndex] = newMessage;
            } else {
                state.updatedMessages.push(newMessage);
                }

        },




        addChatMessage: (state, action) => {
            const newMessage = action.payload;
            const existingIndex = state.chatData.findIndex(
                chat => chat.lastMessage.chat === newMessage.lastMessage.chat
            );
            if (existingIndex !== -1) {
                // If a message with the same lastMessage.chat exists, replace it
                state.chatData[existingIndex] = newMessage;
            } else {
                // If not, add the new message to the array
                state.chatData.push(newMessage);
            }
        },
        // Reducer for updating an existing chat message
        updateChatMessage: (state, action) => {
            const {id, content} = action.payload;
            const chatIndex = state.chatData.findIndex(chat => chat.id === id);
            if (chatIndex !== -1) {
                state.chatData[chatIndex].content = content;
            }
        },
        setLoadingComplete(state, action) {
            state.loading = action.payload;

        },
        updateFullName(state, action) {
            state.user = {...state.user, fullName: action.payload.fullName};
            saveStateToStorage(state);
        },
        updateBirthday(state, action) {
            state.user = {...state.user, birthday: action.payload.birthday};
            saveStateToStorage(state);
        },
        updateAge(state, action) {
            state.user = {...state.user, Age: action.payload.Age};
            saveStateToStorage(state);
        },
        updateGender(state, action) {
            state.user = {...state.user, gender: action.payload.gender};
            saveStateToStorage(state);
        },
        updatePhone(state, action) {
            state.user = {...state.user, phoneNumber: action.payload.phoneNumber};
            saveStateToStorage(state);
        },
        updateProfession(state, action) {
            state.user = {...state.user, profession: action.payload.profession};
            saveStateToStorage(state);
        },
        updateEthnicGroup(state, action) {
            state.user = {...state.user, ethnicGroup: action.payload.ethnicGroup};
            saveStateToStorage(state);
        },
        updateEducation(state, action) {
            state.user = {...state.user, education: action.payload.education};
            saveStateToStorage(state);
        },
        updateLocation(state, action) {
            state.user = {...state.user, location: action.payload.location};
            saveStateToStorage(state);
        },
        updateHeight(state, action) {
            state.user = {...state.user, height: action.payload.height};
            saveStateToStorage(state);
        },
        updateMaritalStatus(state, action) {
            state.user = {
                ...state.user,
                maritalStatus: action.payload.maritalStatus,
            };
            saveStateToStorage(state);
        },
        updateDatingPreferences(state, action) {
            state.user = {
                ...state.user,
                datingPreferences: action.payload.datingPreferences,
            };
            saveStateToStorage(state);
        },
        updateSmoking(state, action) {
            state.user = {
                ...state.user,
                smoking: action.payload.smoking,
            };
            saveStateToStorage(state);
        },
        updateChildren(state, action) {
            state.user = {
                ...state.user,
                children: action.payload.children,
            };
            saveStateToStorage(state);
        },
        updatelookingFor(state, action) {
            state.user = {
                ...state.user,
                lookingFor: action.payload.lookingFor,
            };
            saveStateToStorage(state);
        },
        updatereligion(state, action) {
            state.user = {
                ...state.user,
                religion: action.payload.religion,
            };
            saveStateToStorage(state);
        },
        updatedrink(state, action) {
            state.user = {
                ...state.user,
                drink: action.payload.drink,
            };
            saveStateToStorage(state);
        },
        updatestarSign(state, action) {
            state.user = {
                ...state.user,
                starSign: action.payload.starSign,
            };
            saveStateToStorage(state);
        },
        updateinterests(state, action) {
            state.user = {
                ...state.user,
                interests: action.payload.interests,
            };
            saveStateToStorage(state);
        },
        updatepersonalityTraits(state, action) {
            state.user = {
                ...state.user,
                personalityTraits: action.payload.personalityTraits,
            };
            saveStateToStorage(state);
        },
        updatebiography(state, action) {
            state.user = {
                ...state.user,
                biography: action.payload.biography,
            };
            saveStateToStorage(state);
        },
        updatephotos(state, action) {
            state.user = {
                ...state.user,
                photos: action.payload.photos,
            };
            saveStateToStorage(state);
        },
        updateVideo(state, action) {
            state.user = {
                ...state.user,
                videoUrl: action.payload.videoUrl,
            };
            saveStateToStorage(state);
        },
        clearPhotos(state) {
            state.user = {
                ...state.user,
                photos: [],
            };
            saveStateToStorage(state);
        },
        updateEthnicityFilter(state, action) {
            state.user = {
                ...state.user,
                ethnicityfilter: action.payload.ethnicityfilter,
            };
            saveStateToStorage(state);
        },
        updateGenderFilter(state, action) {
            state.user = {
                ...state.user,
                genderfilter: action.payload.genderfilter,
            };
            saveStateToStorage(state);
        },
        updateHeightFilter(state, action) {
            state.user = {
                ...state.user,
                heightfilter: action.payload.heightfilter,
            };
            saveStateToStorage(state);
        },
        updatemaritalstatusfilter(state, action) {
            state.user = {
                ...state.user,
                maritalstatusfilter: action.payload.maritalstatusfilter,
            };
            saveStateToStorage(state);
        },
        updatechildrenfilter(state, action) {
            state.user = {
                ...state.user,
                childrenfilter: action.payload.childrenfilter,
            };
            saveStateToStorage(state);
        },
        updateeducationfilter(state, action) {
            state.user = {
                ...state.user,
                educationfilter: action.payload.educationfilter,
            };
            saveStateToStorage(state);
        },
        updateprofessionfilter(state, action) {
            state.user = {
                ...state.user,
                professionfilter: action.payload.professionfilter,
            };
            saveStateToStorage(state);
        },
        updatelanguagefilter(state, action) {
            state.user = {
                ...state.user,
                languagefilter: action.payload.languagefilter,
            };
            saveStateToStorage(state);
        },
        updatereligionfilter(state, action) {
            state.user = {
                ...state.user,
                religionfilter: action.payload.religionfilter,
            };
            saveStateToStorage(state);
        },
        updatesmokefilter(state, action) {
            state.user = {
                ...state.user,
                smokefilter: action.payload.smokefilter,
            };
            saveStateToStorage(state);
        },
        updatedrinkfilter(state, action) {
            state.user = {
                ...state.user,
                drinkfilter: action.payload.drinkfilter,
            };
            saveStateToStorage(state);
        },
        updatestarsignfilter(state, action) {
            state.user = {
                ...state.user,
                starsignfilter: action.payload.starsignfilter,
            };
            saveStateToStorage(state);
        },
        updateinterestsfilter(state, action) {
            state.user = {
                ...state.user,
                interestsfilter: action.payload.interestsfilter,
            };
            saveStateToStorage(state);
        },
        updatetraitsfilter(state, action) {
            state.user = {
                ...state.user,
                traitsfilter: action.payload.traitsfilter,
            };
            saveStateToStorage(state);
        },
        updateaudiofileredux(state, action) {
            state.user = {
                ...state.user,
                audiofileredux: action.payload.audiofileredux,
            };
            saveStateToStorage(state);
        },
        updateimage1redux(state, action) {
            state.user = {
                ...state.user,
                image1redux: action.payload.image1redux,
            };
            saveStateToStorage(state);
        },
        updateimage2redux(state, action) {
            state.user = {
                ...state.user,
                image2redux: action.payload.image2redux,
            };
            saveStateToStorage(state);
        },
        updatemyprofile(state, action) {
            state.user = {
                ...state.user,
                myprofile: action.payload.myprofile,
            };
            saveStateToStorage(state);
        },
        updatebioredux(state, action) {
            state.user = {
                ...state.user,
                bioredux: action.payload.bioredux,
            };
            saveStateToStorage(state);
        },
        updateaudiofilefinalredux(state, action) {
            state.user = {
                ...state.user,
                audiofilefinalredux: action.payload.audiofilefinalredux,
            };
            saveStateToStorage(state);
        },
    },
});

export const {login, register, logout, updateUser, setUserMatches, setLoadingComplete,setChatData, addChatMessage,updateChatMessage,updatedMessages,addUpdatedMessages,addImageUser,imageUser} = authSlice.actions;

export default authSlice.reducer;

// Helper functions

export const saveStateToStorage = async (state) => {
    try {
        await AsyncStorage.setItem("authState", JSON.stringify(state));
    } catch (error) {
        console.error("Error saving state to storage:", error);
    }
};

export const clearStorage = async () => {
    try {
        await AsyncStorage.removeItem("authState");
    } catch (error) {
        console.error("Error clearing storage:", error);
    }
};
