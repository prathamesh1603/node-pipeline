/**
 * Company Model
 * Represents the structure of a Company object in the application.
 */
export class Company {
  constructor({
    _id = null,
    name = "",
    code = "",
    logo = "",
    email = "",
    website = "",
    rating = null,
    currentTag = "",
    tags = [],
    industry = "",
    address = {
      street: "",
      city: "",
      state: "",
      zipcode: "",
    },
    socialProfiles = ["", "", "", "", "", ""],
    mobile = "",
    ozonetelcampaignName = [],
    departmentName = "",
    departments = [],
    ozonetelUsername = "",
    ozonetelApiKey = "",
    status = "active",
  } = {}) {
    this._id = _id;
    this.name = name;
    this.code = code;
    this.logo = logo;
    this.email = email;
    this.website = website;
    this.rating = rating;
    this.currentTag = currentTag;
    this.tags = tags;
    this.industry = industry;
    this.address = address;
    this.socialProfiles = socialProfiles;
    this.mobile = mobile;
    this.status = status;
    this.ozonetelUsername = ozonetelUsername;
    this.ozonetelApiKey = ozonetelApiKey;
    this.ozonetelcampaignName = ozonetelcampaignName;
    this.departmentName = departmentName;
    this.departments = departments;
  }

  /**
   * Static method to create a new Company instance from a plain object.
   * @param {Object} data - Plain object with Company properties.
   * @returns {Company} New Company instance.
   */
  static fromApiResponse(data) {
    return new Company({
      _id: data._id,
      name: data.name,
      code: data.code,
      logo: data.logo,
      email: data.email,
      website: data.website,
      rating: data.rating,
      currentTag: data.currentTag,
      tags: data.tags,
      industry: data.industry,
      address: data.address,
      socialProfiles: data.socialProfiles,
      mobile: data.mobile,
      status: data.status,
      ozonetelcampaignName: data.ozonetelcampaignName,
      ozonetelUsername: data.ozonetelUsername,
      ozonetelApiKey: data.ozonetelApiKey,
      departmentName: data.departmentName,
      departments: data.departments,
    });
  }
}
