import { dispatch } from "store";
import axios from "utils/axios";
import { openSnackbar } from "./snackbar";

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit")

const initialState = {
    action: false,
    error: null,
    patient: {},
    patients: {
        patients: [],
        page: null,
        total: null,
        limit: null,
    },
    deletedPatient: {},
    uploadedImageUrl: null,
}

const patients = createSlice({
    name: 'patients',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },

        // GET PATIENTS
        getPatientsSuccess(state, action) {
            console.log("response.data.data",action.payload);

            state.patients = action.payload;

        },

        deletePatientrSuccess(state, action) {
            state.deletedPatient = action.payload;
        },

        setAction(state) {
            state.action = !state.action;
        }
    }
});

export default patients.reducer;

export function setActionPatient() {
    dispatch(patients.actions.setAction());
}

export function getPatients() {
    return async () => {
        try {

            //let requestUrl = `/api/v1/patient?page=${pageIndex + 1}&limit=${pageSize}`;
            let requestUrl = `/api/v1/patient/get-patients`;

            // if (query) {
            //     requestUrl = `${requestUrl}&query=${query}`
            // }

            const response = await axios.get(requestUrl);

            if (response.status === 200) {
                dispatch(patients.actions.getPatientsSuccess(response.data.data));
            }

        } catch (error) {
            dispatch(patients.actions.hasError(error));
        }
    };
}



export function createPatient(formData) {
    return async () => {
        try {            
            const response = await axios.post('/api/v1/patient/add-patient',formData, {
            });

            if (response.status === 200) {

                // After successful patient creation, dispatch the setAction to trigger reactivity
                dispatch(patients.actions.setAction());

                // Re-fetch the updated patients list
                dispatch(getPatients());

                dispatch(
                    openSnackbar({
                        open: true,
                        message: 'Patient crated successfully.',
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
                    message: 'patient could not create.',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    },
                    close: false
                })
            );
            dispatch(patients.actions.hasError(err));
        }
    }
}

export function updatePatient(patientId, formData) {
    return async (dispatch) => {
        try {
            const response = await axios.put(`/api/v1/patient/${patientId}/update`, formData);

            if (response.status === 200) {
                // If you need to set the user based on the updated patient, you can do this:
                dispatch(getPatients()); // Re-fetch patients to update the state

                dispatch(
                    openSnackbar({
                        open: true,
                        message: 'Patient updated successfully.',
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
                    message: 'Patient could not update.',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    },
                    close: false
                })
            );
            dispatch(patients.actions.hasError({ message: err.message })); // Ensure payload is serializable
        }
    };
}


//update patient status
export function updatePatientStatus(id, state) {
    return async () => {
        try {
            const response = await axios.put(`/api/v1/patient/update-state`, {
                id, 
                state 
            });

            if (response.status === 200) {
                dispatch(patients.actions.setAction());
                dispatch(getPatients());
                dispatch(
                    openSnackbar({
                        open: true,
                        message: 'Patient status updated successfully.',
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
                    message: 'Patient status could not update.',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    },
                    close: false
                })
            );
            dispatch(patients.actions.hasError(err));
        }
    }
}

export function deletePatient(id) {
    return async () => {
        try {
            const response = await axios.delete(`/api/v1/patient/${id}/delete`);

            if (response.status === 200) {
                dispatch(patients.actions.deletePatientrSuccess(response.data.data));
                dispatch(
                    openSnackbar({
                        open: true,
                        message: 'Patient deleted successfully.',
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
                    message: 'Patient could not delete.',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    },
                    close: false
                })
            );
            dispatch(patients.actions.hasError(err));
        }
    }
}
