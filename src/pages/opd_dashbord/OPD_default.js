import { Button, Dialog } from '@mui/material'
import { PopupTransition } from 'components/@extended/Transitions';
import OPD_PrescriptionView from 'components/opd_prescription-print/OPD_prescription-view';
import OPD_TestOrderView from 'components/opd_test-order-print/OPD_test-order-view';
import OPD_prescriptiongen from 'components/opd_prescription-gen/OPD_prescription-gen';




import React, { useState } from 'react'

export default function OPD_default() {
  const [add, setAdd] = useState(false);

  const handleAdd = () => {
    setAdd(!add);
  };

  return (
    <div>
        <Button onClick={handleAdd} variant="contained" color="primary" sx={{ margin: '16px' }}>
        TB Current State - Add Test
      </Button>

      <Dialog
        maxWidth="sm"
        TransitionComponent={PopupTransition}
        keepMounted
        fullWidth
        onClose={() => setAdd(false)}
        open={add}
        sx={{ '& .MuiDialog-paper': { p: 0 }, transition: 'transform 225ms' }}
        aria-describedby="alert-dialog-slide-description"
      >
        {/* <OPD_PrescriptionView/> */}
        <OPD_prescriptiongen onCancel={() => setAdd(false)}/>
          
      </Dialog>
    </div>
  )
}
