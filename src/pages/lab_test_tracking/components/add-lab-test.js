import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Chip,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  FormHelperText,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third-party
import _ from 'lodash';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

// project imports
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';

import { ThemeMode } from 'config';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

// assets
import { CameraOutlined, DeleteFilled } from '@ant-design/icons';
import { createUser, deleteUser, updateUser, uploadUserImage } from 'store/reducers/user';
// import { UserRoles } from 'config';
import { useSelector } from 'store';

// ==============================|| USER ADD / EDIT / DELETE ||============================== //

const AddLabTest = ({ user, onCancel }) => {
  const [openAlert, setOpenAlert] = useState(false);

  const { uploadedImageUrl } = useSelector((state) => state.users);
  // const { roles: {
  //   roles,
  // }} = useSelector((state) => state.roles);

  const [deletingUser, setDeletingUser] = useState({
    _id: null,
    name: ''
  });

  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
    onCancel();
  };

  const theme = useTheme();
  const isCreating = !user;

  const [selectedImage, setSelectedImage] = useState(undefined);
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    if (selectedImage) {
      setAvatar(URL.createObjectURL(selectedImage));
    }
  }, [selectedImage]);

  useEffect(() => {
    console.log(user);
    if (user) {
      setAvatar(user.photo);
    }
  }, [user]);

  const deleteHandler = async (user) => {
    setDeletingUser({
      _id: user._id,
      name: user.name
    });
    setOpenAlert(true);
  };

  const UserSchema = Yup.object().shape({
    name: Yup.string().max(255).required('Name is required'),
    email: Yup.string().max(255).required('Email is required').email('Must be a valid email'),
    // password: Yup.string().min(6).max(255).required('Password is required'),
    password: Yup.string()
      .min(6)
      .max(255)
      // .when('isCreating', {
      //   is: true,
      //   then: Yup.string().required('Password is required'),
      //   otherwise: Yup.string().notRequired(),
      // })
      ,
    phone: Yup.string()
      .matches(
        /^\(?(?:(?:0(?:0|11)\)?[\s-]?\(?|\+)44\)?[\s-]?\(?(?:0\)?[\s-]?\(?)?|0)(?:\d{5}\)?[\s-]?\d{4,5}|\d{4}\)?[\s-]?(?:\d{5}|\d{3}[\s-]?\d{3})|\d{3}\)?[\s-]?\d{3}[\s-]?\d{3,4}|\d{2}\)?[\s-]?\d{4}[\s-]?\d{4}|8(?:00[\s-]?11[\s-]?11|45[\s-]?46[\s-]?4\d))(?:(?:[\s-]?(?:x|ext\.?\s?|\#)\d+)?)$/,
        'Invalid phone number'
      )
      .required('Phone number is required'),
    address: Yup.string().required('Address is required'),
    note: Yup.string().required('Note is required'),
    startdate: Yup.date().required('Start Date is required'),
    dob: Yup.date().required('Date of Birth is required'),
    // role: Yup.string().required('Role is required'),
    jobrole: Yup.string().required('Job Role is required')
  });

  const defaultValues = useMemo(
    () => ({
      name: user ? user.name : '',
      email: user ? user.email : '',
      password: '',
      phone: user ? user.phone : '',
      address: user ? user.address : '',
      note: user ? user.note : '',
      startdate: user ? user.startDate.split('T')[0] : '',
      dob: user ? user.dateOfBirth?.split('T')[0] : '',
      // role: user ? user['role._id'] : '',
      jobrole: user ? user.jobRole : ''
    }),
    [user]
  );

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: defaultValues,
    validationSchema: UserSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        console.log(user);

        const formData = new FormData();

        // for (const key in values){
        //   formData.append(key, values[key]);
        // }

        formData.append("name", values.name);
        formData.append("email", values.email);
        formData.append("password", values.password);
        formData.append("phone", values.phone);
        formData.append("dateOfBirth", values.dob);
        formData.append("address", values.address);
        formData.append("startDate", values.startdate);
        formData.append("note", values.note);
        formData.append("jobRole", values.jobrole);

        if(selectedImage) {
          formData.append("files", selectedImage);
        }

        if (user) {
          console.log("update",user);
          
          dispatch(updateUser(user._id, formData)).then(()=>{
            setSubmitting(false);
            onCancel();
            resetForm();
          });
          
        } else {
          dispatch(createUser(formData)).then(()=>{
            setSubmitting(false);
            onCancel();
            resetForm();
          });
        }

      } catch (error) {
        console.error(error);
      }
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue, resetForm } = formik;

  const statusOptions = [
    { value: '1_pending', label: '1 Pending', color: 'warning' },
    { value: '2_pending', label: '2 Pending', color: 'warning' },
    { value: '3_pending', label: '3 Pending', color: 'warning' },
    { value: '4_pending', label: '4 Pending', color: 'warning' },
    { value: '1_completed', label: '1 Completed', color: 'success' },
    { value: '2_completed', label: '2 Completed', color: 'success' },
    { value: '3_completed', label: '3 Completed', color: 'success' },
    { value: '4_completed', label: '4 Completed', color: 'success' },
    { value: '1_delivered', label: '1 Delivered', color: 'primary' },
    { value: '2_delivered', label: '2 Delivered', color: 'primary' },
    { value: '3_delivered', label: '3 Delivered', color: 'primary' },
    { value: '4_delivered', label: '4 Delivered', color: 'primary' },
  ]

  return (
    <>
      <FormikProvider value={formik}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <DialogTitle>{user ? 'Edit User' : 'Add Test'}</DialogTitle>
            <Divider />
            <DialogContent sx={{ p: 2.5}}>
              {/* <Grid container spacing={4}> */}
                {/* <Grid item xs={12} md={3}>
                  <Stack direction="row" justifyContent="center" sx={{ mt: 3 }}>
                    <FormLabel
                      htmlFor="change-avtar"
                      sx={{
                        position: 'relative',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        '&:hover .MuiBox-root': { opacity: 1 },
                        cursor: 'pointer'
                      }}
                    >
                      <Avatar alt="Avatar 1" src={avatar} sx={{ width: 72, height: 72, border: '1px dashed' }} />
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          backgroundColor: theme.palette.mode === ThemeMode.DARK ? 'rgba(255, 255, 255, .75)' : 'rgba(0,0,0,.65)',
                          width: '100%',
                          height: '100%',
                          opacity: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Stack spacing={0.5} alignItems="center">
                          <CameraOutlined style={{ color: theme.palette.secondary.lighter, fontSize: '2rem' }} />
                          <Typography sx={{ color: 'secondary.lighter' }}>Upload</Typography>
                        </Stack>
                      </Box>
                    </FormLabel>
                    <TextField
                      type="file"
                      id="change-avtar"
                      placeholder="Outlined"
                      variant="outlined"
                      sx={{ display: 'none' }}
                      onChange={(e) => {
                        setSelectedImage(e.target.files?.[0]);
                      }}
                    />
                  </Stack>
                </Grid> */}
                <Grid item xs={12} md={8}>
                  <Grid container spacing={3}>
                    {/* name */}
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="user-name">Name</InputLabel>
                        <TextField
                          fullWidth
                          id="user-name"
                          placeholder="Enter Patient Name"
                          {...getFieldProps('name')}
                          error={Boolean(touched.name && errors.name)}
                          helperText={touched.name && errors.name}
                        />
                      </Stack>
                    </Grid>

                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="user-address">Address</InputLabel>
                        <TextField
                          fullWidth
                          id="user-address"
                          placeholder="Enter Address"
                          {...getFieldProps('address')}
                          error={Boolean(touched.address && errors.address)}
                          helperText={touched.address && errors.address}
                        />
                      </Stack>
                    </Grid>

                    {/* phone */}
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="user-phone">Phone Number</InputLabel>
                        <TextField
                          fullWidth
                          id="user-phone"
                          placeholder="Enter Phone Number"
                          {...getFieldProps('phone')}
                          error={Boolean(touched.phone && errors.phone)}
                          helperText={touched.phone && errors.phone}
                        />
                      </Stack>
                    </Grid>

                    {/* <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="user-role">Status</InputLabel>
                        <Select
                          fullWidth
                          id="user-role"
                          displayEmpty
                          {...getFieldProps('role')}
                          error={Boolean(touched.role && errors.role)}
                        >
                        <MenuItem value="admin">Pending</MenuItem>
                        <MenuItem value="user">Completed</MenuItem>
                        <MenuItem value="guest">Delivered</MenuItem>
                        </Select>
                        {touched.role && errors.role && (
                          <FormHelperText error>{errors.role}</FormHelperText>
                       )}
                      </Stack>
                    </Grid> */}

                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="user-status">Status</InputLabel>
                        <Select
                          fullWidth
                          id="user-status"
                          multiple
                          displayEmpty
                          value={formik.values.status || []}  // Ensure the value is an array
                          onChange={(e) => formik.setFieldValue('status', e.target.value)}
                          renderValue={(selected) => (
                            Array.isArray(selected) && selected.length > 0 ? (
                              <Box sx={{ display: 'flex', gap: 0.5 }}>
                                {selected.map((value) => {
                                  const option = statusOptions.find((opt) => opt.value === value);
                                  return option ? (
                                    <Chip key={value} label={option.label} color={option.color} />
                                ) : null;
                              })}
                            </Box>
                          ) : <em>Select Status</em>
                        )}
                      error={Boolean(formik.touched.status && formik.errors.status)}
                    >
                      <MenuItem disabled value="">
                        <em>Select Status</em>
                      </MenuItem>
                      {statusOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          <Chip label={option.label} color={option.color} />
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched.status && formik.errors.status && (
                      <FormHelperText error>{formik.errors.status}</FormHelperText>
                    )}
                  </Stack>
                </Grid>


                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="user-note">Note</InputLabel>
                        <TextField
                          fullWidth
                          id="user-note"
                          multiline
                          rows={2}
                          placeholder="Enter Note"
                          {...getFieldProps('note')}
                          error={Boolean(touched.note && errors.note)}
                          helperText={touched.note && errors.note}
                        />
                      </Stack>
                    </Grid>
                  </Grid>
                </Grid>
              {/* </Grid> */}
            </DialogContent>
            <Divider />
            <DialogActions sx={{ p: 2.5 }}>
              <Grid container justifyContent="space-between" alignItems="center">
                <Grid item>
                  {/* {!isCreating && (
                    <Tooltip title="Delete User" placement="top">
                      <IconButton onClick={() => deleteHandler(user)} size="large" color="error">
                        <DeleteFilled />
                      </IconButton>
                    </Tooltip>
                  )} */}
                </Grid>
                <Grid item>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Button color="error" onClick={onCancel}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="contained" disabled={isSubmitting}>
                      {user ? 'Edit' : 'Add'}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </DialogActions>
          </Form>
        </LocalizationProvider>
      </FormikProvider>
      {!isCreating && (
        <AlertUserDelete title={deletingUser.name} userId={deletingUser._id} open={openAlert} handleClose={handleAlertClose} />
      )}
    </>
  );
};

AddLabTest.propTypes = {
  user: PropTypes.any,
  onCancel: PropTypes.func
};

export default AddLabTest;
