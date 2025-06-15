import axiosInstance from "../AxiosInstance";


export const handleProfile = async (data)  => {
  try {
    const response = await axiosInstance.post("/setting/profil", {
      ...data,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}


export const getProfile = async () => {
  try {
    const response = await axiosInstance.get("/setting/profil");
    return response.data;
  } catch (error) {
    throw error;
  }
}