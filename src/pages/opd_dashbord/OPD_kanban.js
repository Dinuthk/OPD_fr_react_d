import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Paper, IconButton, Dialog } from '@mui/material';
import OPD_AddPatient from 'components/opd_add-patient/OPD_add-patient';
import { PopupTransition } from 'components/@extended/Transitions';
import { deletePatient, getPatients, updatePatientStatus } from 'store/reducers/patient';
import { useSelector, useDispatch } from 'store';
import OPD_PrescriptionView from 'components/opd_prescription-print/OPD_prescription-view';
import OPD_TestOrderView from 'components/opd_test-order-print/OPD_test-order-view';
import OPD_PrescriptionGen from 'components/opd_prescription-gen/OPD_prescription-gen';
import DeleteIcon from '@mui/icons-material/Delete';
import PatientDeleteAlert from 'components/delete_alert/PatientDeleteAlert'; // Import your custom delete alert component

const OPD_Kanban = () => {
  const dispatch = useDispatch();

  const [lanes, setLanes] = useState({
    OPD: [],
    DOCTOR: [],
    PRESCRIPTION: [],
    LABTEST: [],
    COMPLETED: []
  });

  const { patients, action } = useSelector((state) => state.patients);
  const [newTask, setNewTask] = useState('');
  const [add, setAdd] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const handleAdd = () => {
    setAdd(!add);
  };

  useEffect(() => {
    dispatch(getPatients());
  }, [dispatch]);

  useEffect(() => {
    if (patients && patients.length > 0) {
      const newLanes = {
        OPD: [],
        DOCTOR: [],
        PRESCRIPTION: [],
        LABTEST: [],
        COMPLETED: []
      };

      patients.forEach((patient) => {
        const task = { id: patient._id, queue: patient.queue, name: patient.name };
        if (patient.state === 'opd') {
          newLanes.OPD.push(task);
        } else if (patient.state === 'doctor') {
          newLanes.DOCTOR.push(task);
        } else if (patient.state === 'prescription') {
          newLanes.PRESCRIPTION.push(task);
        } else if (patient.state === 'labtest') {
          newLanes.LABTEST.push(task);
        } else if (patient.state === 'completed') {
          newLanes.COMPLETED.push(task);
        }
      });

      setLanes(newLanes);
    }
  }, [patients, action]);

  const handleDragStart = (taskId) => {
    setDraggedTaskId(taskId);
  };

  const handleDrop = (lane) => {
    if (draggedTaskId) {
      const updatedLanes = { ...lanes };
      let draggedTask = null;

      for (const [laneName, tasks] of Object.entries(updatedLanes)) {
        const taskIndex = tasks.findIndex((task) => task.id === draggedTaskId);
        if (taskIndex !== -1) {
          [draggedTask] = tasks.splice(taskIndex, 1);
          break;
        }
      }

      if (draggedTask) {
        updatedLanes[lane].push(draggedTask);
        dispatch(updatePatientStatus(draggedTask.id, lane.toLowerCase()));
        setLanes(updatedLanes);
      }

      setDraggedTaskId(null);
    }
  };

  const addTask = () => {
    if (newTask.trim() === '') return;

    setLanes((prevLanes) => ({
      ...prevLanes,
      OPD: [...prevLanes.OPD, { id: Date.now(), queue: 'New', name: newTask }]
    }));

    setNewTask('');
  };

  const confirmDeleteTask = (lane, taskId) => {
    setTaskToDelete({ lane, taskId });
    setDeleteAlertOpen(true);
  };

  const handleDeleteTask = () => {
    console.log('Sp', taskToDelete);
    if (taskToDelete) {
      const { lane, taskId } = taskToDelete;

      dispatch(deletePatient(taskId));

      setLanes((prevLanes) => ({
        ...prevLanes,
        [lane]: prevLanes[lane].filter((task) => task.id !== taskId)
      }));
      setDeleteAlertOpen(false);
      setTaskToDelete(null);
    }
  };

  const handleTaskClick = (task, lane) => {
    const patient = patients.find((p) => p._id === task.id);
    setSelectedPatient(patient);

    if (lane === 'OPD') {
      setAdd(true);
    } else if (lane === 'DOCTOR') {
      setAdd('doctor');
    } else if (lane === 'PRESCRIPTION') {
      setAdd('prescription');
    } else if (lane === 'LABTEST') {
      setAdd('labtest');
    }
  };

  return (
    <>
      <Dialog
        maxWidth={add === 'doctor' ? 'lg' : 'sm'}
        TransitionComponent={PopupTransition}
        keepMounted
        fullWidth
        onClose={() => setAdd(false)}
        open={Boolean(add)}
        sx={{
          '& .MuiDialog-paper': {
            p: 0,
            ...(add === 'doctor' && {
              minWidth: '90vw',
              minHeight: '90vh',
              margin: '16px'
            })
          },
          transition: 'transform 225ms'
        }}
        aria-describedby="alert-dialog-slide-description"
      >
        {add === true && <OPD_AddPatient user={selectedPatient} onCancel={() => setAdd(false)} />}
        {add === 'doctor' && <OPD_PrescriptionGen data={selectedPatient} onCancel={() => setAdd(false)} />}
        {add === 'prescription' && <OPD_PrescriptionView data={selectedPatient} onCancel={() => setAdd(false)} />}
        {add === 'labtest' && <OPD_TestOrderView data={selectedPatient} onCancel={() => setAdd(false)} />}
      </Dialog>

      <Box className="board" sx={{ width: '100%', height: '100vh', overflow: 'scroll' }}>
        <Box
          className="lanes"
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '16px',
            padding: '24px 32px',
            overflow: 'scroll',
            height: '100%'
          }}
        >
          {['OPD', 'DOCTOR', 'PRESCRIPTION', 'LABTEST', 'COMPLETED'].map((lane) => (
            <Paper
              className="swim-lane"
              key={lane}
              data-lane={lane}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                backgroundColor: (theme) => theme.palette.action.disabledBackground,
                padding: '12px',
                borderRadius: '4px',
                width: '225px',
                minHeight: '120px'
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(lane)}
            >
              {lane === 'OPD' && (
                <Button onClick={handleAdd} variant="contained" color="primary" sx={{ margin: '4px' }}>
                  Add Patient
                </Button>
              )}
              <Typography variant="h6" className="heading">
                {lane}
              </Typography>

              {lanes[lane].map((task) => (
                <Box
                  key={task.id}
                  className="task"
                  draggable="true"
                  onDragStart={() => handleDragStart(task.id)}
                  onClick={() => handleTaskClick(task, lane)}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#fff',
                    color: '#000',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%'
                    }}
                  >
                    <Typography>{`${task.queue} - ${task.name}`}</Typography>

                    {(lane === 'OPD' || lane === 'COMPLETED') && (
                      <IconButton
                        size="small"
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          confirmDeleteTask(lane, task.id);
                        }}
                        sx={{ marginLeft: 'auto' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>
                </Box>
              ))}
            </Paper>
          ))}
        </Box>
      </Box>

      <PatientDeleteAlert
        open={deleteAlertOpen}
        onClose={() => setDeleteAlertOpen(false)} // Ensure proper closing
        onConfirm={handleDeleteTask} // Confirm delete
        selectedPatient={selectedPatient} // Pass the selected patient to the delete alert
      />
    </>
  );
};

export default OPD_Kanban;
