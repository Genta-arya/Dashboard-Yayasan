import axiosInstance from "../AxiosInstance";

export const HandleGallery = async (data) => {
  try {
    const response = await axiosInstance.post("/setting/gallery", {
      ...data,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const getGallery = async () => {
  try {
    const response = await axiosInstance.get("/setting/gallery");
    return response.data;
  } catch (error) {
    throw error;
  }
};