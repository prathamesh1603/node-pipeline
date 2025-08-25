export class Deal {
  constructor({
    _id = null,
    firstName = "",
    lastName = "",
    email = "",
    leadSource = "",
    description = "",
    currentStatus = {
      name: "",
      color: "",
      id: null,
    },
    mobile = "",
    probability = "",
    productCategory = "",
    productInterested = {
      name: "",
      id: null,
      _id: "",
    },
    ofCompany = "",
    assignedTo = "",
    mannualForm = true,
    textMessageAboutActivity = "",
  } = {}) {
    this._id = _id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.leadSource = leadSource;
    this.description = description;
    this.currentStatus = currentStatus;
    this.mobile = mobile;
    this.probability = probability;
    this.productCategory = productCategory;
    this.productInterested = productInterested;
    this.ofCompany = ofCompany;
    this.assignedTo = assignedTo;
    this.mannualForm = mannualForm;
    this.textMessageAboutActivity = textMessageAboutActivity;
  }

  static fromApiResponse(data) {
    return new Deal({
      _id: data._id,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      leadSource: data.leadSource,
      description: data.description,
      currentStatus: data.currentStatus,
      mobile: data.mobile,
      probability: data.probability,
      productCategory: data.productCategory,
      productInterested: data.productInterested,
      ofCompany: data.ofCompany,
      assignedTo: data.assignedTo,
      mannualForm: data.mannualForm,
      textMessageAboutActivity: data.textMessageAboutActivity,
    });
  }
}
