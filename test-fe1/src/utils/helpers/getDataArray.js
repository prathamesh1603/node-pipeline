export const getRoleNameArr = (data) => {
  return data?.map((item) => ({
    value: item?._id,
    label: item?.name?.includes("-")
      ? item?.name
          ?.split("-")
          .join(" ")
          .replace(/\b\w/g, (char) => char?.toUpperCase())
      : item?.name?.charAt(0).toUpperCase() + item?.name?.slice(1),
    roleName: item?.name,
  }));
};

export const getCompanyNameArr = (data) => {
  return data?.map((item) => ({
    value: item?._id,
    label: item?.name.charAt(0).toUpperCase() + item?.name?.slice(1),
  }));
};

export const getProductCategoryAndNamesArr = (data) => {
  return data?.map((item) => ({
    categoryId: item?._id, // Category ID
    categoryName: formatName(item?.name), // Formatted Category Name
    products: item?.products?.map((product) => ({
      id: product?.id,
      _id: product?._id, // Product ID
      name: formatName(product?.name), // Formatted Product Name
    })),
  }));
};

// Utility function to format names (capitalize first letter or handle hyphens)
const formatName = (name) =>
  name?.includes("-")
    ? name
        ?.split("-")
        .join(" ")
        .replace(/\b\w/g, (char) => char.toUpperCase())
    : name?.charAt(0).toUpperCase() + name?.slice(1);
