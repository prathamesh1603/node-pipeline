export class Account {
  constructor({
    _id = null,
    firstName = "",
    lastName = "",
    email = "",
    productInterested = [
      {
        name: "",
        id: null,
        _id: "",
      },
    ],
    ofCompany = "",
  } = {}) {
    this._id = _id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.productInterested = productInterested;
    this.ofCompany = ofCompany;
  }

  static fromApiResponse(data) {
    return new Account({
      _id: data._id,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      productInterested: data.productInterested,
      ofCompany: data.ofCompany,
    });
  }
}
