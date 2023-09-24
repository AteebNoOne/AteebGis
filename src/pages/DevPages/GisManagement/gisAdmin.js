import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import ReactSelect from 'react-select';
import Iconify from 'src/components/iconify/Iconify';
import {
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Container,
  Stack,
  Typography,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Popover,
  TableRow,
  TableBody,
  Table,
  TableCell,
  IconButton,
  TableContainer,
  TablePagination,
  Modal,
  Box,
  Paper,
  TableHead,
  CircularProgress,
} from '@mui/material';
import Scrollbar from 'src/components/scrollbar/Scrollbar';
import { UserListHead, UserListToolbar } from 'src/sections/@dashboard/user';
import { useTranslation } from 'react-i18next';
import { MapboxGLComponent } from 'src/components/MapBoxGL';
import LocationInput from 'src/components/MapInput';
import moment from 'moment';
import MaterialTable from 'material-table';
import axios from 'axios';
import { tableIcons } from 'src/constants/tableIcons';
import { excerpt } from 'src/utils/helperFunction';

const GisAdmin = () => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [parcelNumber, setParcelNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [userName, setUserName] = useState('');
  const [userRoleSelected, setUserRoleSelected] = useState('');
  const [mapSec, setMapSec] = useState('gisList');
  const [gpsPoints, setGpsPoints] = useState(['', '', '']);
  const [userList, setUserList] = React.useState([]);
  const [userRole, setUserRole] = React.useState([]);
  const [fileUrl, setFileUrl] = useState('');
  const [selectedUsersList, setSelectedUsers] = useState([]);
  const [parcelData, setParcelData] = useState([]);
  const [gpsCords, setGpscords] = useState([]);
  const [parcelDetailsD, setParcelDetialsD] = useState({});
  const [open, setOpen] = useState(false);
  const [uploadSec, setUploadSec] = useState(false);
  const [noteSec, setNoteSec] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [userId, setUserId] = useState(null);
  const [ownerRole, setOwnerRole] = React.useState('');
  const [selectedUserss, setSelectedUserss] = useState([]);
  const [allOwners, setAllOwners] = useState([]);
  const [owner, setOwner] = useState('');
  const [editValues, setEditValues] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [isOwnerUpdate, setIsOwnerUpdate] = useState(false);
  const [roles, setRoles] = useState([]);
  // const [owners, setOwners] = useState("");
  const [isOwnerLoading, setIsOwnerLoading] = useState(false);
  const apiUrl = process.env.REACT_APP_BASE_URL;
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOwner('');
    setOpenModal(false);
    setEditMode(false);
  };

  const handleAddOwner = (edit) => {
    if (!edit) {
      const data =
        parcelDetailsD?.owners?.length > 0
          ? parcelDetailsD.owners + ',' + selectedUserss.join(',')
          : selectedUserss.join();
      console.log('ABC: ', data);
      axios
        .put(`${apiUrl}/gisadmin_owners/${parcelDetailsD?.sn}`, {
          owners: data,
        })
        .then((response) => {
          setIsOwnerUpdate(!isOwnerUpdate);
          alert('Owner Added successfully', response);
          handleCloseModal();
        })
        .catch((error) => {
          console.error('An error occurred while updating data:', error);
        });
    } else {
      const data = allOwners.map((value) => value.value);
      axios
        .put(`${apiUrl}/gisadmin_owners/${parcelDetailsD?.sn}`, {
          owners: data.join(','),
        })
        .then((response) => {
          setIsOwnerUpdate(!isOwnerUpdate);
          alert('Owners Deleted successfully', response);
          handleCloseModal();
        })
        .catch((error) => {
          console.error('An error occurred while updating data:', error);
        });
    }
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    height: 320,
    bgcolor: 'background.paper',
    borderRadius: '8px',
    boxShadow: 24,
    p: 4,
  };

  useEffect(() => {
    console.log('parcelDetailsD', parcelDetailsD);
    if (parcelDetailsD?.owners?.length > 0) {
      console.log('True: ', parcelDetailsD.owners);
      setAllOwners(
        parcelDetailsD?.owners?.split(',').map((value) => {
          return { value, label: value };
        })
      );
    }
  }, [parcelDetailsD, isOwnerUpdate]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const TABLE_HEAD = [
    { id: 'id', label: t('SL NO'), alignRight: false },
    { id: 'initiator_role', label: t('Parcel Number'), alignRight: false },
    {
      id: 'initiator_role_optional',
      label: t('Date created'),
      alignRight: false,
    },
    { id: 'workflow_prefix', label: t('Created By'), alignRight: false },
    { id: 'form_name', label: t('See Parcel'), alignRight: false },
    { id: 'reviewer', label: t('Edit Parcel'), alignRight: false },
    //   { id: 'final_approval', label: 'Final Approval', alignRight: false },
  ];

  const handleFilterByName = (event) => {
    // setPage(0);
    setFilterName(event.target.value);
  };

  useEffect(() => {
    let userDetails = JSON.parse(localStorage.getItem('adminInfo'));
    getData();
    setUserName(userDetails?.full_name);
    getRole();
  }, [isOwnerUpdate]);

  const handleGpsPointChange = (index, value) => {
    const newGpsPoints = [...gpsPoints];
    newGpsPoints[index] = value;
    setGpsPoints(newGpsPoints);
  };

  const handleUserSelectChange = (event) => {
    const { value } = event.target;
    setSelectedUsers(value);
  };

  const handleAddGpsPoint = () => {
    const newGpsPoints = [...gpsPoints, ''];

    if (gpsPoints.some((point) => point === '')) {
      alert('Please Enter The Above GPS Points');
      return false;
    }

    setGpsPoints(newGpsPoints);
  };

  useEffect(() => {
    getRoles();
  }, []);

  const getRoles = async () => {
    try {
      const response = await axios.get(`${apiUrl}/admin-roles`);
      const rolesData = response.data;
      setRoles(rolesData); // Set the roles in the state variable
    } catch (error) {
      console.error(error); // Handle any errors that occur
    }
  };

  const handleSave = async () => {
    if (isEdit) {
      const valid = next(true);
      console.log('Edit: ', !!valid);
      if (!!valid) {
        // Handle save logic here
        let finalDetails = {
          parcel: parcelNumber,
          date: editValues.date,
          notes: JSON.stringify([{ msg: notes, addedBy: userName }]),
          username: editValues.username,
          gpspoints: JSON.stringify(gpsPoints),
          userrole: editValues.userrole,
          userlist: editValues.userlist,
          documents: editValues.documents,
        };
        // console.log(finalDetails)

        try {
          const response = await axios.put(
            `${apiUrl}/gisadmin-update/${editValues.sn}`,
            finalDetails
          );

          console.log('Response:', response.data);
          alert('Parcel updated');
          window.location.reload();
        } catch (error) {
          console.error('Error:', error);
        }
      }
    } else {
      // Handle save logic here
      let finalDetails = {
        parcel: parcelNumber,
        date: `${moment().format('YYYY-MM-DD HH:mm:ss')}`,
        notes: JSON.stringify([{ msg: notes, addedBy: userName }]),
        username: userName,
        gpspoints: JSON.stringify(gpsPoints),
        userrole: userRoleSelected,
        userlist: JSON.stringify(selectedUsersList),
        documents: '',
      };
      // console.log(finalDetails)

      try {
        const response = await axios.post(`${apiUrl}/gisadmin`, finalDetails);

        console.log('Response:', response.data);
        alert('Parcel created');
        window.location.reload();
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const fileUpload = async () => {
    let uploadLinks = await uploadFile(parcelNumber);

    let oldDocs = parcelDetailsD.documents.split(',');
    const data = {
      ...parcelDetailsD,
      documents: [...oldDocs, ...uploadLinks].join(','),
    };

    const id = parcelDetailsD.parcel; // Replace 'your-id' with the actual ID

    axios
      .put(`${apiUrl}/gisadmin/${id}`, data)
      .then((response) => {
        alert('Data updated successfully');
        setUploadSec(false);
        setFileUrl('');
        // Handle the successful response here
      })
      .catch((error) => {
        console.error('An error occurred while updating data:', error);
        // Handle the error response here
      });
  };

  const notesUpdate = async () => {
    let oldNotes = JSON.parse(parcelDetailsD.notes);
    let newNotes = [
      {
        msg: `${newNote}`,
        addedBy: `${userName}`,
      },
    ];
    const data = {
      ...parcelDetailsD,
      notes: JSON.stringify([...newNotes, ...oldNotes]),
    };
    console.log(data);
    const id = parcelDetailsD.parcel;

    axios
      .put(`${apiUrl}/gisadmin/${id}`, data)
      .then((response) => {
        alert('Data updated successfully');
        setNoteSec(false);
        getData();
      })
      .catch((error) => {
        console.error('An error occurred while updating data:', error);
      });
  };

  const uploadFile = async (parcel) => {
    const formData = new FormData();
    // formData.append("file", fileUrl);
    console.log('FILEEEE', fileUrl);
    Array.from(fileUrl).forEach((file) => {
      formData.append('files', file);
    });
    formData.append('type', 'parcel');
    formData.append('category', parcel);

    try {
      const response = await axios.post(
        'https://test.node.docgis.com/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Handle the response after successful upload
      // console.log(response.data);
      return response.data.downloadLinks;
      // You can use the response to retrieve the download link or other information
    } catch (error) {
      // Handle error
      console.error(error);
    }
  };

  React.useEffect(() => {
    if (ownerRole !== '') {
      axios
        .get(`${apiUrl}/user/${ownerRole}`)
        .then((res) => {
          // console.log(res.data);
          const options = res.data.map((item) => ({
            label: `${item.Fname} ${item.Lname}`,
            value: `${item.u_id} - ${item.Fname} ${item.Lname}`,
          }));
          setSelectedUsers(options.map((i) => i.value));
          setUserList(options);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [ownerRole]);

  const handleSelectChange = (event) => {
    const { value } = event.target;
    setSelectedUserss(value);
  };

  const handleRemove = (removedOption) => {
    setSelectedUserss((prevSelected) =>
      prevSelected.filter((option) => option !== removedOption)
    );
  };

  const handleChange = (selectedOptions) => {
    setAllOwners(selectedOptions);
  };

  console.log('All Owners Userss: ', allOwners);

  const next = (edit) => {
    if (parcelNumber === '') {
      alert('Please Enter Parcel Number');
      return false;
    }
    if (notes === '') {
      alert('Please Provide the Note');
      return false;
    }
    if (gpsPoints[0] === '') {
      alert('Please Fill Atleast 3 GPS points');
      return false;
    }
    if (gpsPoints[1] === '') {
      alert('Please Fill Atleast 3 GPS points');
      return false;
    }
    if (gpsPoints[2] === '') {
      alert('Please Fill Atleast 3 GPS points');
      return false;
    }
    if (edit) {
      return true;
    }
    if (!edit) {
      setMapSec('gisParcel2');
    }
  };

  const getRole = async () => {
    try {
      const response = await axios.get(`${apiUrl}/roles`);
      // console.log(response.data);
      setUserRole(response.data);
    } catch (error) {
      // Handle errors
      console.error(error);
    }
  };

  const getData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/gisadmin`);
      console.log(response.data);
      // setUserRole(response.data);
      const sortedData = response.data.sort((a, b) => {
        // Assuming the timestamp field is named "timestamp"
        const timestampA = new Date(a.date);
        const timestampB = new Date(b.date);
        return timestampB - timestampA; // Sort in descending order
      });
      setParcelData(sortedData);
      sortedData.map((details) => {
        if (details.parcel == parcelDetailsD?.parcel) {
          setParcelDetialsD(details);
          console.log('-------- Details: ', details);
        }
      });
    } catch (error) {
      // Handle errors
      console.error(error);
    }
  };
  React.useEffect(() => {
    if (userRoleSelected !== '') {
      axios
        .get(`${apiUrl}/admin/${userRoleSelected}`)
        .then((res) => {
          // console.log(res.data);
          const options = res.data.map((item) => ({
            label: item.full_name,
            value: item.username,
          }));
          setUserList(options);
          setSelectedUsers([]);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [userRoleSelected]);

  const handleUpdateRow = (rowData) => {
    setIsEdit(true);
    setEditValues(rowData);
  };
  console.log('GPS Points: ', gpsPoints);

  useEffect(() => {
    if (Object.values(editValues).length > 0) {
      console.log('EditValues: ', editValues);
      setParcelNumber(editValues.parcel);
      console.log('-------: ', JSON.parse(editValues.notes));
      setNotes(JSON.parse(editValues.notes)[0].msg);
      const gps = JSON.parse(editValues.gpspoints);
      setGpsPoints([gps[0], gps[1], gps[2]]);
      setMapSec('gisParcel');
    }
  }, [editValues]);
  console.log('isEdit: ', isEdit);

  return (
    <>
      <Helmet>
        <title> Gis Admin</title>
      </Helmet>
      <Container>
        <Stack
          direction='row'
          alignItems='center'
          justifyContent='space-between'
          mb={5}
        >
          {mapSec === 'gisMap' ||
          mapSec === 'gisParcel' ||
          mapSec === 'gisParcel2' ||
          mapSec === 'gisDetails' ? (
            <>
              <Button
                variant='contained'
                style={{ background: 'red' }}
                onClick={() => {
                  setMapSec('gisList');
                  setIsEdit(false);
                  setEditValues({});
                  setParcelNumber('');
                  setNotes('');
                  setGpsPoints(['', '', '']);
                }}
                startIcon={<Iconify icon='mdi-light:cancel' />}
              >
                {t('Cancel')}
              </Button>
            </>
          ) : (
            <>
              <Typography variant='h4' gutterBottom>
                {/* {t("Gis Admin")} */}
              </Typography>

              <Button
                variant='contained'
                onClick={() => setMapSec('gisParcel')}
                startIcon={<Iconify icon='eva:plus-fill' />}
              >
                {t('Add Parcel')}
              </Button>
            </>
          )}
        </Stack>
        <Card>
          {mapSec === 'gisMap' ? (
            <MapboxGLComponent />
          ) : mapSec === 'gisParcel' ? (
            <div style={{ padding: '20px' }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label='Parcel Number'
                    placeholder='Enter Parcel Number'
                    type='number'
                    value={parcelNumber}
                    onChange={(e) => {
                      setParcelNumber(e.target.value);
                    }}
                    sx={{ mb: 3 }}
                    fullWidth
                  />
                  <TextField
                    label='Notes'
                    placeholder='Enter Notes'
                    type='text'
                    value={notes}
                    onChange={(e) => {
                      setNotes(e.target.value);
                    }}
                    multiline
                    sx={{ mb: 3 }}
                    fullWidth
                  />
                  <TextField
                    label='Current Date and Time'
                    value={moment().format('YYYY-MM-DD HH:mm:ss')}
                    disabled
                    sx={{ mb: 3 }}
                    fullWidth
                  />
                  <TextField
                    label='User Full Name'
                    value={userName}
                    disabled
                    fullWidth
                    sx={{ mb: 3 }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label='GPS Point 1 (Mandatory)'
                    value={gpsPoints[0]}
                    onChange={(e) => handleGpsPointChange(0, e.target.value)}
                    fullWidth
                    sx={{ mb: 3 }}
                  />
                  <TextField
                    label='GPS Point 2 (Mandatory)'
                    value={gpsPoints[1]}
                    onChange={(e) => handleGpsPointChange(1, e.target.value)}
                    fullWidth
                    sx={{ mb: 3 }}
                  />
                  <TextField
                    label='GPS Point 3 (Mandatory)'
                    value={gpsPoints[2]}
                    onChange={(e) => handleGpsPointChange(2, e.target.value)}
                    fullWidth
                    sx={{ mb: 3 }}
                  />
                  {gpsPoints.slice(3).map((gpsPoint, index) => (
                    <TextField
                      key={index + 3}
                      label={`GPS Point ${index + 4}`}
                      value={gpsPoint}
                      sx={{ mb: 3 }}
                      onChange={(e) =>
                        handleGpsPointChange(index + 3, e.target.value)
                      }
                      fullWidth
                    />
                  ))}
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={handleAddGpsPoint}
                    sx={{ m: 3 }}
                  >
                    Add More GPS Points
                  </Button>
                  <LocationInput />
                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={() => {
                        if (isEdit) {
                          handleSave();
                        } else {
                          next();
                        }
                      }}
                      sx={{ mt: 4, width: '140px', height: '44px' }}
                    >
                      Save
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </div>
          ) : mapSec === 'gisParcel2' ? (
            <>
              <div style={{ padding: '3vh' }}>
                <Grid>
                  <Grid mb={4} item xs={8} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel id='User Role'>
                        {/* {t("Initiator Role")} */}
                        User Role
                      </InputLabel>
                      <Select
                        labelId='Admin Role'
                        id='User Role'
                        value={userRoleSelected}
                        onChange={(event) =>
                          setUserRoleSelected(event.target.value)
                        }
                      >
                        {roles.map((role) => (
                          <MenuItem key={role.id} value={role.name}>
                            {role.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid mb={4} item xs={12} sm={12}>
                    <FormControl fullWidth>
                      <InputLabel id='Users'>
                        {/* {t("Users")} */}
                        {t('Users')}
                      </InputLabel>
                      <Select
                        labelId='Users'
                        id='Users'
                        multiple
                        value={selectedUsersList}
                        onChange={handleUserSelectChange}
                        renderValue={(selected) => selected.join(', ')}
                      >
                        {userList?.map((item) => (
                          <MenuItem key={item.value} value={item.value}>
                            <Checkbox
                              checked={selectedUsersList.includes(item.value)}
                            />
                            {item.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={handleSave}
                  size='large'
                >
                  Save
                </Button>
              </div>
            </>
          ) : mapSec === 'gisList' ? (
            <>
              <Scrollbar>
                <MaterialTable
                  title=''
                  columns={[
                    {
                      title: 'SL Number',
                      render: (rowData) => rowData.tableData.id + 1,
                    },
                    {
                      title: 'Parcel Number',
                      field: 'parcel',
                      render: (rowData) => (
                        <div
                          onClick={() => {
                            setParcelDetialsD(rowData);
                            setMapSec('gisDetails');
                          }}
                          style={{
                            background:
                              rowData.owners?.length > 0
                                ? '#40da40'
                                : 'rgb(239 90 90)',
                            borderRadius: '25px',
                            textAlign: 'center',
                            color: 'black',
                            fontWeight: '600',
                            paddingTop: '10px',
                            paddingBottom: '10px',
                            cursor: 'pointer',
                          }}
                        >
                          {rowData?.parcel}
                        </div>
                      ),
                    },
                    {
                      title: 'Date Created',
                      field: 'date',
                      render: (rowData) =>
                        moment(rowData?.date).format('DD/MM/YYYY | h:mm A'),
                    },
                    {
                      title: 'Created By',
                      field: 'username',
                    },
                    {
                      title: 'Details',
                      render: (rowData) => (
                        <Button
                          variant='contained'
                          onClick={() => {
                            let cords = JSON.parse(rowData?.gpspoints);
                            setGpscords(
                              cords.map((item) => {
                                let data = item.split(',');
                                return [Number(data[1]), Number(data[0])];
                              })
                            );
                            handleOpen();
                          }}
                        >
                          View Parcel
                        </Button>
                      ),
                    },
                  ]}
                  data={parcelData}
                  icons={tableIcons}
                  options={{
                    search: true,
                    sorting: true,
                    pageSize: 5,
                    paging: true,
                    actionsColumnIndex: -1,
                  }}
                  actions={[
                    {
                      icon: tableIcons.Edit,
                      tooltip: t('Edit Parcel'),
                      onClick: (event, rowData) => {
                        handleUpdateRow(rowData);
                      },
                    },
                  ]}
                />
              </Scrollbar>
            </>
          ) : mapSec === 'gisDetails' ? (
            <div>
              {console.log('Parcel Details D: ', parcelDetailsD)}
              {parcelDetailsD != {} && (
                <div>
                  <Box sx={{ flexGrow: 1 }} padding={2}>
                    <h2>View Parcel Details</h2>
                    <Grid container spacing={2}>
                      <Grid item xs={5}>
                        <InputLabel style={{ marginBottom: '2vh' }}>
                          Parcel Number : {parcelDetailsD.parcel}
                        </InputLabel>
                        <InputLabel style={{ marginBottom: '2vh' }}>
                          Date Created : {parcelDetailsD.date}
                        </InputLabel>
                        <InputLabel style={{ marginBottom: '2vh' }}>
                          Created By : {parcelDetailsD.username}
                        </InputLabel>
                        <InputLabel>
                          GPS Points -
                          <ol>
                            {JSON.parse(parcelDetailsD?.gpspoints).map(
                              (item) => {
                                return (
                                  <li style={{ marginBottom: '1vh' }}>
                                    {item}
                                  </li>
                                );
                              }
                            )}
                          </ol>
                        </InputLabel>
                      </Grid>
                      <Grid item xs={5}>
                        <InputLabel style={{ marginBottom: '2vh' }}>
                          Parcel Owners :
                          <ol>
                            {parcelDetailsD.owners &&
                              parcelDetailsD.owners.split(',').map((item) => {
                                // const name = item.split(" - ")[1];
                                return (
                                  <li style={{ marginBottom: '1vh' }}>
                                    {item}
                                  </li>
                                );
                              })}
                          </ol>
                          <Button
                            variant='contained'
                            startIcon={<Iconify icon='eva:plus-fill' />}
                            size='small'
                            onClick={() => {
                              handleOpenModal();
                              setEditMode(false);
                            }}
                          >
                            {t('Add New Owner')}
                          </Button>
                        </InputLabel>
                      </Grid>
                      <Grid item xs={2}>
                        <Button
                          variant='contained'
                          startIcon={<Iconify icon='eva:plus-fill' />}
                          size='small'
                          disabled={!parcelDetailsD?.owners?.length > 0}
                          onClick={() => {
                            if (parcelDetailsD?.owners?.length > 0) {
                              setAllOwners(
                                parcelDetailsD?.owners
                                  ?.split(',')
                                  .map((value) => {
                                    return { value, label: value };
                                  })
                              );
                            }
                            handleOpenModal();
                            setEditMode(true);
                          }}
                        >
                          {t('Delete Owner')}
                        </Button>
                      </Grid>

                      {/* // Documents here for the Upload Button  */}

                      <Grid item xs={7}>
                        <h3>Documents</h3>
                      </Grid>

                      <Grid item xs={5}>
                        <label>
                          {}
                          <input
                            onChange={(e) => {
                              setFileUrl(e.target.files);
                            }}
                            type='file'
                            multiple
                            hidden
                          />
                          <Button
                            variant='outlined'
                            startIcon={<Iconify icon='eva:plus-fill' />}
                            size='large'
                            color='primary'
                            component='span'
                          >
                            {fileUrl ? (
                              <span>{excerpt(fileUrl['0']?.name, 15)}</span>
                            ) : (
                              t('Choose Document')
                            )}
                          </Button>
                        </label>

                        <Button
                          variant='contained'
                          startIcon={<Iconify icon='ph:upload' />}
                          size='large'
                          color='success'
                          component='span'
                          disabled={!fileUrl}
                          onClick={() => fileUpload()}
                          style={{ marginRight: '6px', float: 'right' }}
                        >
                          {t('Upload Document')}
                        </Button>
                      </Grid>

                      {/* // table here for the Documents  */}

                      <Grid item xs={12}>
                        <TableContainer component={Paper}>
                          <Table
                            sx={{ minWidth: 650 }}
                            aria-label='simple table'
                          >
                            <TableHead>
                              <TableRow>
                                <TableCell>Document Name</TableCell>
                                {/* <TableCell>View</TableCell> */}
                                <TableCell>View/Download</TableCell>
                                <TableCell>Delete</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {console.log(parcelDetailsD)}
                              {parcelDetailsD.documents
                                .split(',')
                                .map((item) => {
                                  if (item != '') {
                                    return (
                                      <TableRow
                                        sx={{
                                          '&:last-child td, &:last-child th': {
                                            border: 0,
                                          },
                                        }}
                                      >
                                        <TableCell component='th' scope='row'>
                                          {
                                            item.split('/')[
                                              item.split('/').length - 1
                                            ]
                                          }
                                        </TableCell>
                                        {/* <TableCell>
                                      <Button
                                        variant="contained"
                                        startIcon={<Iconify icon="tabler:eye" />}
                                        size="small"
                                      >
                                        {t("View")}
                                      </Button>
                                    </TableCell> */}
                                        <TableCell>
                                          <Button
                                            variant='contained'
                                            startIcon={
                                              <Iconify icon='ph:download' />
                                            }
                                            size='small'
                                            onClick={() => {
                                              const a =
                                                document.createElement('a');
                                              a.href = item;
                                              a.target = '_blank';
                                              a.download =
                                                item.split('/')[
                                                  item.split('/').length - 1
                                                ];
                                              document.body.appendChild(a);
                                              a.click();
                                              window.URL.revokeObjectURL(item);
                                            }}
                                          >
                                            {t('View')}/{t('Download')}
                                          </Button>
                                        </TableCell>
                                        <TableCell>
                                          <Button
                                            variant='contained'
                                            startIcon={
                                              <Iconify icon='material-symbols:delete-outline' />
                                            }
                                            size='small'
                                            color='error'
                                            disabled
                                          >
                                            {t('Delete')}
                                          </Button>
                                        </TableCell>
                                      </TableRow>
                                    );
                                  }
                                })}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Grid>

                      {/* // Parcel here for the Notes  */}

                      <Grid item xs={8}>
                        {noteSec ? (
                          <TextField
                            label='New Note'
                            placeholder='Enter New Note'
                            type='text'
                            onChange={(e) => {
                              setNewNote(e.target.value);
                            }}
                            fullWidth
                          />
                        ) : (
                          <h3>Parcel Notes</h3>
                        )}
                      </Grid>

                      <Grid item xs={4}>
                        {noteSec ? (
                          <>
                            <Button
                              variant='contained'
                              startIcon={<Iconify icon='eva:plus-fill' />}
                              size='large'
                              color='success'
                              onClick={() => notesUpdate()}
                              style={{ marginRight: '10px' }}
                            >
                              {t('Add')}
                            </Button>
                            <Button
                              variant='contained'
                              startIcon={<Iconify icon='eva:plus-fill' />}
                              size='large'
                              color='error'
                              onClick={() => setNoteSec(false)}
                              // onClick={() => notesUpdate()}
                            >
                              {t('Cancel')}
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant='contained'
                            startIcon={<Iconify icon='eva:plus-fill' />}
                            size='large'
                            color='success'
                            onClick={() => setNoteSec(true)}
                            // onClick={() => notesUpdate()}
                          >
                            {t('Add New Note')}
                          </Button>
                        )}
                      </Grid>

                      <Grid item xs={12}>
                        <TableContainer component={Paper}>
                          <Table
                            sx={{ minWidth: 650 }}
                            aria-label='simple table'
                          >
                            <TableHead>
                              <TableRow>
                                <TableCell>Note Title</TableCell>
                                <TableCell>Added By</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {JSON.parse(parcelDetailsD.notes).map((item) => {
                                return (
                                  <TableRow
                                    sx={{
                                      '&:last-child td, &:last-child th': {
                                        border: 0,
                                      },
                                    }}
                                  >
                                    <TableCell component='th' scope='row'>
                                      {item.msg}
                                    </TableCell>
                                    <TableCell>{item.addedBy}</TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Grid>
                    </Grid>

                    <Button
                      style={{
                        position: 'fixed',
                        width: '20vh',
                        height: '4vh',
                      }}
                      variant='contained'
                      color='error'
                      onClick={() => setMapSec('gisList')}
                    >
                      {t('Close')}
                    </Button>
                  </Box>
                </div>
              )}
            </div>
          ) : (
            <></>
          )}
        </Card>
        <Modal
          open={open}
          onClose={handleClose}
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            marginTop: '10%',
          }}
        >
          <Box sx={{ width: 400, bgcolor: 'background.paper', p: 2 }}>
            <MapboxGLComponent customCords={gpsCords} />
            <Button onClick={handleClose}>Close</Button>
          </Box>
        </Modal>
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby='modal-modal-title'
          aria-describedby='modal-modal-description'
        >
          <Box sx={style}>
            <Typography id='modal-modal-title' variant='h3' component='h2'>
              {editMode ? 'Delete Owner' : 'Add Owner'}
            </Typography>
            {!editMode ? (
              <>
                <Grid item xs={8} sm={6} my={2}>
                  <FormControl fullWidth>
                    <InputLabel id='Owner Role'>{t('Owner Role')}</InputLabel>
                    <Select
                      labelId='Owner Role'
                      id='Owner Role'
                      value={ownerRole}
                      onChange={(event) => {
                        setOwnerRole(event.target.value);
                        setSelectedUserss([]);
                      }}
                    >
                      {userRole?.map((item) => {
                        return (
                          <MenuItem value={item.role}>{item.role}</MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={8} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id='initiator-role2'>
                      {t('all Owners')}
                    </InputLabel>
                    <Select
                      labelId='initiator-role2'
                      id='initiator-role2'
                      multiple
                      value={selectedUserss}
                      onChange={handleSelectChange}
                      renderValue={(selected) => selected.join(', ')}
                    >
                      {userList?.map((item) => (
                        <MenuItem key={item.value} value={item.value}>
                          <Checkbox
                            checked={selectedUserss.includes(item.value)}
                          />
                          {item.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </>
            ) : (
              <ReactSelect
                isMulti
                isClearable
                isSearchable={false}
                value={allOwners}
                // isDisabled
                onChange={handleChange}
                // components={{
                //   MultiValueRemove: ({ innerProps }) => (
                //     <span
                //       {...innerProps}
                //       onClick={() => {
                //         console.log("Handle Remove Called: ", innerProps.data);
                //         handleRemove(innerProps.data);
                //       }}
                //     >
                //       &times;
                //     </span>
                //   ),
                // }}
              />
            )}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                mt: 2,
              }}
            >
              <Button
                variant='contained'
                size='medium'
                onClick={() => {
                  handleCloseModal();
                }}
              >
                Cancel
              </Button>
              <Button
                variant='contained'
                size='medium'
                color='error'
                onClick={() => handleAddOwner(editMode ? true : false)}
              >
                {isOwnerLoading ? (
                  <CircularProgress sx={{ color: 'white' }} size={22} />
                ) : (
                  'Save'
                )}
              </Button>
            </Box>
          </Box>
        </Modal>
      </Container>
    </>
  );
};

export default GisAdmin;
