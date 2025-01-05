import { dispatch } from "store";
import axios from "utils/axios";
import { openSnackbar } from "./snackbar";

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit")

const initialState = {
    action: false,
    error: null,
    drug: {},
    drugs: {
        drugs: [],
        page: null,
        total: 0,
        limit: null,
    },
    deleteddrug: {},
    uploadedImageUrl: null,
}

const drugs = createSlice({
    name: 'drugs',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },

        // GET drugS
        getDrugsSuccess(state, action) {

            state.drugs = action.payload;

            console.log("get drug success.state.data",state.drugs);


        },

        deletedrugSuccess(state, action) {
            state.deleteddrug = action.payload;
        },

        setAction(state) {
            state.action = !state.action;
        }
    }
});

export default drugs.reducer;

export function setActionDrug() {
    dispatch(drugs.actions.setAction());
}

export function getDrugs(pageIndex = 0, pageSize = 10, query) {
    return async () => {
        try {

            let requestUrl = `/api/v1/drug?page=${pageIndex + 1}&limit=${pageSize}`;

            if (query) {
                requestUrl = `${requestUrl}&query=${query}`
            }

            const response = await axios.get(requestUrl);

            if (response.status === 200) {
                dispatch(drugs.actions.getDrugsSuccess(response.data.data));
            }

        } catch (error) {
            dispatch(drugs.actions.hasError(error));
        }
    };
}



export function createDrug(formData) {
    return async () => {
        try {            
            const response = await axios.post('/api/v1/drug/add-drug',formData, {
            });

            if (response.status === 200) {

                // After successful drug creation, dispatch the setAction to trigger reactivity
                dispatch(drugs.actions.setAction());

                // Re-fetch the updated drugs list
                dispatch(getDrugs());

                dispatch(
                    openSnackbar({
                        open: true,
                        message: 'drug crated successfully.',
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
                    message: 'drug could not create.',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    },
                    close: false
                })
            );
            dispatch(drugs.actions.hasError(err));
        }
    }
}

export function updateDrug(drugId, formData) {
    return async (dispatch) => {
        try {
            const response = await axios.put(`/api/v1/drug/${drugId}/update`, formData);

            if (response.status === 200) {
                // If you need to set the user based on the updated drug, you can do this:
                dispatch(getDrugs()); // Re-fetch drugs to update the state

                dispatch(
                    openSnackbar({
                        open: true,
                        message: 'drug updated successfully.',
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
                    message: 'drug could not update.',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    },
                    close: false
                })
            );
            dispatch(drugs.actions.hasError({ message: err.message })); // Ensure payload is serializable
        }
    };
}

export function deleteDrug(drugId) {
    return async (dispatch) => {
        try {
            const response = await axios.delete(`/api/v1/drug/${drugId}/delete`);

            if (response.status === 200) {
                dispatch(drugs.actions.deletedrugSuccess(response.data.data));

                dispatch(
                    openSnackbar({
                        open: true,
                        message: 'drug deleted successfully.',
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
                    message: 'drug could not delete.',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    },
                    close: false
                })
            );
            dispatch(drugs.actions.hasError({ message: err.message })); // Ensure payload is serializable
        }
    };
}


