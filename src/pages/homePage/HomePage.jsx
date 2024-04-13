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
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment/moment";

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
  const [currentDate, setCurrentDate] = useState(null);
  const [fullName, setFullName] = useState("");
  const [paymentDetails, setPaymentDetails] = useState("");
  const [reprintInvoiceId, setReprintInvoiceId] = useState("");
  const [mobileNumber, setMobileNumber] = useState(null);
  const [city, setCity] = useState("");
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
    other: null,
  });
  const [fullNameError, setFullNameError] = useState(false);
  const [reprintInvoiceIdError, setReprintInvoiceIdError] = useState(false);
  const [mobileNumberError, setMobileNumberError] = useState(false);
  const [cityError, setCityError] = useState(false);
  const [totalAmountError, setTotalAmountError] = useState(false);
  const [amountDetailsError, setAmountDetailsError] = useState({
    notificationType: "",
    message: "",
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [printPage, setPrintPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [eSignModelOpen, setESignModelOpen] = useState(false);
  const [eSign, setEsign] = React.useState("");
  const [eSignError, setEsignError] = useState(false);
  const [generatorData, setGeneratorData] = useState({
    generatorName: "",
    generatorMobile: "",
  });
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [receivedDateFromAPI, setReceivedDateFromAPI] = useState("");

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const getInvoiceNumber = async () => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbyToJPZI43L7T7z12unbNphluY4U102egd3SGsKfaUsHhtTyI4QdpCdrKtc8JAGtZmvQQ/exec",
        requestOptions
      );

      if (response.ok) {
        const result = await response.text();
        setInvoiceNumber(result);
      } else {
        console.error("Failed to fetch invoice number:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching invoice number:", error);
    }
  };

  useEffect(() => {
    const fetchInvoiceNumber = async () => {
      await getInvoiceNumber();
    };

    fetchInvoiceNumber();
  }, []);

  const handleFullNameChange = (event) => {
    const fullNameInputText = event.target.value;
    const filteredText = fullNameInputText.replace(/[^a-zA-Z ]/g, "");
    setFullName(filteredText);
    if (filteredText) {
      setFullNameError(false);
    } else {
      setFullNameError(true);
    }
  };

  const handleMobileNumberChange = ({ value }) => {
    if (value.length === 10) {
      setMobileNumber(Number(value));
      setMobileNumberError(false);
    } else {
      setMobileNumber(value);
      setMobileNumberError(true);
    }
  };

  const handleCityChange = (event) => {
    const cityInputText = event.target.value;
    const filteredText = cityInputText.replace(/[^a-zA-Z ]/g, "");
    setCity(filteredText);
    if (filteredText) {
      setCityError(false);
    } else {
      setCityError(true);
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
    const maxValidDate = moment(currentDate);
    const isValidDate = maxValidDate.isValid() && maxValidDate.year() >= 2000 && !(currentDate.isSameOrAfter(moment()));

    return !(
      isValidDate &&
      fullName &&
      mobileNumber &&
      city &&
      !(mobileNumber.length > 10 || mobileNumber.length < 10) &&
      totalAmount &&
      amountDetailsError.notificationType === "success"
    );
  };

  const handleSubmitStep1 = () => {
    if (!fullName) {
      setFullNameError(true);
    }
    if (!mobileNumber) {
      setMobileNumberError(true);
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
      mobileNumber &&
      city &&
      totalAmount &&
      amountDetailsError.notificationType === "success"
    ) {
      setCurrentStep(2);
    }
  };

  const checkGenerateRePrint = () => {
    return reprintInvoiceIdError;
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
    if (x !== null && x !== undefined) {
      return x.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      });
    } else {
      return "--"; // or handle it in a way that makes sense for your application
    }
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
    setMobileNumber(null);
    setCity("");
    setTotalAmount(null);
    setPaymentMethod("Cash");
    setPaymentDetails("");
    setCurrentDate(null);
    setCurrentStep(1);
    setAmountDetails({
      subscriptionFee: null,
      groupWeddingFee: null,
      forCasteDinner: null,
      forHappyMarriage: null,
      councilFees: null,
      education: null,
      donation: null,
      other: null,
    });
    setReprintInvoiceId("");
    setPrintPage(false);
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
      pdf.addImage(canvas, "PNG", 30, 20, 150, 250);
      pdf.save(`${userData.fullName}.pdf`);
      clearData();
    });
  };

  const userData = {
    invoiceNumber: invoiceNumber,
    fullName,
    mobileNumber,
    city,
    totalAmount,
    amountDetails,
    paymentMethod,
    paymentDetails,
    currentDate: reprintInvoiceId ? receivedDateFromAPI : currentDate,
    generatorData: generatorData,
    reprintInvoiceId,
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
    getInvoiceNumber();
    setLoading(true);

    // Check if it's a reprint
    if (reprintInvoiceId) {
      setTimeout(() => {
        downloadPDF();
        setLoading(false);
      }, 500);
      return;
    } else {
      // Continue with the regular submission logic
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
          Invoice_Id: invoiceNumber, // Replace with a function to generate Invoice Id
          TimeStemp: currentDate ? currentDate.format("DD/MM/YYYY") : "",
          Full_Name: fullName,
          Mobile: mobileNumber, // Assuming you want to use the generator's mobile
          City: city, // You may add more fields if needed
          Total_Amount: totalAmount.toString(),
          Payment_Method: `${paymentMethod} ${paymentDetails}`,
          Subscription_Fee: amountDetails.subscriptionFee?.toString() || "",
          Group_Wedding_Fee: amountDetails.groupWeddingFee?.toString() || "",
          For_Caste_Dinner: amountDetails.forCasteDinner?.toString() || "",
          For_Happy_Marriage: amountDetails.forHappyMarriage?.toString() || "",
          Council_Fees: amountDetails.councilFees?.toString() || "",
          Education: amountDetails.education?.toString() || "",
          Donation: amountDetails.donation?.toString() || "",
          Other: amountDetails.other?.toString() || "",
          Generated_By_Name: invoiceGenerator.name.toString(),
          Generated_By_Mobile: invoiceGenerator.mobile.toString(),
        };

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "text/plain;charset=utf-8");

        var requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: JSON.stringify(formData),
          redirect: "follow",
        };
        try {
          const response = await fetch(
            "https://script.google.com/macros/s/AKfycbyToJPZI43L7T7z12unbNphluY4U102egd3SGsKfaUsHhtTyI4QdpCdrKtc8JAGtZmvQQ/exec",
            requestOptions
          )
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((error) => console.log("error", error));

          downloadPDF();
        } catch (error) {
          console.error("Error:", error);
        }
      } else {
        setGeneratorData({
          generatorMobile: "",
          generatorName: "",
        });
        setEsignError(true);
      }
    }
  };

  const handleReprint = () => {
    printPage
      ? (setPrintPage(false), clearData(), setReprintInvoiceIdError(false))
      : setPrintPage(true);
  };

  const fetchReprintData = async () => {
    try {
      const response = await fetch(
        `https://script.google.com/macros/s/AKfycbyToJPZI43L7T7z12unbNphluY4U102egd3SGsKfaUsHhtTyI4QdpCdrKtc8JAGtZmvQQ/exec?invoiceId=${reprintInvoiceId}`
      );
      if (response.ok) {
        const result = await response.json(); // Assuming the response is in JSON format
        setInvoiceNumber(result[0]);
        setReceivedDateFromAPI(result[1]);
        setFullName(result[2]);
        setMobileNumber(result[3]);
        setCity(result[4]);
        setTotalAmount(result[5]);
        setPaymentMethod(result[6]);

        setAmountDetails({
          subscriptionFee: result[7] ? Number(result[7]) : null,
          groupWeddingFee: result[8] ? Number(result[8]) : null,
          forCasteDinner: result[9] ? Number(result[9]) : null,
          forHappyMarriage: result[10] ? Number(result[10]) : null,
          councilFees: result[11] ? Number(result[11]) : null,
          education: result[12] ? Number(result[12]) : null,
          donation: result[13] ? Number(result[13]) : null,
          other: result[14] ? Number(result[14]) : null,
        });
        setGeneratorData({
          generatorName: result[15],
          generatorMobile: result[16],
        });

        // After setting the data, you can proceed to the next step or perform any other necessary actions
        setCurrentStep(2);
      } else {
        console.error("Failed to fetch reprint data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching reprint data:", error);
    }
  };

  const handleSubmitRePrint = () => {
    fetchReprintData();
    setCurrentStep(2);
  };

  const handleReprintInvoiceIdChange = (event) => {
    const fullNameInputText = event.target.value;
    const filteredText = fullNameInputText.replace(/[^A-Z0-9\/-]/g, "");
    if (filteredText.length === 14) {
      setReprintInvoiceIdError(false);
      setReprintInvoiceId(filteredText);
    } else {
      setReprintInvoiceId(filteredText);
      setReprintInvoiceIdError(true);
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
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: "0 -8px 6px -6px #e0e4e9",
              }}
            >
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

              <Button
                variant="contained"
                size="small"
                sx={{
                  fontFamily: "Montserrat",
                  fontWeight: "bold",
                  fontSize: "16px",
                  textTransform: "none",
                  margin: "30px 0px 0px 0px",
                }}
                onClick={handleReprint}
              >
                {printPage ? "Print Invoice" : "Re-Print Invoice"}
              </Button>
            </Box>
            {printPage ? (
              <>
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: "16px" }}
                >
                  <TextField
                    sx={{ width: "100%" }}
                    label="Invoice Id"
                    placeholder="IN-00001-23/24"
                    variant="standard"
                    value={reprintInvoiceId}
                    onChange={handleReprintInvoiceIdChange}
                    error={reprintInvoiceIdError}
                    helperText={
                      reprintInvoiceIdError && !reprintInvoiceId
                        ? "Invoice Id is required."
                        : reprintInvoiceIdError && reprintInvoiceId
                          ? "Enter valid Invoice Id."
                          : ""
                    }
                  />
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
                    disabled={checkGenerateRePrint()}
                    sx={{
                      fontFamily: "Montserrat",
                      fontWeight: "bold",
                      fontSize: "16px",
                      textTransform: "none",
                      width: "calc(100vw - 32px)",
                    }}
                    onClick={handleSubmitRePrint}
                  >
                    submit
                  </Button>
                </Box>
              </>
            ) : (
              <>
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: "16px" }}
                >
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      label="Date"
                      slotProps={{
                        textField: {
                          variant: 'standard'
                        },
                      }}
                      value={currentDate}
                      onChange={(newDate) => {
                        setCurrentDate(newDate);
                      }}
                      format="DD/MM/YYYY"
                      views={["year", "month", "day"]}
                      maxDate={moment()}
                    />
                  </LocalizationProvider>
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
                    label="Mobile Number"
                    value={mobileNumber}
                    customInput={TextField}
                    variant="standard"
                    sx={{ width: "100%" }}
                    allowNegative={false}
                    onValueChange={handleMobileNumberChange}
                    inputProps={{ inputMode: "numeric" }}
                    error={mobileNumberError}
                    helperText={
                      mobileNumberError && !mobileNumber
                        ? "Mobile Number is required"
                        : mobileNumberError && mobileNumber
                          ? "Mobile Number should be 10 digit long"
                          : ""
                    }
                  />

                  <TextField
                    sx={{ width: "100%" }}
                    label="City"
                    variant="standard"
                    value={city}
                    onChange={handleCityChange}
                    error={cityError}
                    helperText={cityError ? "City Name is required" : ""}
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
                    helperText={
                      totalAmountError ? "Total Amount is required" : ""
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

                        <FormControlLabel
                          value="Cheque"
                          control={
                            <Radio
                              checkedIcon={<BpCheckedIcon />}
                              icon={<BpIcon />}
                            />
                          }
                          label="Cheque"
                        />
                      </RadioGroup>
                    </FormControl>
                    {paymentMethod !== 'Cash' && <TextField
                      sx={{ width: "100%", marginBottom: "20px" }}
                      label="Payment Details"
                      variant="standard"
                      value={paymentDetails}
                      onChange={(event) => {
                        setPaymentDetails(event.target.value)
                      }}
                    />}
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
                    label="ઉમેદવારી ફી ના"
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
                    label="સમુહ લગ્ન ફી"
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
                    label="જમણવારના"
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
                    label="લગ્ન ખુશાલીના"
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
                    label="સભાસદ ફી"
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
                    label="એજ્યુકેશન"
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
                    label="ડોનેશન"
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
                  <NumericFormat
                    label="અન્ય"
                    value={amountDetails.other}
                    customInput={TextField}
                    variant="standard"
                    sx={{ width: "100%" }}
                    allowNegative={false}
                    thousandSeparator
                    thousandsGroupStyle="lakh"
                    onValueChange={(value) => {
                      handleAmountDetailsChange("other", value);
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
            )}
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
                sx={{
                  backgroundColor: "#1f4373", '&:hover': {
                    backgroundColor: "#1f4373"
                  }
                }}
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
                Date:
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Montserrat",
                  fontWeight: "light",
                  fontSize: "16px",
                  color: "#333",
                }}
              >
                {currentDate ? currentDate.format("DD MMM YYYY") : "--"}
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
                Mobile Number:
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Montserrat",
                  fontWeight: "light",
                  fontSize: "16px",
                  color: "#333",
                }}
              >
                {mobileNumber}
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
                City Name:
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Montserrat",
                  fontWeight: "light",
                  fontSize: "16px",
                  color: "#333",
                }}
              >
                {city}
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
                {paymentMethod} - {paymentDetails}
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
              {amountDetails.other ? (
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
                    Other:
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
                    {amountDetails.other
                      ? `${numberWithCommas(amountDetails.other)}/-`
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
              setLoading={setLoading}
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
            paddingInline: "20px",
            position: "absolute",
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
