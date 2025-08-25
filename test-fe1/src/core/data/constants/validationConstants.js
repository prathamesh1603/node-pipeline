import * as Yup from "yup";

// Reusable validation for email format (only accepts lowercase)
export const emailValidation = Yup.string()
  .email("Invalid email address")
  .matches(
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    "Email must follow the standard format (e.g., user@example.com)"
  )
  .test("has-at-and-dot", "Email must contain both '@' and '.'", (value) => {
    return value?.includes("@") && value?.includes(".");
  });

// Reusable validation for password format
export const passwordValidation = Yup.string().min(
  8,
  "Password must be at least 8 characters"
);

// Reusable Validations
export const requiredValidation = (fieldName) =>
  Yup.string().required(`${fieldName} is required.`);

export const mobileValidation = Yup.string()
  .matches(/^[0-9]+$/, "Mobile must contain only numbers.")
  .min(10, "Mobile number must be exactly 10 digits.")
  .max(10, "Mobile number must be exactly 10 digits.");

export const urlValidation = (fieldName) =>
  Yup.string().url(`Please enter a valid ${fieldName} URL.`);

export const fileValidation = Yup.mixed()
  .test(
    "fileFormat",
    "Unsupported file format. Only JPEG, PNG, and GIF are allowed.",
    (value) =>
      value && ["image/jpeg", "image/png", "image/gif"].includes(value.type)
  )
  .test(
    "fileSize",
    "File size must not exceed 800KB.",
    (value) => value && value.size <= 800 * 1024 // Max size 800KB
  );

export const statusValidation = Yup.string().oneOf(
  ["active", "inactive"],
  "Status must be either 'active' or 'inactive.'"
);

export const ratingValidation = Yup.number()
  .min(1, "Rating must be at least 1.")
  .max(5, "Rating cannot exceed 5.");

export const tagsValidation = Yup.array().of(Yup.string());

export const addressValidation = Yup.object({
  street: Yup.string(),
  city: Yup.string(),
  state: Yup.string(),
  zipcode: Yup.string(),
});

export const socialProfilesValidation = Yup.array()
  .of(Yup.string().url("Social profile must be a valid URL."))
  .nullable();

export const codeValidation = Yup.string().min(
  6,
  "Code must be at least 6 characters long."
);

export const roleValidation = Yup.string().test(
  "not-empty",
  "Role cannot be empty.",
  (value) => value?.trim().length > 0
);

export const companyValidation = Yup.string().test(
  "not-empty",
  "Company cannot be empty.",
  (value) => value?.trim().length > 0
);

export const addressValidation2 = Yup.string().min(
  20,
  "Address must be at least 20 characters long."
);

export const industryValidation = Yup.string();
export const currentTagValidation = Yup.string();
