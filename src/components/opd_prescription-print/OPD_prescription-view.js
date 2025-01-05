import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Divider,
  Stack,
  Button,
} from '@mui/material';
import MainCard from 'components/MainCard';
import useAuth from 'hooks/useAuth';

const OPD_PrescriptionView = ({ data = {}, onCancel, isSubmitting }) => {
  const theme = useTheme();
  const { user } = useAuth();

  console.log("USER",user.name);
  const {
    date = 'N/A',
    name = 'N/A',
    age = 'N/A',
    gender = 'N/A',
    doctorName = 'N/A',
    doctorQualification = 'N/A',
    doctorRegNo = 'N/A',
  } = data;

  const prescriptions = Array.isArray(data.prescriptions) 
          ? data.prescriptions.map(prescription => 
              typeof prescription === 'string' ? JSON.parse(prescription) : prescription
            ).flat()
          : [];
  console.log("data",data);

  // Function to handle printing
  const handlePrint = () => {
    window.print();
  };

  return (
    <MainCard>
      {/* Wrapper for print-specific styles */}
      <div className="print-container">
        <Grid container spacing={2} sx={{ p: 3 }}>
          {/* Header Section */}
          <Grid item xs={12} textAlign="center">
            <Typography variant="subtitle1" sx={{ color: '#00695c' }}>Date: {date}</Typography>
            <Typography variant="h4" sx={{ color: '#00695c' }}>Hope Medical Center</Typography>
            <Typography variant="body2" sx={{ color: '#00695c' }}>No.10, School Road, Kandy.</Typography>
            <Typography variant="body2" sx={{ color: '#00695c' }}>091-2345678</Typography>
          </Grid>

          <Divider sx={{ width: '100%', my: 2 }} />

          {/* Patient Information */}
          <Grid item xs={12}>
            <Typography variant="body1" sx={{ color: '#00695c' }}>Name: {name}</Typography>
            <Typography variant="body1" sx={{ color: '#00695c' }}>Age: {age} yrs</Typography>
            <Typography variant="body1" sx={{ color: '#00695c' }}>Gender: {gender}</Typography>
          </Grid>

          <Divider sx={{ width: '100%', my: 2 }} />

          {/* Prescription Table */}
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Drug Name</TableCell>
                    <TableCell>Dosage</TableCell>
                    <TableCell>Frequency</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Instructions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {prescriptions.length > 0 ? (
                    prescriptions.map((prescription, index) => (
                      <TableRow key={index}>
                        <TableCell>{prescription.name || 'N/A'}</TableCell>
                        <TableCell>{prescription.dosage || 'N/A'}</TableCell>
                        <TableCell>{prescription.frequency || 'N/A'}</TableCell>
                        <TableCell>{prescription.duration || 'N/A'}</TableCell>
                        <TableCell>{prescription.instructions || 'N/A'}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No prescriptions available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Divider sx={{ width: '100%', my: 2 }} />

          {/* Doctor's Information */}
          <Grid item xs={12}>
            <Typography variant="body1" sx={{ color: '#00695c' }}>Dr. {user.name}</Typography>
            <Typography variant="body2" sx={{ color: '#00695c' }}>{doctorQualification}</Typography>
            <Typography variant="body2" sx={{ color: '#00695c' }}>Reg. No. {doctorRegNo}</Typography>
          </Grid>

          {/* Action Buttons */}
          <Grid item xs={12} container justifyContent="flex-end" sx={{ mt: 2 }} className="no-print">
            <Stack direction="row" spacing={2}>
              <Button color="error" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="button" variant="contained" disabled={isSubmitting} onClick={handlePrint}>
                Print
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </div>

      {/* Print Styles */}
      <style>
        {`
          @media print {
            .no-print {
              display: none;
            }
            .print-container {
              margin: 0;
              padding: 0;
            }
          }
        `}
      </style>
    </MainCard>
  );
};

OPD_PrescriptionView.propTypes = {
  data: PropTypes.shape({
    date: PropTypes.string,
    name: PropTypes.string,
    age: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    gender: PropTypes.string,
    prescriptions: PropTypes.arrayOf(
      PropTypes.shape({
        drugName: PropTypes.string,
        dosage: PropTypes.string,
        frequency: PropTypes.string,
        duration: PropTypes.string,
        instructions: PropTypes.string,
      })
    ),
    doctorName: PropTypes.string,
    doctorQualification: PropTypes.string,
    doctorRegNo: PropTypes.string,
  }),
  onCancel: PropTypes.func,
  isSubmitting: PropTypes.bool,
  user: PropTypes.object,
};

export default OPD_PrescriptionView;
