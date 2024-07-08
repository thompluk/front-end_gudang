import { useEffect, useState, useMemo } from 'react'
import axiosClient from '../../axios-client.js'
import { Link } from 'react-router-dom'
import { useStateContext } from '../../contexts/ContextProvider.jsx'
import { FaEdit } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'
import { GrNext } from 'react-icons/gr'
import { GrPrevious } from 'react-icons/gr'
import { Table, Pagination, FormControl, InputGroup, Button, Container, Row, Col } from 'react-bootstrap'
import { useTable, useSortBy, usePagination, useGlobalFilter } from 'react-table'

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const { setNotification } = useStateContext()

  useEffect(() => {
    getUsers()
  }, [])

  const onDeleteClick = user => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return
    }
    axiosClient.delete(`/user/${user.id}`).then(() => {
      setNotification('User was successfully deleted')
      getUsers()
    })
  }

  const getUsers = () => {
    setLoading(true)
    axiosClient
      .get('/alluser')
      .then(({ data }) => {
        setLoading(false)
        setUsers(data.data)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  const data = useMemo(() => users, [users])
  const columns = useMemo(
    () => [
      // { Header: 'No.', accessor: (row) => users.indexOf(row) + 1, headerClassName: 'text-center', cellClassName: 'text-center', width: '5%' }, // Menggunakan indeks absolut dari data untuk nomor urut
      { Header: 'ID', accessor: 'id', headerClassName: 'text-center', cellClassName: 'text-center', width: '5%' }, // Tambahkan properti width di sini
      { Header: 'Name', accessor: 'name', headerClassName: 'text-start', cellClassName: 'text-start', width: '25%' },
      { Header: 'Email', accessor: 'email', headerClassName: 'text-start', cellClassName: 'text-start', width: '30%' },
      {
        Header: 'Phone Number',
        accessor: 'phone_number',
        headerClassName: 'text-end',
        cellClassName: 'text-end',
        width: '20%',
      },
      { Header: 'Role', accessor: 'role', headerClassName: 'text-center', cellClassName: 'text-center', width: '10%' },
      {
        Header: 'Actions',
        accessor: 'actions',
        headerClassName: 'text-center',
        cellClassName: 'text-center',
        width: '10%',
        Cell: ({ row }) => (
          <div className="text-center">
            <Link to={'/users/' + row.original.id}>
              <Button variant="warning" size="sm" className="me-2">
                <FaEdit />
              </Button>
            </Link>
            <Button variant="danger" size="sm" onClick={() => onDeleteClick(row.original)}>
              <MdDelete />
            </Button>
          </div>
        ),
        disableSortBy: true,
      },
    ],
    [users]
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state,
    setGlobalFilter,
  } = useTable({ columns, data, initialState: { pageIndex: 0 } }, useGlobalFilter, useSortBy, usePagination)

  const { pageIndex, pageSize, globalFilter } = state

  return (
    <Row className="card animated fadeInDown">
      <Col>
        <h1 style={{ borderBottom: '1px solid grey' }}>Users</h1>
        <div className="d-flex justify-content-between align-items-center mb-3" style={{ paddingTop: '20px' }}>
          <Link className="btn btn-primary" to="/users/new">
            Add new
          </Link>
          <InputGroup className="mb-3" style={{ width: '300px' }}>
            <FormControl
              placeholder="Search"
              value={globalFilter || ''}
              onChange={e => setGlobalFilter(e.target.value)}
            />
          </InputGroup>
        </div>
        <Table {...getTableProps()} striped hover responsive className="table-xl">
          <thead className="table-primary">
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className={column.headerClassName}
                    style={{ width: column.width }}
                  >
                    {column.render('Header')}
                    <span>{column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}</span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center">
                  Loading...
                </td>
              </tr>
            ) : (
              page.map(row => {
                prepareRow(row)
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map(cell => (
                      <td {...cell.getCellProps()} className={cell.column.cellClassName}>
                        {cell.render('Cell')}
                      </td>
                    ))}
                  </tr>
                )
              })
            )}
          </tbody>
        </Table>
        <div className="d-flex justify-content-end">
          <div style={{ paddingTop: '10px' }}>
            <span>
              Page{' '}
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>{' '}
            </span>
            <select
              value={pageSize}
              onChange={e => {
                setPageSize(Number(e.target.value))
              }}
            >
              {[10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Button onClick={() => previousPage()} hidden={!canPreviousPage} style={{ margin: '5px', padding: '5px' }}>
              <GrPrevious />
            </Button>
            <Button onClick={() => nextPage()} hidden={!canNextPage} style={{ margin: '5px', padding: '5px' }}>
              <GrNext />
            </Button>
          </div>
        </div>
      </Col>
    </Row>
  )
}
