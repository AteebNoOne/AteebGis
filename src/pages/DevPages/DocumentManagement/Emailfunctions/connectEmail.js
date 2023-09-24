import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import API_BASE_URL from '../apiConfig';
import styles from './CustomModal.module.css'

const CustomModal = ({ showModal, onClose, setEmailConnected }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [host, setHost] = useState('');
  const [error, setError] = useState('');
  const [connecting, setConnecting] = useState(false);

  const handleConnect = () => {
    if (!email || !password || !host) {
      setError('All fields are required!');
      return;
    }
    
    setConnecting(true); // Start connecting animation

    fetch(`${API_BASE_URL}connect-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        pass: password,
        host: host,
      }),
    })
      .then((response) => {
        // Handle response status codes
        if (!response.ok) {
          if (response.status === 500) {
            setError('Server Error. Contact developers.');
          } else if (response.status === 502) {
            setError('Wrong host, please check your host.');
          } else if (response.status === 400) {
            setError('Unknown error.');
          } else if (response.status === 401) {
            setError('Wrong email or password.');
          } else if (response.status === 408) {
            setError('Connection timed out. Cant resolve host.');
          }
          setConnecting(false); // Stop connecting animation
        }
        return response.json();
      })
      .then((data) => {
        if (data.message.includes('already')) {
          setError(data.message);
        }
        if (data.message.includes('Success')) {
          localStorage.setItem('connectedEmail', email);
          setEmailConnected(true);
          clear();
          onClose();
        }
        setConnecting(false); // Stop connecting animation
      })
      .catch((error) => {
        setConnecting(false); // Stop connecting animation
      });
  };

  function clear(){
    setEmail('');
    setPassword('');
    setHost('');
    setError('');
  }
  const handleClose = () => {
    clear();
    setConnecting(false);
    onClose();
  };

  useEffect(() => {
    if (showModal) {
      setError('');
    }
  }, [showModal]);

  return (
    <Modal open={showModal} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}
      >
        <h2>Connect email:</h2>
        {connecting ? (
          <div className={styles['connecting-text']}>Connecting...</div>
        ) : (
          error && <div className={styles['error-text']}>{error}</div>
        )}
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Password"
          variant="outlined"
          fullWidth
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Host"
          variant="outlined"
          fullWidth
          value={host}
          onChange={(e) => setHost(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" onClick={handleConnect} sx={{ mr: 2 }}>
          Connect
        </Button>
        <Button variant="contained" onClick={handleClose}>
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default CustomModal;
