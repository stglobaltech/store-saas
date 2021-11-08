import API from "./api";

const GetBannerURL = async (data) => {
  return API.post(`/v1/api/discount/image-upload`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};

export { GetBannerURL };