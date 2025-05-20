import axiosInstance from "../AxiosInstance";

export const handleSambutan = async (data) => {
  try {
    const response = await axiosInstance.post("/setting/sambutan", {
      ...data,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSambutan = async () => {
  try {
    const response = await axiosInstance.get("/setting/sambutan");
    return response.data;
  } catch (error) {
    throw error;
  }
};
