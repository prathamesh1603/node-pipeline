// General Messages
export const REQUIRED_FIELD = "This field is required.";
export const VALID_EMAIL_MSG = "Please enter a valid email address.";
export const VALID_MOBILE_MSG = "Please enter a 10 digit mobile number.";
export const VALID_WEBSITE_URL_MSG = "Please enter a valid URL.";
export const VALID_STATUS_MSG = "Status must be 'active' or 'inactive'.";

// Validation Specific Messages
export const MIN_LENGTH_VALIDATION = ({ field, length = 6 }) => {
  return `${field} must be at least ${length} characters long.`;
};
export const RATING_MIN_MSG = "Rating must be at least 1.";
export const RATING_MAX_MSG = "Rating cannot exceed 5.";
export const MOBILE_NUMERIC_MSG = "Mobile must contain only numbers.";
export const UNSUPPORTED_FILE_FORMAT_MSG = "Unsupported file format.";
export const FILE_TOO_LARGE_MSG = "File size must not exceed 800KB.";
export const SOCIAL_PROFILE_URL_MSG = "Social profile must be a valid URL.";
export const ROLE_EMPTY_MSG = "Role cannot be empty.";
export const COMPANY_EMPTY_MSG = "Company cannot be empty.";
export const ADDRESS_MIN_LENGTH_MSG =
  "Address must be at least 20 characters long.";
export const PASSWORD_MIN_LENGTH_MSG =
  "Password must be at least 4 characters long.";
export const SELECT_PRODUCT_INTERESTED_MSG =
  "Product name is required (requires product category selection)";
export const SELECT_PRODUCT_CATEGORY_MSG =
  "Product category is required (requires company selection)";

// Success Messages
export const CREATED_SUCCESS_MSG = "Created Successfully!";
export const EDITED_SUCCESS_MSG = "Updated Successfully!";

// General Error Messages
export const ERROR_MSG = "Something went wrong. Please try again later.";
export const NETWORK_ERROR_MSG =
  "Network error. Please check your internet connection.";
export const UNAUTHORIZED_ERROR_MSG = "Unauthorized access. Please log in.";
export const FORBIDDEN_ERROR_MSG =
  "You do not have permission to perform this action.";
export const NOT_FOUND_ERROR_MSG = "The requested resource was not found.";
export const SERVER_ERROR_MSG =
  "Internal server error. Please try again later.";
export const VALIDATION_ERROR_MSG =
  "Validation error. Please check the entered data.";
export const TIMEOUT_ERROR_MSG = "The request timed out. Please try again.";
export const CONFLICT_ERROR_MSG =
  "Conflict detected. The action could not be completed.";
export const TOO_MANY_REQUESTS_MSG =
  "Too many requests. Please try again later.";
export const BAD_REQUEST_ERROR_MSG =
  "Invalid request. Please check your input.";

export const SUPER_ADMIN = "super-admin";
export const COMPANY_ADMIN = "company-admin";
export const CALLER = "caller";
