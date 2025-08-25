import api from "../../../../utils/api";

const ProductApi = {
  // get all products
  async fetchProducts(params = {}) {
    const { queryKey, signal, ...restParams } = params;

    const response = await api.get("/product", { params: restParams, signal });

    return { data: response?.data };
  },

  // get Product by id
  async fetchProduct(params = {}) {
    const { productId, ...restParams } = params;
    const response = await api.get(`/product/${productId}`, {
      params: restParams,
    });
    return response?.data?.data;
  },

  // add a product
  async addProduct(productData) {
    const response = await api.post("/product", productData);
    return response?.data;
  },

  // update a product
  async updateproduct(id, productData) {
    const response = await api.patch(`/product/${id}`, productData);
    return response.data;
  },

  // fetchLeadsWithQuery for products dashboard
  async fetchProductsWithQuery(params = {}) {
    const { queryKey, signal, ...restParams } = params; // Ignore unwanted params
    const response = await api.get("/analytics/product", {
      params: restParams,
      signal,
    });
    return { data: response?.data };
  },
};

export default ProductApi;
