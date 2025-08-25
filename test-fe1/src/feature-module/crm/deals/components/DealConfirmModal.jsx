import React, { useState } from "react";
import { Box, Button, Modal, Typography } from "@mui/material";

const DealConfirmModal = ({ open, onClose, onConfirm, selectedStage }) => {
  const isCloseWon = selectedStage?.dealWon || false;

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="confirm-modal-title"
      aria-describedby="confirm-modal-description"
      closeAfterTransition
      BackdropProps={{
        style: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "25%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 550,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography id="confirm-modal-title" variant="h6" component="h2" mb={2}>
          Confirm Stage Conversion
        </Typography>
        <Typography id="confirm-modal-description" variant="body1" mb={3}>
          Are you sure you want to move this deal to the{" "}
          <strong className="text-capitalize">{selectedStage?.name}</strong>{" "}
          stage? This action will convert the deal into a{" "}
          <strong>{isCloseWon ? "Close Won" : "Close Lost"}</strong> deal and
          cannot be undone.
        </Typography>
        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="outlined" color="inherit" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color={isCloseWon ? "success" : "error"}
            onClick={onConfirm}
          >
            {isCloseWon ? "Confirm Won" : "Confirm Lost"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DealConfirmModal;
