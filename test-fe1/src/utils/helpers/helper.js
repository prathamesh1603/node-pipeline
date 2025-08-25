export const isSuperAdmin = (user) => {
  return !user?.ofCompany ? true : false;
};

export const getFilteredKeys = (modelInstance) => {
  return Object.keys(modelInstance).filter(
    (key) =>
      key !== "_id" && // Exclude `_id`
      !Array.isArray(modelInstance[key]) && // Exclude arrays
      typeof modelInstance[key] !== "object" // Exclude objects
  );
};

export const getDateRange = () => {
  const today = new Date();

  // Calculate the date 7 days ago
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 7);

  // Return the date range as formatted strings
  return {
    startDate: sevenDaysAgo.toISOString().split("T")[0],
    endDate: today.toISOString().split("T")[0],
  };
};

export const capitalizeWord = (word) => {
  if (!word || typeof word !== "string") return "";
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
};

export const incrementDateByOne = (dateString) => {
  // Parse the input date string (YYYY-MM-DD)
  const [year, month, day] = dateString.split("-").map(Number);

  // Create a Date object
  const date = new Date(year, month - 1, day); // Months are zero-based in JavaScript

  // Increment the date by one day
  date.setDate(date.getDate() + 1);

  // Format the new date back to YYYY-MM-DD
  const newYear = date.getFullYear();
  const newMonth = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const newDay = String(date.getDate()).padStart(2, "0");

  return `${newYear}-${newMonth}-${newDay}`;
};

export const generateOrganizationCode = (organizationName) => {
  if (!organizationName || organizationName.trim().length < 2) {
    throw new Error("Organization name must have at least 2 characters.");
  }

  // Trim whitespace and ensure the name is valid
  const trimmedName = organizationName.trim();
  const firstChar = trimmedName[0].toUpperCase(); // First character
  const lastTwoChars = trimmedName.slice(-2).toUpperCase(); // Last two characters
  const randomDigits = Math.floor(100 + Math.random() * 900); // Random 3 digits

  return `${firstChar}${lastTwoChars}${randomDigits}`;
};

export const splitByUppercase = (text) => {
  if (!text) return "";
  return text.replace(/([A-Z])/g, " $1").trim();
};
