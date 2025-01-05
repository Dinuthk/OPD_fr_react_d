import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import OPD_PrescriptionNavbar from './OPD_prescription-nav-bar.js';

import { Grid, Stack, Button, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import DrugPrescriptionPage from './OPD_prescription-drugs-prescribed.js';

const OPD_PrescriptionGen = ({data = {}, onCancel, isSubmitting, user }) => {
  // Destructure props here
  return (
    <MainCard>
      {/* Nav bar component */}
      <OPD_PrescriptionNavbar data={data} />

     

      {/* Drug List And Prescribed */}
     <DrugPrescriptionPage user={data} onCancel={onCancel} isSubmitting={isSubmitting}/>

    </MainCard>
  );
};

OPD_PrescriptionGen.propTypes = {
  onCancel: PropTypes.func.isRequired, // Add isRequired if onCancel is required
  isSubmitting: PropTypes.bool,
  user: PropTypes.object
};

export default OPD_PrescriptionGen;
