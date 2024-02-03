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
  Alert,
} from "@mui/material";
// import "./HomePage.css";
import React, { useState, useEffect } from "react";
import { inWords } from "../../utils";
import { NumericFormat } from "react-number-format";
import appLogo from "../../assets/android/android-launchericon-512-512.png";
import styled from "@emotion/styled";
import { indigo } from "@mui/material/colors";

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
  const [fullNameError, setFullNameError] = useState(false);
  const [totalAmountError, setTotalAmountError] = useState(false);
  const [amountDetailsError, setAmountDetailsError] = useState({
    notificationType: "",
    message: "",
  });

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
    if (event.target.value) {
      setFullNameError(false);
    } else {
      setFullNameError(true);
    }
  };

  const handleTotalAmountChange = ({ value }) => {
    if (value) {
      setTotalAmount(Number(value));
      setTotalAmountError(false);
    } else {
      setTotalAmount(value);
      setTotalAmountError(true);
    }
  };

  const handleAmountDetailsChange = (amountFieldName, valueObject) => {
    console.log(valueObject, "value");
    setAmountDetails({
      ...amountDetails,
      [amountFieldName]: valueObject?.value ? Number(valueObject.value) : null,
    });
  };

  console.log(fullName, totalAmount, paymentMethod, amountDetails, "fullName");

  const checkGeneratedInvoiceDisabled = () => {
    return !(
      fullName &&
      totalAmount &&
      amountDetailsError.notificationType === "success"
    );
  };

  const handleGenerateInvoice = () => {
    if (!fullName) {
      setFullNameError(true);
    }
    if (!totalAmount) {
      setTotalAmountError(true);
    }
    if (totalAmount && !Object.values(amountDetails).some(Boolean)) {
      setAmountDetailsError({
        notificationType: "error",
        message: "please fill up atleast one amount Detail",
      });
    }
  };

  useEffect(() => {
    const amountDetailsValues = Object.values(amountDetails);

    console.log(amountDetailsValues.some(Boolean), "amountDetailsValues");

    if (totalAmount && !amountDetailsValues.some(Boolean)) {
      setAmountDetailsError({
        notificationType: "error",
        message: "please fill up atleast one amount Detail",
      });
      return;
    } else {
      setAmountDetailsError({
        notificationType: "",
        message: "",
      });
    }

    const sum = amountDetailsValues.reduce((accumulator, currentValue) => {
      if (currentValue !== null) {
        accumulator += currentValue;
      }
      return accumulator;
    }, 0);

    if (totalAmount) {
      if (sum === totalAmount) {
        setAmountDetailsError({
          notificationType: "success",
          message: "Amount details verified.",
        });
      } else {
        setAmountDetailsError({
          notificationType: "error",
          message: "please varify total amount and amount details.",
        });
      }
    }
  }, [amountDetails, totalAmount]);

  function numberWithCommas(x) {
    return x.toLocaleString("en-IN");
  }

  const getAmountDetailsCalculation = () => {
    const amountDetailsValues = Object.values(amountDetails);
    const sum = amountDetailsValues.reduce((accumulator, currentValue) => {
      if (currentValue !== null) {
        accumulator += currentValue;
      }
      return accumulator;
    }, 0);
    if (sum) {
      return `₹ ${numberWithCommas(sum)}/-`;
    }
    return "--";
  };

  return (
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
          error={fullNameError}
          helperText={fullNameError ? "Full Name is required" : ""}
        />

        <NumericFormat
          label="Total Amount"
          value={totalAmount}
          customInput={TextField}
          variant="standard"
          sx={{ width: "100%" }}
          allowNegative={false}
          thousandSeparator
          thousandsGroupStyle="lakh"
          onValueChange={handleTotalAmountChange}
          inputProps={{ inputMode: "numeric" }}
          error={totalAmountError}
          helperText={totalAmountError ? "Total Amount is required" : ""}
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
          thousandsGroupStyle="lakh"
          onValueChange={(value) => {
            handleAmountDetailsChange("subscriptionFee", value);
          }}
          inputProps={{ inputMode: "numeric" }}
        />
        <NumericFormat
          label="Group wedding fee"
          value={amountDetails.groupWeddingFee}
          customInput={TextField}
          variant="standard"
          sx={{ width: "100%" }}
          allowNegative={false}
          thousandSeparator
          thousandsGroupStyle="lakh"
          onValueChange={(value) => {
            handleAmountDetailsChange("groupWeddingFee", value);
          }}
          inputProps={{ inputMode: "numeric" }}
        />
        <NumericFormat
          label="For caste-dinner"
          value={amountDetails.forCasteDinner}
          customInput={TextField}
          variant="standard"
          sx={{ width: "100%" }}
          allowNegative={false}
          thousandSeparator
          thousandsGroupStyle="lakh"
          onValueChange={(value) => {
            handleAmountDetailsChange("forCasteDinner", value);
          }}
          inputProps={{ inputMode: "numeric" }}
        />
        <NumericFormat
          label="For happy marriage"
          value={amountDetails.forHappyMarriage}
          customInput={TextField}
          variant="standard"
          sx={{ width: "100%" }}
          allowNegative={false}
          thousandSeparator
          thousandsGroupStyle="lakh"
          onValueChange={(value) => {
            handleAmountDetailsChange("forHappyMarriage", value);
          }}
          inputProps={{ inputMode: "numeric" }}
        />
        <NumericFormat
          label="Council fees"
          value={amountDetails.councilFees}
          customInput={TextField}
          variant="standard"
          sx={{ width: "100%" }}
          allowNegative={false}
          thousandSeparator
          thousandsGroupStyle="lakh"
          onValueChange={(value) => {
            handleAmountDetailsChange("councilFees", value);
          }}
          inputProps={{ inputMode: "numeric" }}
        />
        <NumericFormat
          label="Education"
          value={amountDetails.education}
          customInput={TextField}
          variant="standard"
          sx={{ width: "100%" }}
          allowNegative={false}
          thousandSeparator
          thousandsGroupStyle="lakh"
          onValueChange={(value) => {
            handleAmountDetailsChange("education", value);
          }}
          inputProps={{ inputMode: "numeric" }}
        />
        <NumericFormat
          label="Donation"
          value={amountDetails.donation}
          customInput={TextField}
          variant="standard"
          sx={{ width: "100%" }}
          allowNegative={false}
          thousandSeparator
          thousandsGroupStyle="lakh"
          onValueChange={(value) => {
            handleAmountDetailsChange("donation", value);
          }}
          inputProps={{ inputMode: "numeric" }}
        />
        <Box sx={{ paddingBlock: "16px 0" }}>
          <FormLabel>Amount details calculation:</FormLabel>
          <Typography
            sx={{
              paddingBlock: "5px 0",
              fontFamily: "Montserrat",
              fontWeight: "bold",
              fontSize: "16px",
              color: indigo[800],
            }}
          >
            {getAmountDetailsCalculation()}
          </Typography>
        </Box>
        {amountDetailsError.notificationType && (
          <Alert severity={amountDetailsError.notificationType}>
            {amountDetailsError.notificationType
              ? amountDetailsError.message
              : ""}
          </Alert>
        )}
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
          disabled={checkGeneratedInvoiceDisabled()}
          sx={{
            fontFamily: "Montserrat",
            fontWeight: "bold",
            fontSize: "16px",
            textTransform: "none",
          }}
          onClick={handleGenerateInvoice}
        >
          Generate Invoice
        </Button>
      </Box>
    </div>
  );
};

export default HomePage;
