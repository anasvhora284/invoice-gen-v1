import {
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputAdornment,
  Radio,
  RadioGroup,
  TextField,
  Typography,Box
} from "@mui/material";
// import "./HomePage.css";
import React, { useState, useEffect } from "react";
import { inWords } from "../../utils";
import { NumericFormat } from "react-number-format";
import appLogo from '../../assets/android/android-launchericon-48-48.png';

const HomePage = () => {
  // const [paymentMode, setPaymentMode] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [fullName, setFullName] = useState("");
  const [totalAmount, setTotalAmount] = useState(null);
  const [paymentMethod, setPaymentMethod] = React.useState("Cash");

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };
  // const [formData, setFormData] = useState({
  //   customerName: "",
  //   lillah: null,
  //   hadiya: null,
  //   donation: null,
  //   paymentType: "online",
  //   additionalFields: [],
  // });
  // const [showModal, setShowModal] = useState(false);
  // const [newPaymentType, setNewPaymentType] = useState("");

  useEffect(() => {
    // Update current date and time every second
    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);

  const handleRadioButton = (event) => {
    setPaymentMode(event.target.id);
    setFormData((prevData) => ({ ...prevData, paymentType: event.target.id }));
  };

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleAdditionalFieldChange = (index, value) => {
    const updatedAdditionalFields = [...formData.additionalFields];
    updatedAdditionalFields[index].amount = value;
    setFormData((prevData) => ({
      ...prevData,
      additionalFields: updatedAdditionalFields,
    }));
  };

  const handleSelectChange = (index, selectedValue) => {
    const updatedAdditionalFields = [...formData.additionalFields];
    updatedAdditionalFields[index].type = selectedValue;
    setFormData((prevData) => ({
      ...prevData,
      additionalFields: updatedAdditionalFields,
    }));
  };

  const handleAddPaymentType = () => {
    if (newPaymentType) {
      setFormData((prevData) => ({
        ...prevData,
        additionalFields: [
          ...prevData.additionalFields,
          { type: newPaymentType, amount: 0 },
        ],
      }));
      setNewPaymentType("");
      setShowModal(false);
    }
  };

  // const handlePrint = () => {
  //   const element = document.getElementById("pdf-container");

  //   // Configure html2pdf options
  //   const options = {
  //     margin: 10,
  //     filename: "document.pdf",
  //     image: { type: "jpeg", quality: 0.98 },
  //     html2canvas: { scale: 2 },
  //     jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  //   };

  //   // Generate PDF
  //   html2pdf().from(element).set(options).outputPdf();
  // };

  const handleFullNameChange = (event) => {
    setFullName(event.target.value);
  };

  const handleTotalAmountChange = (event) => {
    const newValue = event.target.value
      .replace(/,/g, "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    setTotalAmount(newValue);
  };

  console.log(fullName, totalAmount, "fullName");
  return (
    <div
      style={{
        maxWidth: "425px",
        margin: "auto",
        position: "relative",
        height: "100vh",
        fontFamily: "Montserrat",
        padding: "20px",
      }}
    >
      <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: "16px"}}><img src={appLogo} height="48px"/>   
      <Typography
        textAlign={"center"}
        sx={{
          paddingBlock: "20px",
          fontFamily: "Montserrat",
          fontWeight: "bold",
          fontSize: "28px",
          color: "#1f4373",
        }}
      >
        Invoice Generator
      </Typography>

           
        </Box>
      <Divider sx={{ borderColor: "#1f4373" }} />
      <Typography
        sx={{
          paddingBlock: "30px 20px",
          fontFamily: "Montserrat",
          fontWeight: "bold",
          fontSize: "20px",
          color: "#1f4373",
        }}
      >
        Basic Details
      </Typography>
      <TextField
        sx={{ width: "100%" }}
        label="Full Name"
        variant="standard"
        value={fullName}
        onChange={handleFullNameChange}
      />

      <NumericFormat
        label="Total Amount in INR"
        value={totalAmount}
        customInput={TextField}
        variant="standard"
        sx={{ width: "100%" }}
        allowNegative={false}
        thousandSeparator
        placeholder="0"
        onValueChange={({ value }) => setTotalAmount(Number(value))}
      />
      <FormLabel>Total Amount In words:</FormLabel>
      <Typography>{totalAmount ? inWords(totalAmount) : ""}</Typography>

      <FormControl>
        <FormLabel id="demo-form-control-label-placement">
          Payment Method
        </FormLabel>
        <RadioGroup
          row
          aria-labelledby="demo-form-control-label-placement"
          name="paymentMethod"
          value={paymentMethod}
          onChange={handlePaymentMethodChange}
        >
          <FormControlLabel
            value="Cash"
            control={<Radio />}
            label="Cash"
            labelPlacement="end"
          />

          <FormControlLabel value="Online" control={<Radio />} label="Online" />
        </RadioGroup>
      </FormControl>
      <Divider />
      <Typography>Amount Details</Typography>
      <Button
        variant="contained"
        sx={{
          textTransform: "none",
          position: "fixed",
          bottom: "0",
          left: "0",
        }}
      >
        Generate Invoice
      </Button>
    </div>

    // <div className="HomePageMainDiv">
    //   <div className="date">
    //     <span className="datePart">
    //       <label htmlFor="">Date:</label> {currentDate.toLocaleDateString()}
    //     </span>
    //     <span className="timePart">
    //       <label htmlFor="">Time:</label> {currentDate.toLocaleTimeString()}
    //     </span>
    //   </div>
    //   <div className="heading">
    //     <div className="headingText">
    //       <span>Customer Details</span>
    //     </div>
    //   </div>
    //   <div className="InvoiceForm">
    //     <div className="inputbox">
    //       <input
    //         required
    //         type="text"
    //         id="customernameinput"
    //         value={formData.customerName}
    //         onChange={(e) => handleInputChange("customerName", e.target.value)}
    //       />
    //       <span>Customer Name</span>
    //       <i></i>
    //     </div>
    //     <div className="inputbox">
    //       <input
    //         required
    //         type="number"
    //         id="lillah"
    //         value={formData.lillah}
    //         onChange={(e) => handleInputChange("lillah", e.target.value)}
    //       />
    //       <span>Lillah of Rs.</span>
    //       <i></i>
    //     </div>
    //     <div className="inputbox">
    //       <input
    //         required
    //         type="number"
    //         id="hadiya"
    //         value={formData.hadiya}
    //         onChange={(e) => handleInputChange("hadiya", e.target.value)}
    //       />
    //       <span>Hadiya of Rs.</span>
    //       <i></i>
    //     </div>
    //     <div className="inputbox">
    //       <input
    //         required
    //         type="number"
    //         id="donation"
    //         value={formData.donation}
    //         onChange={(e) => handleInputChange("donation", e.target.value)}
    //       />
    //       <span>Donation of Rs.</span>
    //       <i></i>
    //     </div>

    //     {/* Additional Payment Fields */}
    //     {formData.additionalFields.map((field, index) => (
    //       <div key={index} className="inputbox">
    //         <select
    //           value={field.type}
    //           onChange={(e) => handleSelectChange(index, e.target.value)}
    //         >
    //           <option value="charity">Charity</option>
    //           <option value="marriageFunds">Marriage Funds</option>
    //           <option value="helping">Helping</option>
    //           {/* Add more options as needed */}
    //         </select>
    //         <input
    //           required
    //           type="number"
    //           id={`additional-${index}`}
    //           value={field.amount}
    //           onChange={(e) =>
    //             handleAdditionalFieldChange(index, e.target.value)
    //           }
    //         />
    //         <span>{field.type} of Rs.</span>
    //         <i></i>
    //       </div>
    //     ))}

    //     {/* Add Payment Type Button */}
    //     <div className="addpaymentbtndiv">
    //       <label class="AddPaymentbtn" for="burger">
    //         <input
    //           type="checkbox"
    //           id="burger"
    //           onChange={() => setShowModal((prevShowModal) => !prevShowModal)}
    //         />
    //         <span></span>
    //         <span></span>
    //       </label>
    //     </div>

    //     {/* Modal for Adding Payment Type */}
    //     {showModal && (
    //       <div className="modal">
    //         <h2>Add Payment Type</h2>
    //         <div className="modal-content">
    //           <select
    //             value={newPaymentType}
    //             onChange={(e) => setNewPaymentType(e.target.value)}
    //           >
    //             <option value="charity">Charity</option>
    //             <option value="marriageFunds">Marriage Funds</option>
    //             <option value="helping">Helping</option>
    //             {/* Add more options as needed */}
    //           </select>
    //           <button onClick={handleAddPaymentType}>Add</button>
    //         </div>
    //       </div>
    //     )}

    //     <div className="paymentType">
    //       <label>
    //         <input
    //           name="online"
    //           type="radio"
    //           id="online"
    //           onChange={handleRadioButton}
    //           checked={paymentMode === "online"}
    //         />
    //         Online
    //       </label>
    //       <label>
    //         <input
    //           name="online"
    //           type="radio"
    //           id="cash"
    //           onChange={handleRadioButton}
    //           checked={paymentMode === "cash"}
    //         />
    //         Cash
    //       </label>
    //     </div>

    //     {/* Submit Button */}
    //     <button className="Submitbtn">
    //       <div className="svg-wrapper-1">
    //         <div className="svg-wrapper">
    //           <svg
    //             xmlns="http://www.w3.org/2000/svg"
    //             viewBox="0 0 24 24"
    //             width="24"
    //             height="24"
    //           >
    //             <path fill="none" d="M0 0h24v24H0z"></path>
    //             <path
    //               fill="currentColor"
    //               d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
    //             ></path>
    //           </svg>
    //         </div>
    //       </div>
    //       <span>Submit</span>
    //     </button>
    //   </div>
    // </div>
  );
};

export default HomePage;
