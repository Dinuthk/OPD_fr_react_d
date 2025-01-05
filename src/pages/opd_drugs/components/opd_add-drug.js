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
import AlertDrugDelete from './opd_drug-delete-alert';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';

import { ThemeMode } from 'config';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

// assets
import { CameraOutlined, DeleteFilled } from '@ant-design/icons';
import { createDrug, updateDrug } from 'store/reducers/drug';
// import { DrugRoles } from 'config';
import { useSelector } from 'store';

// ==============================|| Drug ADD / EDIT / DELETE ||============================== //

const AddDrug = ({ drug, onCancel }) => {
  const [openAlert, setOpenAlert] = useState(false);

  const { uploadedImageUrl } = useSelector((state) => state.drugs);
  // const { roles: {
  //   roles,
  // }} = useSelector((state) => state.roles);

  const [deletingDrug, setDeletingDrug] = useState({
    _id: null,
    name: ''
  });

  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
    onCancel();
  };

  const theme = useTheme();
  const isCreating = !drug;

  const [selectedImage, setSelectedImage] = useState(undefined);
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    if (selectedImage) {
      setAvatar(URL.createObjectURL(selectedImage));
    }
  }, [selectedImage]);

  useEffect(() => {
    console.log(drug);
    if (drug) {
      setAvatar(drug.photo);
    }
  }, [drug]);

  const deleteHandler = async (drug) => {
    setDeletingDrug({
      _id: drug._id,
      name: drug.name
    });
    setOpenAlert(true);
  };

  const DrugSchema = Yup.object().shape({
    name: Yup.string().max(255).required('Name is required'),
    form: Yup.string().max(255).required('Form is required. Eg: Tablet, Capsule, Syrup'),
    strength: Yup.string().required('Strength is required. eg: 50mg'),
    qty: Yup.string().required('Quantity is required'),
    expiredate: Yup.date().required('Expire Date is required'),
   
  });

  const defaultValues = useMemo(
    () => ({
      name: drug ? drug.name : '',
      form: drug ? drug.form : '',
      strength: drug ? drug.strength : '',
      qty: drug ? drug.qty : '',
      expiredate: drug ? drug.expiredate.split('T')[0] : '',
    }),
    [drug]
  );

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: defaultValues,
    validationSchema: DrugSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        console.log(drug);

        const formData = new FormData();

        // for (const key in values){
        //   formData.append(key, values[key]);
        // }

        formData.append('name', values.name);
        formData.append('form', values.form);
        formData.append('strength', values.strength);
        formData.append('qty', values.qty);
        formData.append('expiredate', values.expiredate);
       

        if (selectedImage) {
          formData.append('files', selectedImage);
        }

        if (drug) {
          console.log('update', drug);

          dispatch(updateDrug(drug._id, formData)).then(() => {
            setSubmitting(false);
            onCancel();
            resetForm();
          });
        } else {
          dispatch(createDrug(formData)).then(() => {
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
            <DialogTitle>{drug ? 'Edit Drug' : 'New Drug'}</DialogTitle>
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
                    {/* name */}
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="drug-name">Name</InputLabel>
                        <TextField
                          fullWidth
                          id="drug-name"
                          placeholder="Enter Drug Name"
                          {...getFieldProps('name')}
                          error={Boolean(touched.name && errors.name)}
                          helperText={touched.name && errors.name}
                        />
                      </Stack>
                    </Grid>
                    {/* end of name */}
                    {/* form */}
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="drug-form">Form</InputLabel>
                        <TextField
                          fullWidth
                          id="drug-form"
                          placeholder="Eg: Tablet, Capsule, Syrup"
                          {...getFieldProps('form')}
                          error={Boolean(touched.form && errors.form)}
                          helperText={touched.form && errors.form}
                        />
                      </Stack>
                    </Grid>
                    {/* end of form */}
                    {/* strength */}
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="drug-strength">Strength</InputLabel>
                        <TextField
                          fullWidth
                          id="drug-strength"
                          placeholder="Enter Drug strength in mg (eg: 50)"
                          {...getFieldProps('strength')}
                          error={Boolean(touched.strength && errors.strength)}
                          helperText={touched.strength && errors.strength}
                        />
                      </Stack>
                    </Grid>
                    {/* end of strength */}
                    
                    {/* qty */}
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="drug-qty">Quantity</InputLabel>
                        <TextField
                          fullWidth
                          id="drug-qty"
                          placeholder="Enter Quantity"
                          {...getFieldProps('qty')}
                          error={Boolean(touched.qty && errors.qty)}
                          helperText={touched.qty && errors.qty}
                        />
                      </Stack>
                    </Grid>
                    {/* end of qty */}
                    {/* expire date */}
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="drug-expiredate">Expire Date</InputLabel>
                        <TextField
                          fullWidth
                          type="date"
                          id="drug-expiredate"
                          placeholder="Enter Expire Date"
                          {...getFieldProps('expiredate')}
                          error={Boolean(touched.expiredate && errors.expiredate)}
                          helperText={touched.expiredate && errors.expiredate}
                        />
                      </Stack>
                    </Grid>
                    {/* end of expiredate date */}

                  </Grid>
                </Grid>
              </Grid>
            </DialogContent>
            <Divider />
            <DialogActions sx={{ p: 2.5 }}>
              <Grid container justifyContent="space-between" alignItems="center">
                <Grid item>
                  {/* {!isCreating && (
                    <Tooltip title="Delete Drug" placement="top">
                      <IconButton onClick={() => deleteHandler(drug)} size="large" color="error">
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
                      {drug ? 'Edit' : 'Add'}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </DialogActions>
          </Form>
        </LocalizationProvider>
      </FormikProvider>
      {!isCreating && (
        <AlertDrugDelete title={deletingDrug.name} drugId={deletingDrug._id} open={openAlert} handleClose={handleAlertClose} />
      )}
    </>
  );
};

AddDrug.propTypes = {
  drug: PropTypes.any,
  onCancel: PropTypes.func
};

export default AddDrug;
