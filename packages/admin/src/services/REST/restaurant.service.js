// Omitted
import API from './api';

const uploadFile = (data) =>
  API.post(`/v1/api/store/image-upload`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

export { uploadFile };
