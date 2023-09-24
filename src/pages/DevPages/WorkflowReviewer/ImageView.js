import React, { useState } from "react";
import { Modal, Button, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

const ImageViewComponent = ({ imageUrl }) => {
  const [open, setOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleZoomIn = () => {
    setZoomLevel((prevZoomLevel) => prevZoomLevel + 0.1);
  };

  const handleZoomOut = () => {
    setZoomLevel((prevZoomLevel) => Math.max(0.1, prevZoomLevel - 0.1));
  };

  const modalStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const contentStyle = {
    backgroundColor: "white",
    maxWidth: "500px",
    maxHeight: "500px",
    overflow: "auto",
    transform: `scale(${zoomLevel})`,
    transition: "transform 0.2s ease-in-out",
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        View Image
      </Button>
      <Modal open={open} onClose={handleClose} style={modalStyle}>
        <div style={contentStyle}>
          <Button
            onClick={handleClose}
            style={{ position: "absolute", top: "10px", right: "10px" }}
          >
            <CloseIcon />
          </Button>
          <img src={imageUrl} alt="Image" style={{ maxWidth: "100%" }} />
          <div>
            <Button onClick={handleZoomIn}>
              <AddCircleIcon />
              Zoom In
            </Button>
            <Button onClick={handleZoomOut}>
              <RemoveCircleIcon />
              Zoom Out
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ImageViewComponent;
