// ==============================|| REACT TABLE ||============================== //

import PropTypes from 'prop-types';

//import UserView from './user-view';
import { Button, Stack, Table, TableBody, TableCell, TableHead, TableRow, useMediaQuery, useTheme } from '@mui/material';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'store';
import { useExpanded, useFilters, useGlobalFilter, usePagination, useRowSelect, useSortBy, useTable } from 'react-table';
import { dispatch } from 'store';
// import { getRoles } from 'store/reducers/role';
import { getUsersByDoctor } from 'store/reducers/user';
import { CSVExport, HeaderSort, SortingSelect, TablePagination, TableRowSelection } from 'components/third-party/ReactTable';
import { GlobalFilter, renderFilterTypes } from 'utils/react-table';
import { PlusOutlined } from '@ant-design/icons';


function PaymentTable({ columns, getHeaderProps, handleAdd }) {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  const filterTypes = useMemo(() => renderFilterTypes, []);
  const sortBy = { id: 'name', desc: false };

  const [query, setQuery] = useState('');
  const [numOfPages, setNumOfPages] = useState(10);

  const {
    users: { users, total },
    action
  } = useSelector((state) => state.users);

  console.log("before load patients",users);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    // setHiddenColumns,
    allColumns,
    visibleColumns,
    rows,
    page,
    gotoPage,
    setPageSize,
    state: { globalFilter, selectedRowIds, pageIndex, pageSize, expanded },
    preGlobalFilteredRows,
    // setGlobalFilter,
    setSortBy,
    selectedFlatRows
  } = useTable(
    {
      columns,
      data: users,
      filterTypes,
      initialState: { pageIndex: 0, pageSize: 10, hiddenColumns: ['photo', 'role._id', 'startDate', 'note', 'dateOfBirth'] },
      manualPagination: true,
      pageCount: Math.ceil(total / numOfPages),
      autoResetPage: false
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect
  );

  useEffect(() => {
    // dispatch(getRoles(pageIndex, pageSize, query));
    dispatch(getUsersByDoctor(pageIndex, pageSize, query));
    console.error('dispatched',users);
  }, [pageIndex, pageSize, query, action]);

  // useEffect(() => {
  //   if (matchDownSM) {
  //     setHiddenColumns(['age', 'phone', 'visits', 'email', 'accountStatus', 'imageUrl']);
  //   } else {
  //     setHiddenColumns(['age', 'address', 'imageUrl', 'accountStatus']);
  //   }
  //   // eslint-disable-next-line
  // }, [matchDownSM]);

  const renderRowSubComponent = useCallback(
    ({ row }) => {
      return <PatientView data={users.find((user) => user._id === row.values._id)} />;
    },
    [users]
  );

  return (
    <>
      <TableRowSelection selected={Object.keys(selectedRowIds).length} />
      <Stack spacing={3}>
        <Stack
          direction={matchDownSM ? 'column' : 'row'}
          spacing={1}
          justifyContent="space-between"
          alignItems="center"
          sx={{ p: 3, pb: 0 }}
        >
          <GlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            globalFilter={globalFilter}
            setGlobalFilter={(value) => {
              if (value !== undefined) {
                setQuery(value);
              } else {
                setQuery('');
              }
            }}
            size="small"
          />
          <Stack direction={matchDownSM ? 'column' : 'row'} alignItems="center" spacing={1}>
            <SortingSelect sortBy={sortBy.id} setSortBy={setSortBy} allColumns={allColumns} />
            <Button variant="contained" startIcon={<PlusOutlined />} onClick={handleAdd} size="small">
              Add Patient
            </Button>
            <CSVExport data={selectedFlatRows.length > 0 ? selectedFlatRows.map((d) => d.original) : users} filename={'user-list.csv'} />
          </Stack>
        </Stack>

        <Table {...getTableProps()}>
          <TableHead>
            {headerGroups.map((headerGroup, i) => (
              <TableRow key={i} {...headerGroup.getHeaderGroupProps()} sx={{ '& > th:first-of-type': { width: '58px' } }}>
                {headerGroup.headers.map((column, index) => (
                  <TableCell key={index} {...column.getHeaderProps([{ className: column.className }, getHeaderProps(column)])}>
                    <HeaderSort column={column} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              const rowProps = row.getRowProps();

              return (
                <Fragment key={i}>
                  <TableRow
                    {...row.getRowProps()}
                    onClick={() => {
                      row.toggleRowSelected();
                    }}
                    sx={{ cursor: 'pointer', bgcolor: row.isSelected ? alpha(theme.palette.primary.lighter, 0.35) : 'inherit' }}
                  >
                    {row.cells.map((cell, index) => (
                      <TableCell key={index} {...cell.getCellProps([{ className: cell.column.className }])}>
                        {cell.render('Cell')}
                      </TableCell>
                    ))}
                  </TableRow>
                  {row.isExpanded && renderRowSubComponent({ row, rowProps, visibleColumns, expanded })}
                </Fragment>
              );
            })}
            <TableRow sx={{ '&:hover': { bgcolor: 'transparent !important' } }}>
              <TableCell sx={{ p: 2, py: 3 }} colSpan={9}>
                <TablePagination
                  serverSidePagination={true}
                  total={total}
                  gotoPage={gotoPage}
                  rows={rows}
                  setPageSize={(size) => {
                    setPageSize(size);
                    setNumOfPages(size);
                  }}
                  pageSize={pageSize}
                  pageIndex={pageIndex}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Stack>
    </>
  );
}

PaymentTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  getHeaderProps: PropTypes.func,
  handleAdd: PropTypes.func,
  renderRowSubComponent: PropTypes.any
};

export default PaymentTable;
