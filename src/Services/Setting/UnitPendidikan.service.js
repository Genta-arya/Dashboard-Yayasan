import axiosInstance from "../AxiosInstance";

export const handleUnitPendidikan = async (data) => {
  try {
    const response = await axiosInstance.post("/setting/unitpendidikan", {
      ...data,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUnitPendidikan = async () => {
  try {
    const response = await axiosInstance.get("/setting/unitpendidikan");
    return response.data;
  } catch (error) {
    throw error;
  }
};
