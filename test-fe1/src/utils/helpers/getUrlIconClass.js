export const getUrlIconClass = (url) => {
  if (url?.includes("youtube")) return "fa-brands fa-youtube";
  if (url?.includes("facebook")) return "fa-brands fa-facebook-f";
  if (url?.includes("instagram")) return "fa-brands fa-instagram";
  if (url?.includes("whatsapp")) return "fa-brands fa-whatsapp";
  if (url?.includes("pinterest")) return "fa-brands fa-pinterest";
  if (url?.includes("linkedin")) return "fa-brands fa-linkedin";
  return null; // Default icon if no match is found
};
