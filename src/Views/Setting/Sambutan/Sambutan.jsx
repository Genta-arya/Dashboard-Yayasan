import React, { useEffect, useState } from "react";
import {
  getSambutan,
  handleSambutan,
} from "@/Services/Setting/Sambutan.service";
import { uploadProfile } from "@/Services/Uploads/Uploads.services";
import Editor from "@/components/Editor";
import Navigation from "@/components/Navigation";
import { toast } from "sonner";
import Loading from "@/components/Loading";

const Sambutan = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFromApi, setImageFromApi] = useState(null);
  const [iconFile, setIconFile] = useState(null);
  const [konten, setKonten] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await getSambutan();
      setKonten(response.data.konten);
      setImageFromApi(response.data.url_Image); // <-- ambil gambar dari API
    } catch (error) {
      console.error("Gagal ambil data sambutan", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setIconFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

 const submit = async () => {
  try {
    setLoading(true);
    let iconUrl = imageFromApi;

    if (iconFile) {
      const form = new FormData();
      form.append("file", iconFile);

      const res = await uploadProfile(form);
      iconUrl = res.data.file_url;

      if (!iconUrl) throw new Error("Gagal upload ikon");
    }

    await handleSambutan({ url: iconUrl, konten });
    toast.success("Data berhasil disimpan.");
    fetchData();
  } catch (error) {
    console.error("Error upload:", error);
    toast.error("Gagal menyimpan data.");
  } finally {
    setLoading(false);
  }
};

if (loading) return <Loading />


  return (
    <>
      <Navigation text="Kata Pengantar" />
      <div className="p-6 mt-6 rounded-xl shadow-md bg-white">
        <label className="block text-green-700 font-medium mb-1">
          Upload Gambar
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-4 block w-full text-sm text-green-700
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-green-50 file:text-green-700
          hover:file:bg-green-100"
        />

        {(imagePreview || imageFromApi) && (
          <div className="mb-4 flex flex-col items-center">
            <p className="text-sm text-green-700 mb-1">Preview:</p>
            <img
              src={imagePreview || imageFromApi}
              alt="Preview"
              className="w-full object-cover rounded-lg border border-green-200"
            />
          </div>
        )}

        <label className="block text-green-700 font-medium mb-1">
          Konten Sambutan
        </label>
        <Editor setEditorContent={setKonten} editorContent={konten} />

        <button
          onClick={submit}
          disabled={loading}
          className={`w-full py-2 px-4 mt-5 rounded-lg text-white font-semibold transition-all ${
            loading
              ? "bg-green-300 cursor-not-allowed"
              : "bg-green-700 hover:bg-green-800"
          }`}
        >
          {loading ? "Uploading..." : "Simpan"}
        </button>
      </div>
    </>
  );
};

export default Sambutan;
