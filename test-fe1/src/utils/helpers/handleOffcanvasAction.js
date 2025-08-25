import Offcanvas from "bootstrap/js/dist/offcanvas";

export const handleOffcanvasAction = (id, action) => {
  const offcanvasElement = document.getElementById(id);
  if (offcanvasElement) {
    const offcanvas =
      Offcanvas.getInstance(offcanvasElement) ||
      new Offcanvas(offcanvasElement);

    if (action === "show") {
      offcanvas.show();
    } else if (action === "hide") {
      offcanvas.hide();
      setTimeout(() => {
        // Force cleanup of backdrop if necessary
        document.querySelector(".offcanvas-backdrop")?.remove();
      }, 300); // Delay to match Bootstrap's offcanvas animation
    } else if (action === "dispose") {
      offcanvas.dispose();
      document.querySelector(".offcanvas-backdrop")?.remove(); // Cleanup backdrop
    }
  }
};

// handleOffcanvasAction("offcanvas_add", "hide");
