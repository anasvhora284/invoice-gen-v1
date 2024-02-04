import {
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  Box,
  Alert,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React, { useState, useEffect, useRef } from "react";
import { inWords } from "../../utils";
import { NumericFormat } from "react-number-format";
import appLogo from "../../assets/android/android-launchericon-512-512.png";
import styled from "@emotion/styled";
import { indigo } from "@mui/material/colors";
import InvoiceHtml from "../invoice/invoice";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import EsignModel from "../../components/eSignModel/eSignModel";
import LoadingButton from "@mui/lab/LoadingButton";

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
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [eSignModelOpen, setESignModelOpen] = useState(false);
  const [eSign, setEsign] = React.useState("");
  const [eSignError, setEsignError] = useState(false);
  const [generatorData, setGeneratorData] = useState({
    generatorName: "",
    generatorMobile: "",
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
    setAmountDetails({
      ...amountDetails,
      [amountFieldName]: valueObject?.value ? Number(valueObject.value) : null,
    });
  };

  const checkGeneratedInvoiceDisabled = () => {
    return !(
      fullName &&
      totalAmount &&
      amountDetailsError.notificationType === "success"
    );
  };

  const handleSubmitStep1 = () => {
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

    if (
      fullName &&
      totalAmount &&
      amountDetailsError.notificationType === "success"
    ) {
      setCurrentStep(2);
    }
  };

  useEffect(() => {
    const amountDetailsValues = Object.values(amountDetails);

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
    return x.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });
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
      return `${numberWithCommas(sum)}/-`;
    }
    return "--";
  };

  const receiptRef = useRef(null);
  const clearData = () => {
    setLoading(false);
    setESignModelOpen(false);
    setEsignError(false);
    setEsign("");
    setGeneratorData({
      generatorMobile: "",
      generatorName: "",
    });
    setFullName("");
    setTotalAmount(null);
    setPaymentMethod("Cash");
    setCurrentStep(1);
    setAmountDetails({
      subscriptionFee: null,
      groupWeddingFee: null,
      forCasteDinner: null,
      forHappyMarriage: null,
      councilFees: null,
      education: null,
      donation: null,
    });
  };
  const downloadPDF = () => {
    setLoading(true);
    const capture = receiptRef.current;

    html2canvas(capture, {
      scale: 3,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      pdf.addImage(canvas, "PNG", 15, 20, 175, 250);
      pdf.save(`${userData.fullName}.pdf`);
      clearData();
    });
  };

  const userData = {
    fullName,
    totalAmount,
    amountDetails,
    paymentMethod,
    currentDate,
  };

  function getTimestampWithMilliseconds() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const milliseconds = String(now.getMilliseconds()).padStart(3, "0");

    const Invoice_Id = `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;
    const timestamp = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;

    return { timestamp, Invoice_Id };
  }

  const handleSubmitEsign = async () => {
    const envData = import.meta.env.VITE_DATA;
    const parsedEnvdata = envData.split(",");
    const dataArrOfObj = [];

    for (let i = 0; i < parsedEnvdata.length; i += 3) {
      const obj = {
        name: parsedEnvdata[i].replaceAll("_", " "),
        mobile: parsedEnvdata[i + 1],
        key: parsedEnvdata[i + 2].replaceAll("_", " "),
      };
      dataArrOfObj.push(obj);
    }

    const invoiceGenerator = dataArrOfObj.find((data) => {
      return data.key === eSign;
    });

    if (invoiceGenerator) {
      setGeneratorData({
        generatorMobile: invoiceGenerator.mobile,
        generatorName: invoiceGenerator.name,
      });

      // Prepare data for submission
      const formData = {
        Invoice_Id: getTimestampWithMilliseconds().Invoice_Id.toString(), // Replace with a function to generate Invoice Id
        TimeStemp: getTimestampWithMilliseconds().timestamp.toString(),
        Full_Name: fullName,
        Mobile: generatorData.generatorMobile, // Assuming you want to use the generator's mobile
        City: "Surat", // You may add more fields if needed
        Total_Amount: totalAmount.toString(),
        Payment_Method: paymentMethod,
        Subscription_Fee: amountDetails.subscriptionFee?.toString() || "",
        Group_Wedding_Fee: amountDetails.groupWeddingFee?.toString() || "",
        For_Caste_Dinner: amountDetails.forCasteDinner?.toString() || "",
        For_Happy_Marriage: amountDetails.forHappyMarriage?.toString() || "",
        Council_Fees: amountDetails.councilFees?.toString() || "",
        Education: amountDetails.education?.toString() || "",
        Donation: amountDetails.donation?.toString() || "",
        Other: "Other_Field", // You may add more fields if needed
        Generated_By: generatorData.generatorName,
      };

      try {
        const response = await fetch(
          "https://script.google.com/macros/s/AKfycbxcRBD2PtG93ELUtZmO6F9HnflbOf8iE1kf2dD7bt_IE5iDN1i6anB5UA-CnXUqPYVbVQ/exec",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              // Add authorization header if required
              Authorization:
                "Bearer AKfycbxcRBD2PtG93ELUtZmO6F9HnflbOf8iE1kf2dD7bt_IE5iDN1i6anB5UA-CnXUqPYVbVQ",
            },
            body: formData,
          }
        );

        if (response.ok) {
          console.log("Data sent successfully to Google Sheets!");
        } else {
          console.error(
            "Error sending data to Google Sheets:",
            response.statusText
          );
          // Optionally, you can handle errors here
        }
      } catch (error) {
        console.error("Error:", error);
        // Optionally, you can handle errors here
      }

      setTimeout(() => {
        downloadPDF();
      }, 500);
    } else {
      setGeneratorData({
        generatorMobile: "",
        generatorName: "",
      });
      setEsignError(true);
    }
  };

  return (
    <>
      <div
        style={{
          maxWidth: "425px",
          margin: "auto",
          position: "relative",
          fontFamily: "Montserrat",
          paddingInline: "20px",
          background: "white",
          overflow: "clip",
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
        {currentStep === 1 ? (
          <>
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
                sx={{
                  paddingBlock: "0px 20px",
                  position: "relative",
                  left: "5px",
                }}
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
                        <Radio
                          checkedIcon={<BpCheckedIcon />}
                          icon={<BpIcon />}
                        />
                      }
                      label="Cash"
                      labelPlacement="end"
                    />

                    <FormControlLabel
                      value="Online"
                      control={
                        <Radio
                          checkedIcon={<BpCheckedIcon />}
                          icon={<BpIcon />}
                        />
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
                marginBottom: "90px",
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
                position: "fixed",
                bottom: "0",
                background: "white",
                zIndex: "5",
                boxShadow: "0 -8px 6px -6px #e0e4e9",
                left: "0",
                width: "100%",
                paddingInline: "0",
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
                  width: "calc(100vw - 32px)",
                }}
                onClick={handleSubmitStep1}
              >
                submit
              </Button>
            </Box>
          </>
        ) : (
          <></>
        )}
        {currentStep === 2 ? (
          <div
            style={{
              maxWidth: "425px",
              margin: "auto",
              position: "relative",
              fontFamily: "Montserrat",
              background: "white",
              overflow: "clip",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <IconButton
                sx={{ backgroundColor: "#1f4373" }}
                onClick={() => {
                  setCurrentStep(1);
                }}
              >
                <ArrowBackIcon sx={{ fill: "white" }} fontSize={"small"} />
              </IconButton>
              <Typography
                sx={{
                  paddingBlock: "20px",
                  fontFamily: "Montserrat",
                  fontWeight: "bold",
                  fontSize: "20px",
                  color: "#1f4373",
                }}
              >
                Invoice Summary
              </Typography>
            </Box>
            <Box sx={{ marginBottom: "16px" }}>
              <Typography
                sx={{
                  fontFamily: "Montserrat",
                  fontWeight: "bold",
                  fontSize: "16px",
                  color: "#333",
                  marginBottom: "5px",
                }}
              >
                Full Name:
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Montserrat",
                  fontWeight: "light",
                  fontSize: "16px",
                  color: "#333",
                }}
              >
                {fullName}
              </Typography>
            </Box>
            <Box sx={{ marginBottom: "16px" }}>
              <Typography
                sx={{
                  fontFamily: "Montserrat",
                  fontWeight: "bold",
                  fontSize: "16px",
                  color: "#333",
                  marginBottom: "5px",
                }}
              >
                Total amount:
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Montserrat",
                  fontWeight: "light",
                  fontSize: "16px",
                  color: "#333",
                }}
              >
                {`${numberWithCommas(totalAmount)}/-`}
              </Typography>
            </Box>
            <Box sx={{ marginBottom: "16px" }}>
              <Typography
                sx={{
                  fontFamily: "Montserrat",
                  fontWeight: "bold",
                  fontSize: "16px",
                  color: "#333",
                  marginBottom: "5px",
                }}
              >
                Payment method:
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Montserrat",
                  fontWeight: "light",
                  fontSize: "16px",
                  color: "#333",
                }}
              >
                {paymentMethod}
              </Typography>
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
              Amount Details:
            </Typography>

            <Box sx={{ paddingBottom: "70px" }}>
              {amountDetails.subscriptionFee ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "16px",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "Montserrat",
                      fontWeight: "bold",
                      fontSize: "16px",
                      color: "#333",
                      marginBottom: "5px",
                    }}
                  >
                    Subscription fee:
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Montserrat",
                      fontWeight: "light",
                      fontSize: "16px",
                      color: "#333",
                      marginBottom: "5px",
                    }}
                  >
                    {amountDetails.subscriptionFee
                      ? `${numberWithCommas(amountDetails.subscriptionFee)}/-`
                      : "--"}
                  </Typography>
                </Box>
              ) : (
                <></>
              )}
              {amountDetails.groupWeddingFee ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "16px",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "Montserrat",
                      fontWeight: "bold",
                      fontSize: "16px",
                      color: "#333",
                      marginBottom: "5px",
                    }}
                  >
                    Group wedding fee:
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Montserrat",
                      fontWeight: "light",
                      fontSize: "16px",
                      color: "#333",
                      marginBottom: "5px",
                    }}
                  >
                    {amountDetails.groupWeddingFee
                      ? `${numberWithCommas(amountDetails.groupWeddingFee)}/-`
                      : "--"}
                  </Typography>
                </Box>
              ) : (
                <></>
              )}
              {amountDetails.forCasteDinner ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "16px",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "Montserrat",
                      fontWeight: "bold",
                      fontSize: "16px",
                      color: "#333",
                      marginBottom: "5px",
                    }}
                  >
                    For caste-dinner:
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Montserrat",
                      fontWeight: "light",
                      fontSize: "16px",
                      color: "#333",
                      marginBottom: "5px",
                    }}
                  >
                    {amountDetails.forCasteDinner
                      ? `${numberWithCommas(amountDetails.forCasteDinner)}/-`
                      : "--"}
                  </Typography>
                </Box>
              ) : (
                <></>
              )}
              {amountDetails.forHappyMarriage ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "16px",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "Montserrat",
                      fontWeight: "bold",
                      fontSize: "16px",
                      color: "#333",
                      marginBottom: "5px",
                    }}
                  >
                    For happy marriage:
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Montserrat",
                      fontWeight: "light",
                      fontSize: "16px",
                      color: "#333",
                      marginBottom: "5px",
                    }}
                  >
                    {amountDetails.forHappyMarriage
                      ? `${numberWithCommas(amountDetails.forHappyMarriage)}/-`
                      : "--"}
                  </Typography>
                </Box>
              ) : (
                <></>
              )}
              {amountDetails.councilFees ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "16px",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "Montserrat",
                      fontWeight: "bold",
                      fontSize: "16px",
                      color: "#333",
                      marginBottom: "5px",
                    }}
                  >
                    Council fees:
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Montserrat",
                      fontWeight: "light",
                      fontSize: "16px",
                      color: "#333",
                      marginBottom: "5px",
                    }}
                  >
                    {" "}
                    {amountDetails.councilFees
                      ? `${numberWithCommas(amountDetails.councilFees)}/-`
                      : "--"}
                  </Typography>
                </Box>
              ) : (
                <></>
              )}
              {amountDetails.education ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "16px",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "Montserrat",
                      fontWeight: "bold",
                      fontSize: "16px",
                      color: "#333",
                      marginBottom: "5px",
                    }}
                  >
                    Education:
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Montserrat",
                      fontWeight: "light",
                      fontSize: "16px",
                      color: "#333",
                      marginBottom: "5px",
                    }}
                  >
                    {amountDetails.education
                      ? `${numberWithCommas(amountDetails.education)}/-`
                      : "--"}
                  </Typography>
                </Box>
              ) : (
                <></>
              )}
              {amountDetails.donation ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "16px",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "Montserrat",
                      fontWeight: "bold",
                      fontSize: "16px",
                      color: "#333",
                      marginBottom: "5px",
                    }}
                  >
                    Donation:
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Montserrat",
                      fontWeight: "light",
                      fontSize: "16px",
                      color: "#333",
                      marginBottom: "5px",
                    }}
                  >
                    {amountDetails.donation
                      ? `${numberWithCommas(amountDetails.donation)}/-`
                      : "--"}
                  </Typography>
                </Box>
              ) : (
                <></>
              )}
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "16px",
                color: "#1f4373",
                position: "fixed",
                bottom: "0",
                background: "white",
                zIndex: "5",
                boxShadow: "0 -8px 6px -6px #e0e4e9",
                left: "0",
                width: "100%",
                paddingInline: "0",
              }}
            >
              <LoadingButton
                variant="contained"
                size="small"
                sx={{
                  fontFamily: "Montserrat",
                  fontWeight: "bold",
                  fontSize: "16px",
                  textTransform: "none",
                  width: "calc(100vw - 32px)",
                }}
                onClick={() => {
                  setESignModelOpen(true);
                }}
              >
                Proceed
              </LoadingButton>
            </Box>
            <EsignModel
              open={eSignModelOpen}
              setOpen={setESignModelOpen}
              handleSubmit={handleSubmitEsign}
              setEsignError={setEsignError}
              eSignError={eSignError}
              eSign={eSign}
              setEsign={setEsign}
              loading={loading}
            />
          </div>
        ) : (
          <></>
        )}
        <div
          ref={receiptRef}
          style={{
            width: "512px",
            margin: "auto",
            position: "absolute",
            paddingInline: "20px",
            zIndex: "-10",
            top: "0",
          }}
        >
          <InvoiceHtml userData={userData} generatorData={generatorData} />
        </div>
      </div>
    </>
  );
};

export default HomePage;
