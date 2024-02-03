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
  Typography,
  Box,
} from "@mui/material";
// import "./HomePage.css";
import React, { useState, useEffect, useRef } from "react";
import { inWords } from "../../utils";
import { NumericFormat } from "react-number-format";
import appLogo from "../../assets/android/android-launchericon-512-512.png";
import styled from "@emotion/styled";
import { indigo } from "@mui/material/colors";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import InvoiceHtml from "../invoice/invoice.jsx";

const BpIcon = styled("span")(({ theme }) => ({
  borderRadius: "50%",
  width: 20,
  height: 20,
  border: `2px solid ${theme.palette.primary.main}`,
  backgroundColor: "#fff",
}));

const BpCheckedIcon = styled(BpIcon)(({ theme }) => ({
  border: `2px solid ${theme.palette.primary.main}`,
  "&:before": {
    content: '""',
    display: "block",
    width: 12,
    height: 12,
    background: theme.palette.primary.main,
    borderRadius: "16px",
    position: "absolute",
    top: "15px",
    left: "15px",
  },
}));

const HomePage = () => {
  // const [paymentMode, setPaymentMode] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [fullName, setFullName] = useState("");
  const [totalAmount, setTotalAmount] = useState(null);
  const [paymentMethod, setPaymentMethod] = React.useState("Cash");
  const [amountDetails, setAmountDetails] = React.useState({
    subscriptionFee: null,
    groupWeddingFee: null,
    forCasteDinner: null,
    forHappyMarriage: null,
    councilFees: null,
    education: null,
    donation: null,
  });

  const [loader, setLoader] = useState(false);
  const receiptRef = useRef(null);

  const downloadPDF = () => {
    const capture = receiptRef.current;
    setLoader(true);
    // html2canvas(capture).then((canvas) => {
    //   const imgData = canvas.toDataURL("img/jpeg");
    //   const doc = new jsPDF("p", "mm", "a4");
    //   const componentWidth = doc.internal.pageSize.getWidth();
    //   const componentHeight = doc.internal.pageSize.getHeight();
    //   doc.addImage(canvas, "JPEG", 0, 0);
    //   setLoader(false);
    //   doc.save("receipt.pdf");
    //   center: true;
    // });

    html2canvas(capture, {
      scale: 4,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      pdf.addImage(canvas, "PNG", 15, 0, 175, 250);
      pdf.save("centered-document.pdf");
    });
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  useEffect(() => {
    // Update current date and time every second
    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);

  const handleFullNameChange = (event) => {
    setFullName(event.target.value);
  };
  const handleAmountDetailsChange = (amountFieldName, value) => {
    setAmountDetails({
      ...amountDetails,
      [amountFieldName]: value ? Number(value) : null,
    });
  };

  console.log(fullName, totalAmount, paymentMethod, amountDetails, "fullName");

  return (
    <>
      <div
        style={{
          maxWidth: "425px",
          margin: "auto",
          position: "relative",
          fontFamily: "Montserrat",
          paddingInline: "20px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
            color: "#1f4373",
            position: "sticky",
            top: "0",
            background: "white",
            zIndex: "5",
            boxShadow: "0 8px 6px -6px #e0e4e9",
          }}
        >
          <img src={appLogo} height="48px" />
          <Typography
            textAlign={"center"}
            sx={{
              paddingBlock: "20px",
              fontFamily: "Montserrat",
              fontWeight: "bold",
              fontSize: "28px",
              "@media (max-width: 368px)": {
                fontSize: "22px",
              },
            }}
          >
            Invoice Generator
          </Typography>
        </Box>
        {/* <Divider sx={{ borderColor: "#1f4373" }} /> */}
        <Typography
          sx={{
            paddingBlock: "40px 10px",
            fontFamily: "Montserrat",
            fontWeight: "bold",
            fontSize: "20px",
            color: "#1f4373",
          }}
        >
          Basic Details
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <TextField
            sx={{ width: "100%" }}
            label="Full Name"
            variant="standard"
            value={fullName}
            onChange={handleFullNameChange}
          />

          <NumericFormat
            label="Total Amount"
            value={totalAmount}
            customInput={TextField}
            variant="standard"
            sx={{ width: "100%" }}
            allowNegative={false}
            thousandSeparator
            onValueChange={({ value }) =>
              value ? setTotalAmount(Number(value)) : setTotalAmount(value)
            }
          />
          <Box sx={{ paddingBlock: "16px 0" }}>
            <FormLabel>Total Amount In words:</FormLabel>
            <Typography
              sx={{
                paddingBlock: "5px 0",
                fontFamily: "Montserrat",
                fontWeight: "bold",
                fontSize: "16px",
                color: indigo[800],
              }}
            >
              {totalAmount ? inWords(totalAmount) : " --"}
            </Typography>
          </Box>
          <Box
            sx={{ paddingBlock: "0px 20px", position: "relative", left: "5px" }}
          >
            <FormControl>
              <FormLabel
                sx={{ paddingBlock: "16px 5px" }}
                id="demo-form-control-label-placement"
              >
                Payment Method
              </FormLabel>
              <RadioGroup
                row
                sx={{ gap: "16px" }}
                aria-labelledby="demo-form-control-label-placement"
                name="paymentMethod"
                value={paymentMethod}
                onChange={handlePaymentMethodChange}
              >
                <FormControlLabel
                  value="Cash"
                  control={
                    <Radio checkedIcon={<BpCheckedIcon />} icon={<BpIcon />} />
                  }
                  label="Cash"
                  labelPlacement="end"
                />

                <FormControlLabel
                  value="Online"
                  control={
                    <Radio checkedIcon={<BpCheckedIcon />} icon={<BpIcon />} />
                  }
                  label="Online"
                />
              </RadioGroup>
            </FormControl>
          </Box>
        </Box>
        <Divider sx={{ borderColor: "#1f4373" }} />
        <Typography
          sx={{
            paddingBlock: "20px",
            fontFamily: "Montserrat",
            fontWeight: "bold",
            fontSize: "20px",
            color: "#1f4373",
          }}
        >
          Amount Details
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            marginBottom: "40px",
          }}
        >
          <NumericFormat
            label="Subscription fee"
            value={amountDetails.subscriptionFee}
            customInput={TextField}
            variant="standard"
            sx={{ width: "100%" }}
            allowNegative={false}
            thousandSeparator
            onValueChange={(value) => {
              handleAmountDetailsChange("subscriptionFee", value);
            }}
          />
          <NumericFormat
            label="Group wedding fee"
            value={amountDetails.groupWeddingFee}
            customInput={TextField}
            variant="standard"
            sx={{ width: "100%" }}
            allowNegative={false}
            thousandSeparator
            onValueChange={(value) => {
              handleAmountDetailsChange("groupWeddingFee", value);
            }}
          />
          <NumericFormat
            label="For caste-dinner"
            value={amountDetails.forCasteDinner}
            customInput={TextField}
            variant="standard"
            sx={{ width: "100%" }}
            allowNegative={false}
            thousandSeparator
            onValueChange={(value) => {
              handleAmountDetailsChange("forCasteDinner", value);
            }}
          />
          <NumericFormat
            label="For happy marriage"
            value={amountDetails.forHappyMarriage}
            customInput={TextField}
            variant="standard"
            sx={{ width: "100%" }}
            allowNegative={false}
            thousandSeparator
            onValueChange={(value) => {
              handleAmountDetailsChange("forHappyMarriage", value);
            }}
          />
          <NumericFormat
            label="Council fees"
            value={amountDetails.councilFees}
            customInput={TextField}
            variant="standard"
            sx={{ width: "100%" }}
            allowNegative={false}
            thousandSeparator
            onValueChange={(value) => {
              handleAmountDetailsChange("councilFees", value);
            }}
          />
          <NumericFormat
            label="Education"
            value={amountDetails.education}
            customInput={TextField}
            variant="standard"
            sx={{ width: "100%" }}
            allowNegative={false}
            thousandSeparator
            onValueChange={(value) => {
              handleAmountDetailsChange("education", value);
            }}
          />
          <NumericFormat
            label="Donation"
            value={amountDetails.donation}
            customInput={TextField}
            variant="standard"
            sx={{ width: "100%" }}
            allowNegative={false}
            thousandSeparator
            onValueChange={(value) => {
              handleAmountDetailsChange("donation", value);
            }}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
            color: "#1f4373",
            position: "sticky",
            bottom: "0",
            background: "white",
            zIndex: "5",
            boxShadow: "0 -8px 6px -6px #e0e4e9",
          }}
        >
          <Button
            variant="contained"
            size="small"
            sx={{
              fontFamily: "Montserrat",
              fontWeight: "bold",
              fontSize: "16px",
              textTransform: "none",
            }}
            className="receipt-modal-download-button"
            onClick={downloadPDF}
          >
            {loader ? (
              <span>Downloading Invoice</span>
            ) : (
              <span>Generate Invoice</span>
            )}
          </Button>
        </Box>

        {/* <Button
          variant="contained"
          sx={{
            textTransform: "none",
            position: "fixed",
            bottom: "0",
          }}
        >
          Generate Invoice
        </Button> */}
      </div>

      <div
        ref={receiptRef}
        style={{
          width: "100%",
          maxWidth: "512px",
          margin: "auto",
          position: "relative",
          fontFamily: "Montserrat",
          paddingInline: "20px",
        }}
      >
        <InvoiceHtml />
      </div>
    </>

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
