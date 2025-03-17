import {request} from "../../fetchAPI";

export const updateNameApi = async (fullName, token) => {
    try {
        const options = {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
        };
        const data = await request(
            "/api/v1/profile/updateProfile",
            "PUT",
            options,
            {
                fullName,
            }
        );
        return data;
    } catch (error) {
        throw error;
    }
};

export const updateGenderApi = async (gender, token) => {
    try {
        const options = {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
        };
        const data = await request(
            "/api/v1/profile/updateProfile",
            "PUT",
            options,
            {
                gender,
            }
        );
        return data;
    } catch (error) {
        throw error;
    }
};

export const updateBirthdayApi = async (birthday, Age, token) => {
    try {
        const options = {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
        };
        const data = await request(
            "/api/v1/profile/updateProfile",
            "PUT",
            options,
            {
                birthday,
                Age,
            }
        );

        return data;
    } catch (error) {
        throw error;
    }
};

export const updateMaritalApi = async (
    maritalStatus,
    token
) => {
    try {
        const options = {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
        };
        const data = await request(
            "/api/v1/profile/updateProfile",
            "PUT",
            options,
            {
                maritalStatus
            }
        );
        return data;
    } catch (error) {
        throw error;
    }
};

export const updateChildrenApi = async (
    children,
    token
) => {
    try {
        const options = {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
        };
        const data = await request(
            "/api/v1/profile/updateProfile",
            "PUT",
            options,
            {
                children
            }
        );
        return data;
    } catch (error) {
        throw error;
    }
};

export const updateBiographyApi = async (biography, token) => {
    try {
        const options = {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
        };
        const data = await request(
            "/api/v1/profile/updateProfile",
            "PUT",
            options,
            {
                biography,
            }
        );
        return data;
    } catch (error) {
        throw error;
    }
};

export const updateReligionApi = async (religion, token) => {
    try {
        const options = {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
        };
        const data = await request(
            "/api/v1/profile/updateProfile",
            "PUT",
            options,
            {
                religion
            }
        );
        return data;
    } catch (error) {
        throw error;
    }
};

export const updateSmokerApi = async (
    smoking,
    token
) => {
    try {
        const options = {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
        };
        const data = await request(
            "/api/v1/profile/updateProfile",
            "PUT",
            options,
            {
                smoking
            }
        );
        return data;
    } catch (error) {
        throw error;
    }
};

export const updateDrinkingApi = async (
    drink,
    token
) => {
    try {
        const options = {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
        };
        const data = await request(
            "/api/v1/profile/updateProfile",
            "PUT",
            options,
            {
                drink
            }
        );
        return data;
    } catch (error) {
        throw error;
    }
};

export const updateStarApi = async (
    starSign,
    token
) => {
    try {
        const options = {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
        };
        const data = await request(
            "/api/v1/profile/updateProfile",
            "PUT",
            options,
            {
                starSign
            }
        );
        return data;
    } catch (error) {
        throw error;
    }
};

export const updateDatingPreferenceApi = async (
    datingPreferences,
    token
) => {
    try {
        const options = {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
        };
        const data = await request(
            "/api/v1/profile/updateProfile",
            "PUT",
            options,
            {
                datingPreferences,
            }
        );
        return data;
    } catch (error) {
        throw error;
    }
};

export const updateInterestsApi = async (
    interests,
    token
) => {
    try {
        const options = {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
        };
        const data = await request(
            "/api/v1/profile/updateProfile",
            "PUT",
            options,
            {
                interests,
            }
        );

        return data;
    } catch (error) {
        throw error;
    }
};

export const updatePersonalityApi = async (
    personalityTraits,
    token
) => {
    try {
        const options = {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
        };
        const data = await request(
            "/api/v1/profile/updateProfile",
            "PUT",
            options,
            {
                personalityTraits,
            }
        );
        return data;
    } catch (error) {
        throw error;
    }
};

export const updateEducationApi = async (
    education,
    token
) => {
    try {
        console.log("kiiirrr")
        const options = {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
        };
        const data = await request(
            "/api/v1/profile/updateProfile",
            "PUT",
            options,
            {
                education
            }
        );
        return data;
    } catch (error) {
        throw error;
    }
};

export const updateProfessionApi = async (
    profession,
    token
) => {
    try {
        const options = {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
        };
        const data = await request(
            "/api/v1/profile/updateProfile",
            "PUT",
            options,
            {
                profession
            }
        );
        return data;
    } catch (error) {
        throw error;
    }
};

export const updateJobTitleApi = async (
    jobTitle,
    token
) => {
    try {
        const options = {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
        };
        const data = await request(
            "/api/v1/profile/updateProfile",
            "PUT",
            options,
            {
                jobTitle,
            }
        );
        return data;
    } catch (error) {
        throw error;
    }
};

export const updateEmployerApi = async (
    employer,
    token
) => {
    try {
        const options = {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
        };
        const data = await request(
            "/api/v1/profile/updateProfile",
            "PUT",
            options,
            {
                employer,
            }
        );
        return data;
    } catch (error) {
        throw error;
    }
};

export const updateEthnicOriginApi = async (
    ethnicGroup,
    token
) => {
    try {
        const options = {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
        };
        const data = await request(
            "/api/v1/profile/updateProfile",
            "PUT",
            options,
            {
                location: ethnicGroup,
            }
        );
        return data;
    } catch (error) {
        throw error;
    }
};

export const updateEthnicityApi = async (
    ethnicGroup,
    token
) => {
    try {
        const options = {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
        };
        const data = await request(
            "/api/v1/profile/updateProfile",
            "PUT",
            options,
            {
                ethnicGroup,
            }
        );
        return data;
    } catch (error) {
        throw error;
    }
};

export const updateLanguageApi = async (
    languages,
    token
) => {
    try {
        const options = {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
        };
        const data = await request(
            "/api/v1/profile/updateProfile",
            "PUT",
            options,
            {
                languages,
            }
        );
        return data;
    } catch (error) {
        throw error;
    }
};

export const updateHeightApi = async (
    height,
    token
) => {
    try {
        const options = {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
        };
        const data = await request(
            "/api/v1/profile/updateProfile",
            "PUT",
            options,
            {
                height,
            }
        );
        return data;
    } catch (error) {
        throw error;
    }
};
