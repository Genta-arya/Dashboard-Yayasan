import axiosInstance from "../AxiosInstance";

export const SpmbService = async (data) => {
  try {
    const response = await axiosInstance.post("/spmb", {
      ...data,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const GetSpmb = async (data) => {
  try {
   const response = await axiosInstance.get("/spmb/" + data);
    return response.data;
  } catch (error) {
    throw error;
  }
};