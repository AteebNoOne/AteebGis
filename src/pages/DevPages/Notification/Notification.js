import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Card,
  CardMedia,
  CardActions,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import classes from "./Notification.module.css";
import { PhotoCamera } from "@mui/icons-material";
import axios from "axios";

const Notification = () => {
  const { t } = useTranslation();
  const [expandImage, setExpandImage] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [scheduleMessage, setScheduleMessage] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedImage, setSelectedImage] = useState(null);
  const [image, setImage] = useState(null);
  const [devices, setDevices] = useState([]);

  const handleImageToggle = () => {
    setExpandImage(!expandImage);
  };

  const handleScheduleToggle = () => {
    setScheduleMessage(!scheduleMessage);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleImageChange = (event) => {
    const selectedFile = event.target.files[0];
    setImage(selectedFile);
    setSelectedImage(URL.createObjectURL(selectedFile));
  };

  const getDeviceIds = async () => {
    const response = await fetch(
      "https://test.node.docgis.com/ateeb/get-devices",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("THIS IS RESPONSE", response)

    const result = await response.json();
    console.log("Device API get:", result.devices);
    if (result.devices.length > 0) {
      const data = result.devices.map((value) => value.device_id);
      setDevices(data);
    }
  };

  useEffect(() => {
    getDeviceIds();
  }, []);

  // Example of sending a notification to a specific device
  async function sendNotificationToDevice() {
    if (title.trim().length > 0 && description.trim().length > 0) {
      let imageUrl = "";
      if (selectedImage) {
        const formData = new FormData();
        formData.append("files", image);
        formData.append("type", "parcel");
        // formData.append("category", parcel);

        try {
          const response = await axios.post(
            "https://test.node.docgis.com/upload",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          // Handle the response after successful upload
          console.log("Image uplaod", response.data);
          imageUrl = response.data.downloadLinks[0].replace(
            "http://",
            "https://"
          );
          // You can use the response to retrieve the download link or other information
        } catch (error) {
          // Handle error
          console.error(error);
        }
      }
      const notificationData = {
        title: title,
        body: description,
        image: imageUrl,
      };

      if (scheduleMessage) {
        const scheduleTimestamp = new Date(selectedDate).getTime();
        const now = Date.now();

        if (scheduleTimestamp > now) {
          const sendTimeISO = new Date(scheduleTimestamp).toISOString(); // Convert selected date to ISO format
          notificationData["send_time"] = sendTimeISO;
        } else {
          alert("Scheduled time should be in the future.");
          return;
        }
      }
      const response = await fetch("https://fcm.googleapis.com/fcm/send", {
        method: "POST",
        headers: {
          Authorization:
            "Bearer AAAARs1F85k:APA91bHGibphXDKJ-jmvdPa_DxTxPAhq-uK4Ixm6qOj9aKpgzV7Wbo15V7Ipyxuc9cqoBTI1GcYt0lNDQ0S4H4prcPItzh3M0YTAPc2HZkNiyWFb1w6RW6HzOR3vvrJ2lEr9oJt-yNh7",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: "/topics/all",
          notification: notificationData,
          android: {
            notification: {
              image: imageUrl,
            },
          },
          apns: {
            payload: {
              aps: {
                "mutable-content": 1,
              },
            },
            fcm_options: {
              image: imageUrl,
            },
          },
          webpush: {
            headers: {
              image: imageUrl,
            },
          },
        }),
      });

      const result = await response.json();
      console.log("Notification sent:", result);
      if (result.message_id) {
        alert("Notification sent successfully");
        setTitle("");
        setDescription("");
        setSelectedImage(null);
        setImage(null);
      }
    }
  }

  return (
    <>
      <Helmet>
        <title> Notification</title>
      </Helmet>
      <Typography variant="h4" gutterBottom mx={2}>
        {/* {t("Notification")} */}
      </Typography>
      <Grid container spacing={3} my={2}>
        <Grid item xs={12} md={6} lg={6} xl={6}>
          <Card
            sx={{
              borderTopLeftRadius: "92px",
              borderTopRightRadius: "92px",
              position: "relative",
              width: "fit-content",
            }}
          >
            <>
              <Box
                className={
                  expandImage
                    ? classes.notificationBoxExpanded
                    : classes.notificationBox
                }
              >
                <Box
                  className={
                    expandImage
                      ? classes.notificationDetailsExpanded
                      : classes.notificationDetails
                  }
                >
                  <Box
                    className={
                      expandImage
                        ? classes.notificationTitleExpanded
                        : classes.notificationTitle
                    }
                  >
                    {title.length > 0 ? title : "Test Title"}
                  </Box>
                  <Box
                    className={
                      expandImage
                        ? classes.notificationDescriptionExpanded
                        : classes.notificationDescription
                    }
                  >
                    {description.length > 0
                      ? description
                      : "Test description..."}
                  </Box>
                </Box>
                <Box
                  className={
                    expandImage
                      ? classes.notificationImageExpanded
                      : classes.notificationImage
                  }
                >
                  <img
                    src={
                      selectedImage
                        ? selectedImage
                        : "https://www.gstatic.com/mobilesdk/190408_mobilesdk/landscape_image_placeholder.png"
                    }
                    alt="notification"
                  />
                </Box>
              </Box>
              <img
                alt="screen"
                height={expandImage ? 520 : 285}
                src={
                  expandImage
                    ? "https://www.gstatic.com/mobilesdk/190409_mobilesdk/long_android.png"
                    : "https://www.gstatic.com/mobilesdk/190403_mobilesdk/android.png"
                }
              />
            </>
            <CardActions>
              <Button onClick={handleImageToggle}>
                {expandImage ? "Collapse View" : "Expand Collapse"}
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={6} xl={6}>
          <Typography variant="h6">Create Notification</Typography>
          <Box my={2}>
            <TextField
              label="Title"
              fullWidth
              value={title}
              placeholder="Enter title"
              onChange={(e) => setTitle(e.target.value)}
            />
          </Box>
          <Box my={2}>
            <TextField
              label="Description"
              multiline
              placeholder="Enter description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
            />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="label"
            >
              <input
                hidden
                accept="image/*"
                type="file"
                onChange={handleImageChange}
              />
              <PhotoCamera />
              <Box
                component={"span"}
                sx={{ fontSize: "14px", marginLeft: "5px" }}
              >
                add picture
              </Box>
            </IconButton>
            {/* {selectedImage && (
              <CardMedia
              component="img"
              alt="Selected"
              height={200}
              image={selectedImage}
              />
            )} */}
            {/* <FormControlLabel
              control={
                <Checkbox
                  checked={scheduleMessage}
                  onChange={handleScheduleToggle}
                />
              }
              label="Schedule Message"
            /> */}
          </Box>
          {scheduleMessage && (
            <>
              <Box my={2}>
                <TextField
                  type="datetime-local"
                  label="Scheduled Date and Time"
                  value={selectedDate}
                  onChange={handleDateChange}
                  fullWidth
                />
              </Box>
            </>
          )}
          <Button
            fullWidth
            size="large"
            variant="contained"
            color="primary"
            sx={{ display: "block", my: "20px" }}
            onClick={sendNotificationToDevice}
          >
            Send Notification
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default Notification;
