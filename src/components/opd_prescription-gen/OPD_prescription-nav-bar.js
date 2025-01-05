import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button, Divider, Menu, MenuItem, Avatar, Grid } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MainCard from 'components/MainCard'; // Adjust the import path accordingly

const OPD_PrescriptionNavbar = ({data}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  

  const {
    date = 'N/A',
    name = 'N/A',
    age = 'N/A',
    gender = 'N/A',
    queue = 'N/A',
    prescriptions = [],
    doctorName = 'N/A',
    doctorQualification = 'N/A',
    doctorRegNo = 'N/A',
  } = data;

  console.log("data",data);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <MainCard border={false}>
      <AppBar position="static" color="default" elevation={0} sx={{ backgroundColor: 'transparent' }}>
        <Toolbar>
          {/* User Icon */}
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }} />

          {/* Divider */}
          <Divider orientation="vertical" flexItem sx={{ mr: 2 }} />

          {/* User Details */}
          <Grid sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Typography variant="body1" sx={{ mb: -5, ml: 1, mr: 2, fontWeight: 'bold'  }}>{name}</Typography>
            <Typography variant="body1" sx={{ mb: -5, ml: 2, mr: 2, fontWeight: 'bold'  }}>{gender}</Typography>
            <Typography variant="body1" sx={{ mb: -5, ml: 2, mr: 4 , fontWeight: 'bold'}}>Age: {age}</Typography>
            <Typography variant="body1" sx={{mb: -5, fontWeight: 'bold'}}>No: {queue}</Typography>
          </Grid>

          {/* Medical History Dropdown Button */}
          <Button
            variant="contained"
            onClick={handleMenuOpen}
            sx={{ bgcolor: 'black', color: 'white' }}
            endIcon={<ArrowDropDownIcon />}
          >
            Medical History
          </Button>

          {/* Dropdown Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleMenuClose}>Past Visits</MenuItem>
            <MenuItem onClick={handleMenuClose}>Prescriptions</MenuItem>
            <MenuItem onClick={handleMenuClose}>Lab Results</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </MainCard>
  );
};

export default OPD_PrescriptionNavbar;
