/**
 * User Model
 * Represents the structure of a User object in the application.
 */
export class User {
  constructor({
    _id = null,
    firstName = "",
    lastName = "",
    // username = "",
    email = "",
    role = "",
    ofCompany = "",
    mobile = "",
    address = {
      street: "",
      city: "",
      state: "",
      zipcode: "",
    },
    status = "active",
    agentId = "",
    campaignName = "",
    employeeCode = "",
  } = {}) {
    this._id = _id;
    this.firstName = firstName;
    this.lastName = lastName;
    // this.username = username;
    this.email = email;
    this.role = role;
    this.ofCompany = ofCompany;
    this.mobile = mobile;
    this.address = address;
    this.status = status;
    this.agentId = agentId;
    this.campaignName = campaignName;
    this.employeeCode = employeeCode;
  }

  /**
   * Static method to create a new User instance from a plain object.
   * @param {Object} data - Plain object with User properties.
   * @returns {User} New User instance.
   */
  static fromApiResponse(data) {
    return new User({
      _id: data._id,
      firstName: data.firstName,
      lastName: data.lastName,
      // username: data.username,
      email: data.email,
      role: data.role,
      ofCompany: data.ofCompany,
      mobile: data.mobile,
      address: data.address,
      status: data.status,
      agentId: data.agentId,
      campaignName: data.campaignName,
      employeeCode: data.employeeCode,
    });
  }
}
