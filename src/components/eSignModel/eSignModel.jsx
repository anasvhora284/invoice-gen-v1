import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TextField } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const EsignModel = ({
  open,
  setOpen,
  setLoading,
  handleSubmit,
  setEsignError,
  eSignError,
  eSign,
  setEsign,
  loading,
}) => {
  const handleClose = () => {
    setOpen(false);
    setEsign("");
    setEsignError(false);
    setLoading(false);
  };

  const handleEsignChange = (event) => {
    setEsign(event.target.value);
    if (event.target.value) {
      setEsignError(false);
    } else {
      setEsignError(true);
    }
  };

  return (
    <>
      <React.Fragment>
        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{"E-Sign verification"}</DialogTitle>
          <DialogContent>
            <TextField
              sx={{ width: "100%" }}
              label="E-Sign"
              variant="standard"
              value={eSign}
              onChange={handleEsignChange}
              error={eSignError}
              helperText={
                eSignError
                  ? eSign
                    ? "Invalid E-sign. please react out to administrator"
                    : "E-Sign is required"
                  : ""
              }
            />
          </DialogContent>
          <DialogActions sx={{ padding: "20px" }}>
            <Button onClick={handleClose} sx={{ textTransform: "none" }}>
              cancel
            </Button>
            <LoadingButton
              variant="contained"
              sx={{ textTransform: "none" }}
              onClick={handleSubmit}
            >
              {loading ? "generating…" : "generate invoice"}
            </LoadingButton>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    </>
  );
};

export default EsignModel;
