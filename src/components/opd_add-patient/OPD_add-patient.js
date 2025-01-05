import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
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
import AlertUserDelete from 'pages/users/components/user-delete-alert';
import { createPatient, updatePatient } from 'store/reducers/patient';
import { fr } from 'date-fns/locale';

// ==============================|| USER ADD / EDIT / DELETE ||============================== //

const OPD_AddPatient = ({ user, onCancel }) => {
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
    queue: Yup.string().max(255).required('Queue No is required'),
    phone: Yup.string()
      .matches(
        /^\(?(?:(?:0(?:0|11)\)?[\s-]?\(?|\+)44\)?[\s-]?\(?(?:0\)?[\s-]?\(?)?|0)(?:\d{5}\)?[\s-]?\d{4,5}|\d{4}\)?[\s-]?(?:\d{5}|\d{3}[\s-]?\d{3})|\d{3}\)?[\s-]?\d{3}[\s-]?\d{3,4}|\d{2}\)?[\s-]?\d{4}[\s-]?\d{4}|8(?:00[\s-]?11[\s-]?11|45[\s-]?46[\s-]?4\d))(?:(?:[\s-]?(?:x|ext\.?\s?|\#)\d+)?)$/,
        'Invalid phone number'
      )
      .required('Phone number is required'),
    address: Yup.string().required('Address is required'),
    age: Yup.string().max(255).required('Name is required'),
    gender: Yup.string().max(255).required('Gender is required')
  });

  const defaultValues = useMemo(
    () => ({
      gender: user ? user.gender: '',
      age: user ? user.age : '',
      queue: user ? user.queue : '',
      name: user ? user.name : '',
      phone: user ? user.phone : '',
      address: user ? user.address : '',
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
        formData.append('queue', values.queue);
        formData.append('name', values.name);
        formData.append('phone', values.phone);
        formData.append('address', values.address);
        formData.append('age', values.age);
        formData.append('gender',values.gender);
        formData.append('prescription', '');
        formData.append('labtest','');

        //TODO Should change dynamically
        formData.append('state', 'opd');

        // if (selectedImage) {
        //   formData.append('files', selectedImage);
        // }
        console.log('valuees', values);
        if (user) {
          console.log('update', user);

          dispatch(updatePatient(user._id, formData)).then(() => {
            setSubmitting(false);
            onCancel();
            resetForm();
          });
        } else {
          dispatch(createPatient(formData)).then(() => {
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

  return (
    <>
      <FormikProvider value={formik}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <DialogTitle>{user ? 'Edit User' : 'New User'}</DialogTitle>
            <Divider />
            <DialogContent sx={{ p: 2.5 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
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
                </Grid>
                <Grid item xs={12} md={8}>
                  <Grid container spacing={3}>
                     {/* queue no */}
                     <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="user-queue">Queue No</InputLabel>
                        <TextField
                          fullWidth
                          id="user-queue"
                          placeholder="Enter Queue No"
                          {...getFieldProps('queue')}
                          error={Boolean(touched.queue && errors.queue)}
                          helperText={touched.queue && errors.queue}
                        />
                      </Stack>
                    </Grid>
                    {/* end of name */}
                    {/* name */}
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="user-name">Name</InputLabel>
                        <TextField
                          fullWidth
                          id="user-name"
                          placeholder="Enter User Name"
                          {...getFieldProps('name')}
                          error={Boolean(touched.name && errors.name)}
                          helperText={touched.name && errors.name}
                        />
                      </Stack>
                    </Grid>
                    {/* end of name */}
                    
                   
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
                    {/* end of phone */}
                    {/* address */}
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
                    {/* end of address */}
                   
                    {/* age */}
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="age">Age</InputLabel>
                        <TextField
                          fullWidth
                          id="age"
                          placeholder="Enter Age"
                          {...getFieldProps('age')}
                          error={Boolean(touched.age && errors.age)}
                          helperText={touched.age && errors.age}
                        />
                      </Stack>
                    </Grid>
                    {/* end of age */}

                    {/*start of gender*/}
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="gender">Gender</InputLabel>
                        <TextField
                          fullWidth
                          id="gender"
                          placeholder="Enter Gender"
                          {...getFieldProps('gender')}
                          error={Boolean(touched.gender && errors.gender)}
                          helperText={touched.gender && errors.gender}
                        />
                      </Stack>
                    </Grid>
                    {/*end of gender*/}
                    
                   
                    
                  </Grid>
                </Grid>
              </Grid>
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

OPD_AddPatient.propTypes = {
  user: PropTypes.any,
  onCancel: PropTypes.func
};

export default OPD_AddPatient;
