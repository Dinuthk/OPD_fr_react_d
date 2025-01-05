import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Select,
  MenuItem,
  Button,
  Stack
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector } from 'store';
import { dispatch } from 'store';
import { getDrugs } from 'store/reducers/drug';
import { updatePatient } from 'store/reducers/patient';
import { use } from 'react';

const PrescriptionPage = ({ user, onCancel, isSubmitting }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [prescriptions, setPrescriptions] = useState([
    {
      name: 'Kenacort tablet 500mg',
      dosage: 1,
      frequency: 'Three times a day',
      duration: 11,
      instructions: 'After foods'
    }
  ]);
  const [testsPrescribed, setTestsPrescribed] = useState([
    // {
    //   name: "Blood Sugar Test",
    //   code: "LC001",
    // },
  ]);

  const drugsState = useSelector((state) => state.drugs);
  const [drugsList, setDrugsList] = useState([]);

  useEffect(() => {
    if (user?.prescriptions) {
      try {
        // Handle both string and array formats
        const parsedPrescriptions = Array.isArray(user.prescriptions)
          ? user.prescriptions.map((prescription) => (typeof prescription === 'string' ? JSON.parse(prescription) : prescription)).flat()
          : [];
        setPrescriptions(parsedPrescriptions);
      } catch (error) {
        console.error('Error parsing prescriptions:', error);
        setPrescriptions([]);
      }
    }
  }, [user]);

  useLayoutEffect(() => {
    dispatch(getDrugs());
  }, [drugsState?.action]);

  useEffect(() => {
    if (drugsState?.drugs?.drugs) {
      const mappedDrugs = drugsState.drugs.drugs.map((drug) => `${drug.name} ${drug.strength}mg`);
      setDrugsList(mappedDrugs.length > 0 ? mappedDrugs : ['Kenacort tablet 500mg']);
    }
  }, [drugsState?.drugs?.drugs]);

  const tests = [
    { name: '24 Hours Urinary Protein', code: 'LC001' },
    { name: 'Blood Group', code: 'LC005' },
    { name: 'Blood Sugar for PP', code: 'LC003' },
    { name: 'List item', code: 'LC004' }
  ];

  const addPrescription = (item) => {
    if (tabIndex === 0) {
      setPrescriptions([
        ...prescriptions,
        { name: item, dosage: 1, frequency: 'Three times a day', duration: 7, instructions: 'After foods' }
      ]);
    } else {
      setTestsPrescribed([...testsPrescribed, item]);
    }
  };

  const deletePrescription = (index) => {
    if (tabIndex === 0) {
      setPrescriptions(prescriptions.filter((_, i) => i !== index));
    } else {
      setTestsPrescribed(testsPrescribed.filter((_, i) => i !== index));
    }
  };

  const updatePrescription = (index, field, value) => {
    const updatedPrescriptions = prescriptions.map((prescription, i) => (i === index ? { ...prescription, [field]: value } : prescription));
    setPrescriptions(updatedPrescriptions);
  };

  const savePrescription = () => {
    const formData = new FormData();
    formData.append('prescriptions', JSON.stringify(prescriptions));

    // Save prescriptions to the database
    if (user) {
      dispatch(updatePatient(user._id, formData)).then(() => {
        // setSubmitting(false);
        onCancel();
        resetForm();
      });
    }
  };

  return (
    <>
      <Box sx={{ padding: 1, backgroundColor: '#f0f8ff', minHeight: '100vh' }}>
        <Grid container spacing={0.5}>
          <Grid item xs={4}>
            <Box sx={{ backgroundColor: 'white', borderRadius: 2, boxShadow: 2, padding: 1 }}>
              <Tabs
                value={tabIndex}
                onChange={(event, newValue) => setTabIndex(newValue)}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
              >
                <Tab label="Drugs" />
                <Tab label="Tests" />
              </Tabs>

              <TextField fullWidth size="small" variant="outlined" placeholder="Search Here..." sx={{ marginY: 2 }} />
              <Box
                sx={{
                  maxHeight: 245,
                  overflowY: 'auto',
                  backgroundColor: '#f9f9f9',
                  borderRadius: 2,
                  padding: 1
                }}
              >
                <List>
                  {(tabIndex === 0 ? drugsList : tests).map((item, index) => (
                    <ListItem
                      key={index}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 1,
                        backgroundColor: '#fff',
                        borderRadius: 2,
                        boxShadow: 1,
                        padding: 1
                      }}
                    >
                      <ListItemIcon>
                        <Box
                          sx={{
                            width: 30,
                            height: 30,
                            borderRadius: '50%',
                            backgroundColor: '#a8d0e6',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: '14px',
                            color: '#fff'
                          }}
                        >
                          A
                        </Box>
                      </ListItemIcon>
                      <ListItemText primary={item.name || item} secondary={tabIndex === 1 ? `Code: ${item.code}` : null} />
                      <IconButton size="small" onClick={() => addPrescription(item)}>
                        <AddCircleOutlineIcon />
                      </IconButton>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={8}>
            <Box sx={{ backgroundColor: 'white', borderRadius: 2, boxShadow: 2, padding: 2 }}>
              <Typography variant="h6" sx={{ marginBottom: 2, color: '#00838f' }}>
                {tabIndex === 0 ? 'DRUGS PRESCRIBED' : 'TESTS PRESCRIBED'}
              </Typography>
              <Box sx={{ maxHeight: 305, overflowY: 'auto' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{tabIndex === 0 ? 'DRUG Name' : 'TEST Name'}</TableCell>
                      {tabIndex === 0 && (
                        <>
                          <TableCell>DOSAGE</TableCell>
                          <TableCell>FREQUENCY</TableCell>
                          <TableCell>DURATION</TableCell>
                          <TableCell>INSTRUCTIONS</TableCell>
                        </>
                      )}
                      {tabIndex === 1 && <TableCell>TEST CODE</TableCell>}
                      <TableCell>ACTION</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(tabIndex === 0 ? prescriptions : testsPrescribed).map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.name}</TableCell>
                        {tabIndex === 0 && (
                          <>
                            <TableCell>
                              <Select
                                value={item.dosage}
                                onChange={(e) => updatePrescription(index, 'dosage', e.target.value)}
                                size="small"
                              >
                                {[1, 2, 3, 4, 5].map((value) => (
                                  <MenuItem key={value} value={value}>
                                    {value}
                                  </MenuItem>
                                ))}
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Select
                                value={item.frequency}
                                onChange={(e) => updatePrescription(index, 'frequency', e.target.value)}
                                size="small"
                              >
                                {['One time a day', 'Two times a day', 'Three times a day'].map((option) => (
                                  <MenuItem key={option} value={option}>
                                    {option}
                                  </MenuItem>
                                ))}
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Select
                                value={item.duration}
                                onChange={(e) => updatePrescription(index, 'duration', e.target.value)}
                                size="small"
                              >
                                {[1, 2, 3, 4, 5, 6, 7, 14, 30].map((value) => (
                                  <MenuItem key={value} value={value}>
                                    {value}
                                  </MenuItem>
                                ))}
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Select
                                value={item.instructions}
                                onChange={(e) => updatePrescription(index, 'instructions', e.target.value)}
                                size="small"
                              >
                                {['After foods', 'Before foods'].map((option) => (
                                  <MenuItem key={option} value={option}>
                                    {option}
                                  </MenuItem>
                                ))}
                              </Select>
                            </TableCell>
                          </>
                        )}
                        {tabIndex === 1 && <TableCell>{item.code}</TableCell>}
                        <TableCell>
                          <IconButton size="small" color="error" onClick={() => deletePrescription(index)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <hr />

        {/* Title */}
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="body1" sx={{ color: '#00695c', fontSize: '1.5rem' }}>
              PRESCRIPTION
            </Typography>
          </Grid>
          <Grid item>
            <Stack direction="row" spacing={4}>
              <Button onClick={savePrescription} variant="contained">
                Save prescription
              </Button>
              <Button variant="contained" onClick={onCancel}>
                Cancel
              </Button>
            </Stack>
          </Grid>
        </Grid>

        <hr />
      </Box>
    </>
  );
};

export default PrescriptionPage;
