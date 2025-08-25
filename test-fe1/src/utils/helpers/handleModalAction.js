import Modal from "bootstrap/js/dist/modal";

export const handleModalAction = (id, action) => {
  const modalElement = document.getElementById(id);

  if (modalElement) {
    const modal = Modal.getInstance(modalElement) || new Modal(modalElement);

    if (action === "show") {
      modal.show();
    } else if (action === "hide") {
      modal.hide();
      setTimeout(() => {
        // Force cleanup of backdrop if necessary
        document.querySelector(".modal-backdrop")?.remove();
      }, 300); // Delay to match Bootstrap's modal animation
    } else if (action === "dispose") {
      modal.dispose();
      document.querySelector(".modal-backdrop")?.remove(); // Cleanup backdrop
    }
  }
};

// handleModalAction("offcanvas_add", "hide");
