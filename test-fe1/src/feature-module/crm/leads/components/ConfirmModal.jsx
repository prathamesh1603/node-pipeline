import React, { useState } from "react";
import { Box, Button, Modal, Typography } from "@mui/material";

const ConfirmModal = ({ open, onClose, onConfirm, selectedStage }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="confirm-modal-title"
      aria-describedby="confirm-modal-description"
      closeAfterTransition
      BackdropProps={{
        style: { backgroundColor: "rgba(0, 0, 0, 0.5)" }, // Customize backdrop color and opacity
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
          Are you sure you want to move this lead to the{" "}
          <strong className="text-capitalize">{selectedStage?.name}</strong>{" "}
          stage? This action will convert the lead into a deal, and it cannot be
          undone.
        </Typography>
        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="outlined" color="black" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={onConfirm}>
            Confirm
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ConfirmModal;
