import PropTypes from 'prop-types';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { Chip, Dialog, IconButton, Stack, Tooltip, Typography, useTheme } from '@mui/material';
import { useMemo, useState } from 'react';
import { PopupTransition } from 'components/@extended/Transitions';
import { IndeterminateCheckbox } from 'components/third-party/ReactTable';
import Avatar from 'components/@extended/Avatar';
import { PatternFormat } from 'react-number-format';
import { CloseOutlined, DeleteTwoTone, EditTwoTone, EyeTwoTone } from '@ant-design/icons';
import TestTable from './components/opd_test-table';
import DeleteTest from './components/opd_test-delete';
import AddTest from './components/opd_add-test';

// ==============================|| test - LIST ||============================== //

// Section Cell and Header
const SelectionCell = ({ row }) => <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />;
const SelectionHeader = ({ getToggleAllPageRowsSelectedProps }) => (
  <IndeterminateCheckbox indeterminate {...getToggleAllPageRowsSelectedProps()} />
);

const IndexCell = ({ row, state }) => {
  return <Typography variant="subtitle1">{Number(row.id) + 1 + state.pageIndex * state.pageSize}</Typography>;
};

const CustomCell = ({ row }) => {
  const { values } = row;

  return (
    <Stack direction="row" spacing={1.5} alignItems="center">
      <Avatar alt="Avatar 1" size="sm" src={values.photo} />
      <Stack spacing={0}>
        <Typography variant="subtitle1">{values.name}</Typography>
        <Typography variant="caption" color="textSecondary">
          {values.email}
        </Typography>
      </Stack>
    </Stack>
  );
};

const NumberFormatCell = ({ value }) => <PatternFormat displayType="text" format="+1 (###) ###-####" mask="_" defaultValue={value} />;

const StatusCell = ({ value }) => {
  switch (value) {
    case 0:
      return <Chip color="error" label="Inactive" size="small" variant="light" />;
    case 1:
      return <Chip color="success" label="Active" size="small" variant="light" />;
    case 'Pending':
    default:
      return <Chip color="info" label="Pending" size="small" variant="light" />;
  }
};

const ActionCell = (row, setTest, setCustomerDeleteId, handleAdd, handleClose, theme) => {
  const collapseIcon = row.isExpanded ? (
    <CloseOutlined style={{ color: theme.palette.error.main }} />
  ) : (
    <EyeTwoTone twoToneColor={theme.palette.secondary.main} />
  );
  return (
    <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
      <Tooltip title="View">
        <IconButton
          color="secondary"
          onClick={(e) => {
            e.stopPropagation();
            row.toggleRowExpanded();
          }}
        >
          {collapseIcon}
        </IconButton>
      </Tooltip>
      <Tooltip title="Edit">
        <IconButton
          color="primary"
          onClick={(e) => {
            e.stopPropagation();
            setTest(row.values);
            handleAdd();
          }}
        >
          <EditTwoTone twoToneColor={theme.palette.primary.main} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete">
        <IconButton
          color="error"
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
            setCustomerDeleteId({
              _id: row.values._id,
              name: row.values.name
            });
          }}
        >
          <DeleteTwoTone twoToneColor={theme.palette.error.main} />
        </IconButton>
      </Tooltip>
    </Stack>
  );
};

//pop up card

StatusCell.propTypes = {
  value: PropTypes.number
};

NumberFormatCell.propTypes = {
  value: PropTypes.string
};

CustomCell.propTypes = {
  row: PropTypes.object
};

SelectionCell.propTypes = {
  row: PropTypes.object
};

SelectionHeader.propTypes = {
  getToggleAllPageRowsSelectedProps: PropTypes.func
};

const LabtestPageB = () => {
  const theme = useTheme();

  const [add, setAdd] = useState(false);
  const [open, setOpen] = useState(false);
  const [test, setTest] = useState();
  const [deletingTest, setDeletingTest] = useState({
    _id: null,
    name: ''
  });

  const handleAdd = () => {
    setAdd(!add);
    if (test && !add) setTest(null);
  };

  const handleClose = () => {
    setOpen(!open);
  };

  const columns = useMemo(
        () => [
          {
            title: 'Row Selection',
            Header: SelectionHeader,
            accessor: 'selection',
            Cell: SelectionCell,
            disableSortBy: true
          },
          {
            Header: 'Test ID',
            accessor: '_id',
            className: 'cell-center',
            Cell: IndexCell
          },
          {
            Header: 'Test Name',
            accessor: 'name',
            Cell: CustomCell
          },
          {
            Header: 'Category',
            accessor: 'category',
            Cell: CustomCell
          },
          
          {
            Header: 'Date',
            accessor: 'date'
          },
          {
            Header: 'Actions',
            className: 'cell-center',
            disableSortBy: true,
            Cell: ({ row }) => ActionCell(row, setTest, setDeletingTest, handleAdd, handleClose, theme)
          }
        ],
        
        [theme]
      );

  return (
    <MainCard content={false}>
      <ScrollX>
        <TestTable columns={columns} handleAdd={handleAdd} getHeaderProps={(column) => column.getSortByToggleProps()} />
      </ScrollX>
      <DeleteTest title={deletingTest.name} testId={deletingTest._id} open={open} handleClose={handleClose} />
      {/* add test dialog */}
      <Dialog
        maxWidth="sm"
        TransitionComponent={PopupTransition}
        keepMounted
        fullWidth
        onClose={handleAdd}
        open={add}
        sx={{ '& .MuiDialog-paper': { p: 0 }, transition: 'transform 225ms' }}
        aria-describedby="alert-dialog-slide-description"
      >
        <AddTest test={test} onCancel={handleAdd} />
      </Dialog>
    </MainCard>
  );
};

export default LabtestPageB;