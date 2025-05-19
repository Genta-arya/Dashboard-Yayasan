import axiosInstance from "../AxiosInstance";

export const HandleSlider = async (data) => {
  try {
    const response = await axiosInstance.post("/setting/slider", {
      ...data,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const getSlider = async () => {
  try {
    const response = await axiosInstance.get("/setting/slider");
    return response.data;
  } catch (error) {
    throw error;
  }
};