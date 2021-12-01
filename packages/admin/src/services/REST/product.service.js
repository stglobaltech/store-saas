import API from "./api";

const uploadProductImge = (data) =>
  API.post(`/v1/api/product/image-upload`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

export { uploadProductImge };