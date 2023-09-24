import React, { useEffect, useLayoutEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button, Card, Container, Stack, Typography, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar/Scrollbar';
import { useTranslation } from 'react-i18next';

const AddUser = () => {
  const navigate = useNavigate();
  const location = useLocation();
  console.log('location',location.state)
  const { t } = useTranslation();
  const [idE, setIdE] = useState(false);
  const [usernameE, setUsernameE] = useState(false);
  const [passE, setPassE] = useState(false);
  const [fNanmeE, setFNanmeE] = useState(false);
  const [lNameE, setLNameE] = useState(false);
  const [addE, setAddE] = useState(false);
  const [cityE, setCityE] = useState(false);
  const [countryE, setCountryE] = useState(false);
  const [roleE, setRoleE] = useState(false);
  const [allFdata, setAllFData] = useState({});
  const [inputFields, setInputFields] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
    const [isLoading, setIsLoading] = useState(false);
  const[isUpdate, setIsUpdate] = useState(false);
  const apiUrl = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    getRoles();
  }, []);

  const getRoles = async () => {
    try {
      const response = await axios.get(`${apiUrl}/roles`);
      const rolesData = response.data;
      setRoles(rolesData); // Set the roles in the state variable
    } catch (error) {
      console.error(error); // Handle any errors that occur
    }
  };

  const addInputField = () => {
    setInputFields([...inputFields, { value: '' }]);
  };

  const handleInputChange = (index, event) => {
    const values = [...inputFields];
    values[index].value = event.target.value;
    setInputFields(values);
  };

  useEffect(() => {
    const data = location?.state?.data;
    if(data){
      const dummyData =  {
      UserID: data?.u_id,
      Username: data?.Username,
      Password: data?.Password,
      Fname: data?.Fname,
      Lname: data?.Lname,
      Address: data?.Address,
      City: data?.City,
      Country: data?.Country,
      Role: data?.Role
  }
    setAllFData(dummyData);
    }
  }, []);

  const handleChange = (e) => {
    const key = e.target.name;
    const value = e.target.value;
    setAllFData({
      ...allFdata,
      [key]: value,
    });
    flagsTrue();
  };
  const validation = ()=>{
    if (!('UserID' in allFdata)) {
      // code to execute if ID.allFdata is an empty string
      alert('ID cannot be empty');
      setIdE(true);
      return false;
    }
    if (!/^\d{1,14}$/.test(allFdata?.UserID)) {
      // code to execute if ID.allFdata is not a number with a maximum of 14 characters
      alert('ID can only contains number with maximum limit of 14 characters');
      setIdE(true);
      return false;
    }
    if (!('Username' in allFdata) || allFdata?.Username?.trim() === '' || /\s/.test(allFdata.Username)) {
      // code to execute if allFdata.username is empty or contains spaces
      alert('Username cannot be empty & does not contain spaces');
      setUsernameE(true);
      return false;
    }
    if (!('Password' in allFdata) || allFdata?.Password.trim() === '' || /\s/.test(allFdata.Password)) {
      // code to execute if allFdata.username is empty or contains spaces
      alert('Password cannot be empty & does not contain spaces');
      setPassE(true);
      return false;
    }
    if (!('Fname' in allFdata) || allFdata.Fname.trim() === '') {
      // code to execute if allFdata.username is empty or contains spaces
      alert('First Name cannot be empty & does not contain spaces');
      setFNanmeE(true);
      return false;
    }
    if (!('Lname' in allFdata) || allFdata.Lname.trim() === '' ) {
      // code to execute if allFdata.username is empty or contains spaces
      alert('Last Name cannot be empty & does not contain spaces');
      setLNameE(true);
      return false;
    }
    if (!('Address' in allFdata) || allFdata.Address.trim() === '') {
      // code to execute if allFdata.username is empty or contains spaces
      alert('Address cannot be empty & does not contain spaces');
      setAddE(true);
      return false;
    }
    if (!('City' in allFdata) || allFdata.City.trim() === '' || /\s/.test(allFdata.City)) {
      // code to execute if allFdata.username is empty or contains spaces
      alert('City cannot be empty & does not contain spaces');
      setCityE(true);
      return false;
    }
    if (!('Country' in allFdata) || allFdata.Country.trim() === '' || /\s/.test(allFdata.Country)) {
      // code to execute if allFdata.username is empty or contains spaces
      alert('Country cannot be empty & does not contain spaces');
      setCountryE(true);
      return false;
    }
    return true;
  }
  const submitToDB = () => {
    const isValid = validation();
    if(isValid){
      setIsLoading(true);
      if(location?.state?.data){
      let dynamicfield = {};
        inputFields.map((item, index) => {
          dynamicfield = {
            ...dynamicfield,
            [`dynamic_field${index + 1}`]: item.value,
          };
        });
        const id = location?.state?.data?.id;
         axios.put(`${apiUrl}/users/${id}`,
          { ...allFdata, extra_field: dynamicfield }).then((res)=>{
            setIsLoading(false);
            navigate('/dashboard/user');
          }).catch((err)=>{
            console.error(err);
            setIsLoading(false);
            alert('Error',JSON.stringify(err?.message));
         })

      }else{
        let dynamicfield = {};
    
        inputFields.map((item, index) => {
          dynamicfield = {
            ...dynamicfield,
            [`dynamic_field${index + 1}`]: item.value,
          };
        });
        return axios
          .post(`${apiUrl}/users`, { ...allFdata, extra_field: dynamicfield })
          .then((res) => {
            console.log(res);
            navigate('/dashboard/user');
            // When Data is saved
          })
          .catch((e) => {
            console.log(e);
            alert('ERROR', JSON.stringify(e.message));
          });
        // alert('All Data Successfully Validated & are ready to be added in Database');  
      }
    }
  };

  const flagsTrue = () => {
    setIdE(false);
    setUsernameE(false);
    setPassE(false);
    setFNanmeE(false);
    setLNameE(false);
    setAddE(false);
    setCityE(false);
    setCountryE(false);
    setRoleE(false);
  };

  return (
    <>
      <Helmet>
        <title> Add User | DocGIS</title>
      </Helmet>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            {t('Add New User')}
          </Typography>
          <Button size='large' color='error' variant='contained' onClick={()=> navigate('/dashboard/user')} 
          sx={{ mr:'20px', width: "180px",height: "40px"}}>Cancle</Button>
        </Stack>
        <Card>
          <Scrollbar>
            <Box
              component="form"
              sx={{
                '& .MuiTextField-root': { m: 1, width: '100ch' },
              }}
              noValidate
              autoComplete="off"
            >
              <TextField
                onChange={handleChange}
                error={idE}
                value={allFdata?.UserID}
                required
                id="outlined-required"
                type="number"
                name="UserID"
                label={t('UserID')}
              />{' '}
              <br />
              <TextField
                onChange={handleChange}
                error={usernameE}
                value={allFdata?.Username}
                required
                id="outlined-required"
                name="Username"
                label={t('Username')}
              />{' '}
              <br />
              <TextField
                onChange={handleChange}
                value={allFdata?.Password}
                error={passE}
                required
                id="outlined-required"
                name="Password"
                label={t('Password')}
              />{' '}
              <br />
              <TextField
                onChange={handleChange}
                value={allFdata?.Fname}
                error={fNanmeE}
                required
                id="outlined-required"
                name="Fname"
                label={t('First Name')}
              />{' '}
              <br />
              <TextField
                onChange={handleChange}
                value={allFdata?.Lname}
                error={lNameE}
                required
                id="outlined-required"
                name="Lname"
                label={t('Last Name')}
              />{' '}
              <br />
              <TextField
                onChange={handleChange}
                value={allFdata?.Address}
                error={addE}
                required
                id="outlined-required"
                name="Address"
                label={t('Address')}
              />{' '}
              <br />
              <TextField
                onChange={handleChange}
                value={allFdata?.City}
                error={cityE}
                required
                id="outlined-required"
                name="City"
                label={t('City')}
              />{' '}
              <br />
              <TextField
                // onChange={handleChange}
                // error={cityE}
                // required
                id="outlined-required"
                name="County"
                label={t('County')}
              />{' '}
              <br />
              <TextField
                onChange={handleChange}
                value={allFdata?.Country}
                error={countryE}
                required
                id="outlined-required"
                name="Country"
                label={t('Country')}
              />{' '}
              <br />
              <FormControl style={{ width: '50%', marginLeft: '10px', marginBottom: '20px' }}>
                <InputLabel>{t("Select Role")}</InputLabel>
                <Select name={'Role'}  value={allFdata?.Role} onChange={handleChange}>
                  {roles.map((role) => (
                    <MenuItem key={role.id} value={role.role}>
                      {role.role}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <br />
              <div>
                {inputFields.map((inputField, index) => (
                  <TextField
                    key={index}
                    type="text"
                    placeholder={`${t('Dynamic Field')} ${index + 1}`}
                    value={inputField.value}
                    onChange={(event) => handleInputChange(index, event)}
                  />
                ))}
              </div>
              <br />
              <Button
                style={{
                  height: '50px',
                  margin: '10px',
                  marginBottom: '20px',
                  width: '50%',
                }}
                onClick={() => addInputField()}
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
              >
                {t('Add New Dynamic Feild')}
              </Button>
              <br />
              <div style={{width:'100%', display:'flex',justifyContent:'flex-end'}}>
              <Button
                style={{
                  height: '50px',
                  margin: '10px',
                  marginBottom: '20px',
                  width: '230px',
                  background: 'green',
                  marginRight:'20px'
                }}
                onClick={() => submitToDB()}
                variant="contained"
                // startIcon={<Iconify icon="eva:plus-fill" />}
              >
                {
                  isLoading ? (<CircularProgress color='success' size={18} />):(

                    location?.state?.data ? t('Update User') : t('Add User')
                  )
                }
              </Button>
              </div>
            </Box>
          </Scrollbar>
        </Card>
      </Container>
    </>
  );
};

export default AddUser;
