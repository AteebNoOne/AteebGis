import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { FormControlLabel, Radio, Button, ImageList, ImageListItem, IconButton } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import CloseIcon from '@mui/icons-material/Close';

const DynamicForm = ({ formName }) => {
  const [formData, setFormData] = useState({});
  const [formDetails, setFormDetails] = useState({});
  const apiUrl = process.env.REACT_APP_BASE_URL;
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageSelect = (event) => {
    const file = event.target.files[0];

    console.log(file)
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        setSelectedImage(e.target.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleImageClear = () => {
    setSelectedImage(null);
  };

  const handleSubmitForm = () => {
    console.log("Clicked")
  };

  useEffect(() => {
    fetch(`${apiUrl}/tables/${formName}`)
      .then((response) => response.json(
      ))
      .then((data) => {
        console.log("DATA : ",data)
        const columns = data.columns.reduce((acc, columnInfo) => {
          acc[columnInfo.column] = {
            dataType: columnInfo.dataType,
          };
          return acc;
        }, {});
        setFormData(columns);
      });

    fetch(`${apiUrl}/formdetails?name=${formName}`)
      .then((response) => response.json())
      .then((data) => {
        setFormDetails(data.formDetails);
      });
  }, [formName]);


  const renderFormFields = () => {
    if (!formDetails.inputs) return null;
  
    const inputs = JSON.parse(formDetails.inputs);
    const selectValues = JSON.parse(formDetails.select_vlaues);
  
    return (
      <div>
        {inputs.map((input) => {
          const columnName = input.name;
          const columnInfo = formData[columnName];
          const isTextInput = input.type === 'INPUT_TEXT';
          const isNumberInput = input.type === 'INPUT_NUMBER';
          const isSelectList = input.type === 'SELECT_LIST';
          const isDateInput = input.type === 'INPUT_DATE';
          const isRadioButton = input.type === 'RADIO_BUTTON';
          const isSelectImage = input.type === 'SELECT_IMAGE';
  
          return (
            <FormControl key={columnName} fullWidth margin="normal">
            {isTextInput && (
              <TextField
                fullWidth
                label={columnName}
                required={input.isRequired}
                variant="outlined"
                type={columnInfo.dataType.includes('varchar') ? 'text' : 'number'}
              />
            )}
            {isNumberInput && (
              <TextField
                fullWidth
                label={columnName}
                required={input.isRequired}
                variant="outlined"
                type={columnInfo.dataType.includes('varchar') ? 'text' : 'number'}
              />
            )}
            {isSelectList && (
              <Select
                fullWidth
                label={columnName}
                required={input.isRequired}
                variant="outlined"
              >
                {selectValues.find((item) => item.name === columnName)?.options.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            )}
            {isDateInput && (
              <TextField
                fullWidth
                label={columnName}
                required={input.isRequired}
                variant="outlined"
                type="date" // Use 'date' type for date input
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
            {isRadioButton && (
              <div>
                {selectValues.find((item) => item.name === columnName)?.options.map((option) => (
                  <FormControlLabel
                    key={option}
                    control={<Radio />}
                    label={option}
                  />
                ))}
              </div>
            )}
            {isSelectImage && (
              <div>
                <div>
                  <InputLabel>{columnName}</InputLabel>
                </div>
                <input type="file" accept="image/*" onChange={handleImageSelect} />
                {selectedImage && (
                  <div>
                    <ImageList cols={1} rowHeight={10}>
                      <ImageListItem>
                        <img src={selectedImage} alt="Selected" width={100} height={100} />
                      </ImageListItem>
                    </ImageList>
                    <IconButton onClick={handleImageClear}>
                      <CloseIcon />
                    </IconButton>
                  </div>
                )}
              </div>
            )}
          </FormControl>
          );
        })}
        <Button
          variant="contained"
          onClick={handleSubmitForm}
        >
          Submit
        </Button>
      </div>
    );
  };
  
  return (
    <div>
      {renderFormFields()}
    </div>
  );
};

export default DynamicForm;
