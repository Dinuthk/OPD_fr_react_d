import PropTypes from 'prop-types';
import MainCard from 'components/MainCard';
import DrugTable from './components/opd_drug-table';
import ScrollX from 'components/ScrollX';
import AlertDrugDelete from './components/opd_drug-delete-alert';
import { Chip, Dialog, IconButton, Stack, Tooltip, Typography, useTheme } from '@mui/material';
import AddDrug from './components/opd_add-drug';
import { useMemo, useState } from 'react';
import { PopupTransition } from 'components/@extended/Transitions';
import { IndeterminateCheckbox } from 'components/third-party/ReactTable';
import Avatar from 'components/@extended/Avatar';
import { PatternFormat } from 'react-number-format';
import { CloseOutlined, DeleteTwoTone, EditTwoTone, EyeTwoTone } from '@ant-design/icons';

// ==============================|| drug - LIST ||============================== //

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

const ActionCell = (row, setDrug, setCustomerDeleteId, handleAdd, handleClose, theme) => {
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
            setDrug(row.values);
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

const DrugListPage = () => {
  const theme = useTheme();

  const [add, setAdd] = useState(false);
  const [open, setOpen] = useState(false);
  const [drug, setDrug] = useState();
  const [deletingDrug, setDeletingDrug] = useState({
    _id: null,
    name: ''
  });

  const handleAdd = () => {
    setAdd(!add);
    if (drug && !add) setDrug(null);
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
        Header: 'DID',
        accessor: '_id',
        className: 'cell-center',
        Cell: IndexCell
      },
      {
        Header: 'Name',
        accessor: 'name',
        Cell: CustomCell
      },
      {
        Header: 'Form',
        accessor: 'form',
        disableSortBy: true
      },
      {
        Header: 'Quantity',
        accessor: 'qty'
      },
      {
        Header: 'Strength',
        accessor: 'strength'
      },
      
      {
        Header: 'Expire Date',
        accessor: 'expiredate'
      },
      {
        Header: 'Actions',
        className: 'cell-center',
        disableSortBy: true,
        Cell: ({ row }) => ActionCell(row, setDrug, setDeletingDrug, handleAdd, handleClose, theme)
      }
    ],
    
    [theme]
  );

  return (
    <MainCard content={false}>
      <ScrollX>
        <DrugTable columns={columns} handleAdd={handleAdd} getHeaderProps={(column) => column.getSortByToggleProps()} />
      </ScrollX>
      <AlertDrugDelete title={deletingDrug.name} drugId={deletingDrug._id} open={open} handleClose={handleClose} />
      {/* add drug dialog */}
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
        <AddDrug drug={drug} onCancel={handleAdd} />
      </Dialog>
    </MainCard>
  );
};

export default DrugListPage;