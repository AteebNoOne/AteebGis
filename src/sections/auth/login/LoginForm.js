import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';
import axios from 'axios';
// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();
  const [pass, setPass] = useState('');
  const [userN, setUserN] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const apiUrl = process.env.REACT_APP_BASE_URL;
  
  const handleClick = () => {
    if (userN === 'daniel@docgis.com' && pass === 'Daniel123@') {
      localStorage.setItem('loginnn', 'yes');
      navigate('/dashboard/app', { replace: true });
    } else {
      alert('Username or Password Incorrect');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/login`, {
        username: userN,
        password: pass,
      });
      await localStorage.setItem('adminInfo',JSON.stringify(response?.data?.user));
      await localStorage.setItem('loginnn', 'yes');
      navigate('/dashboard/app', { replace: true });
      setUserN('');
      setPass('');
      window.location.reload()
    } catch (error) {
      console.error(error);
      alert('Username or Password Incorrect');
    }
  };

  return (
    <>
      <Stack spacing={3}>
        <TextField name="email" label="Email address" onChange={(e) => setUserN(e.target.value)} />

        <TextField
          name="password"
          label="Password"
          onChange={(e) => setPass(e.target.value)}
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        {/* <Checkbox name="remember" label="Remember me" /> */}
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleSubmit}>
        Login
      </LoadingButton>
    </>
  );
}
