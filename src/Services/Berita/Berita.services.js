import axiosInstance from "../AxiosInstance";

export const posting = async (data) => {
  try {
    const response = await axiosInstance.post("/berita/post", {
      ...data,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const EditBeritas = async (id, data) => {
  try {
    const response = await axiosInstance.put("/berita/edit/" + id, {
      ...data,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetBerita = async (data) => {
  try {
    const response = await axiosInstance.post("/berita/", {
      role: data,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DeleteBerita = async (data) => {
  try {
    const response = await axiosInstance.delete("/berita/" + data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateStatus = async (id, data) => {
  try {
    const response = await axiosInstance.put("/berita/arsip/" + id, {
        isArsip: data
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDetailBerita = async (id) => {
  try {
    const response = await axiosInstance.get("/berita/" + id);
    return response.data;
  } catch (error) {
    throw error;
  }
};