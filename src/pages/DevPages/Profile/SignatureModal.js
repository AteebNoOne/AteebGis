import React, { useState } from 'react';
import { Modal, Button } from '@mui/material';
import CanvasDraw from 'react-canvas-draw';
import axios from 'axios'; 

const SignatureModal = ({ isOpen, onClose, onSave ,fetchUserData}) => {
  const [signature, setSignature] = useState(null);
  const [imageLink, setImageLink] = useState(null);
  const user = localStorage.getItem("adminInfo");
  const data = JSON.parse(user);

  const handleSave = async () => {
    if (signature) {
      const isConfirmed = window.confirm(
        "Are you sure you want to save your signature? This action cannot be undone or changed."
      );
  
      if (isConfirmed) {
        try {
          const signatureDataURL = signature.canvasContainer.children[1].toDataURL();
          const blob = await fetch(signatureDataURL).then((res) => res.blob());
  
          const formData = new FormData();
          formData.append('files', blob, 'sign.png');
          formData.append('type', 'signatures');
          formData.append('category', data?.username);
  
          console.log('Uploading file...');
  
          const response = await axios.post(
            'https://test.node.docgis.com/upload',
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          );
  
          console.log('Server Response:', response.data);
  
          const imageLink = response.data.downloadLinks[0];
          setImageLink(imageLink);

          const nextApiResponse = await axios.put(
            'https://test.node.docgis.com/ateeb/admins',
            {
              id: data?.id, 
              sign: imageLink, // Image link from the previous API response
            },
            {
              headers: {
                'Content-Type': 'application/json', // Add this header
              },
            }
          );
  
          console.log('Next API Response:', nextApiResponse.data);
          fetchUserData();
          localStorage.setItem("my_signature", imageLink);
          onClose();
        } catch (error) {
          console.error('Adding signature Error:', error);
        }
      }
    }
  };
  

  const handleReset = () => {
    if (signature) {
      signature.clear();
      setImageLink(null);
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="signature-modal"
      aria-describedby="signature-modal-description"
    >
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center', // Center content horizontally
        }}
      >
        <h2 id="signature-modal">Draw your signature</h2>
        <div
          style={{
            border: '2px solid black', // Add black border
            width: '200px', // Set a fixed width
            height: '200px', // Set a fixed height
            display: 'flex',
            justifyContent: 'center', // Center content vertically
          }}
        >
          <CanvasDraw
            ref={(canvasDraw) => setSignature(canvasDraw)}
            hideGrid
            canvasWidth={196} // Adjust canvas width to account for the border
            canvasHeight={196} // Adjust canvas height to account for the border
            brushRadius={2}
            lazyRadius={0}
          />
        </div>
        <div style={{ marginTop: '10px' }}>
        <Button
            style={{
              height: "50px",
              margin: "10px",
              marginBottom: "20px",
              width: "80px",
              background: "green",
              marginRight: "20px",
            }}
            onClick={handleSave}
            variant="contained"
          >
            Save
          </Button>
          <Button
            style={{
              height: "50px",
              margin: "10px",
              marginBottom: "20px",
              width: "80px",
              background: "orange",
              marginRight: "20px",
            }}
            onClick={handleReset}
            variant="contained"
          >
            Reset
          </Button>
          <Button
            style={{
              height: "50px",
              margin: "10px",
              marginBottom: "20px",
              width: "80px",
              background: "red",
              marginRight: "20px",
            }}
            onClick={onClose}
            variant="contained"
          >
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SignatureModal;
