export class Product {
  constructor({
    _id = null,
    name = "",
    ofCompany = "",
    productName = "",
    products = [],
  } = {}) {
    this._id = _id;
    this.name = name;
    this.ofCompany = ofCompany;
    this.productName = productName;
    this.products = products;
  }

  static fromApiResponse(data) {
    return new Product({
      _id: data._id,
      name: data.name,
      ofCompany: data.ofCompany,
      productName: data.productName,
      products: data.products,
    });
  }
}
