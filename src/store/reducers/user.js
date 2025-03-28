import { dispatch } from "store";
import axios from "utils/axios";
import { openSnackbar } from "./snackbar";

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit")

const initialState = {
    action: false,
    error: null,
    user: {},
    users: {
        users: [],
        page: null,
        total: null,
        limit: null,
    },
    deletedUser: {},
    uploadedImageUrl: null,
}

const users = createSlice({
    name: 'users',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },

        // GET CUSTOMERS
        getUsersSuccess(state, action) {
            state.users = action.payload;
            console.log("get users success.state.data",state.users);
        },

        deleteUserSuccess(state, action) {
            state.deletedUser = action.payload;
        },

        setAction(state) {
            state.action = !state.action;
        },

        setUploadedImageSuccess(state, action) {
            state.uploadedImageUrl = action.payload;
        }
    }
});

export default users.reducer;

export function setActionUser() {
    dispatch(users.actions.setAction());
}

export function getUsers(pageIndex = 0, pageSize = 10, query) {
    return async () => {
        try {

            let requestUrl = `/api/v1/user?page=${pageIndex + 1}&limit=${pageSize}`;

            if (query) {
                requestUrl = `${requestUrl}&query=${query}`
            }

            const response = await axios.get(requestUrl);

            if (response.status === 200) {
                dispatch(users.actions.getUsersSuccess(response.data.data));
            }

        } catch (error) {
            dispatch(users.actions.hasError(error));
        }
    };
}

//get user role=doctor
export function getUsersByDoctor(pageIndex = 0, pageSize = 10, query) {
    return async () => {
        try {

            let requestUrl = `/api/v1/user/doctor?page=${pageIndex + 1}&limit=${pageSize}`;

            if (query) {
                requestUrl = `${requestUrl}&query=${"query"}`
            }

            const response = await axios.get(requestUrl);

            if (response.status === 200) {
                dispatch(users.actions.getUsersSuccess(response.data.data));
            }

        } catch (error) {
            dispatch(users.actions.hasError(error));
        }
    };
}

export function createUser(formData) {
    return async () => {
        try {            
            const response = await axios.post('/api/v1/user',formData, {
            });

            if (response.status === 200) {

                setActionUser();

                dispatch(
                    openSnackbar({
                        open: true,
                        message: 'User crated successfully.',
                        variant: 'alert',
                        alert: {
                            color: 'success'
                        },
                        close: false
                    })
                );
            }


        } catch (err) {
            dispatch(
                openSnackbar({
                    open: true,
                    message: 'User could not create.',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    },
                    close: false
                })
            );
            dispatch(users.actions.hasError(err));
        }
    }
}

export function updateUser(userId, formData) {
    return async () => {
        try {
            const response = await axios.put(`/api/v1/user/${userId}/update`,formData, {
                // ...values,
                // start_date: values.startdate,
                // role_id: values.role,
                // job_role: values.jobrole,
                // photo: values.imageUrl,
                // document: values.imageUrl, // TODO: replace document
                // dateOfBirth: values.dob
            });

            if (response.status === 200) {

                setActionUser();

                dispatch(
                    openSnackbar({
                        open: true,
                        message: 'User updated successfully.',
                        variant: 'alert',
                        alert: {
                            color: 'success'
                        },
                        close: false
                    })
                );
            }


        } catch (err) {
            dispatch(
                openSnackbar({
                    open: true,
                    message: 'User could not update.',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    },
                    close: false
                })
            );
            dispatch(users.actions.hasError(err));
        }
    }
}

export function deleteUser(userId) {
    return async () => {
        try {
            const response = await axios.delete(`/api/v1/user/${userId}/delete`);

            if (response.status === 200) {

                dispatch(users.actions.deleteUserSuccess(response.data));

                setActionUser();

                dispatch(
                    openSnackbar({
                        open: true,
                        message: 'User deleted successfully.',
                        variant: 'alert',
                        alert: {
                            color: 'success'
                        },
                        close: false
                    })
                );
            }

        } catch (error) {
            dispatch(
                openSnackbar({
                    open: true,
                    message: 'User deleted failed.',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    },
                    close: false
                })
            );
            dispatch(users.actions.hasError(error));
        }
    };
}

export const uploadUserImage = createAsyncThunk('', async (image) => {
    try {

        dispatch(
            openSnackbar({
                open: true,
                message: 'Uploading image...',
                variant: 'alert',
                alert: {
                    color: 'info'
                },
                close: false
            })
        );

        let formData = new FormData();
        formData.append("file", image);

        const response = await axios.post(`/api/v1/media/file-upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        if (response.status === 200) {

            dispatch(
                openSnackbar({
                    open: true,
                    message: 'Image uploaded successfully',
                    variant: 'alert',
                    alert: {
                        color: 'success'
                    },
                    close: false
                })
            );

            dispatch(users.actions.setUploadedImageSuccess(response.data.data.file_url));

            return response.data.data.file_url;
        }

    } catch (err) {
        dispatch(
            openSnackbar({
                open: true,
                message: 'Customer could not update.',
                variant: 'alert',
                alert: {
                    color: 'error'
                },
                close: false
            })
        );
        dispatch(users.actions.hasError(error));
    }
});