import Loading from "@/components/Loading";
import Navigation from "@/components/Navigation";
import { getProfile, handleProfile } from "@/Services/Setting/Profil.services";
import { uploadProfile } from "@/Services/Uploads/Uploads.services";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const SejarahSetting = () => {
  const [thumbnail, setThumbnail] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [imgVisiUrl, setImgVisiUrl] = useState(""); // buat payload ImgVisi
  const [loading, setLoading] = useState(false);
const [loadingData, setLoadingData] = useState(true);
  const fetchData = async () => {
    try {
      const response = await getProfile();
      const imgVisi = response?.data?.ImgSejarah;
      setImgVisiUrl(imgVisi);
    } catch (error) {
      console.error("Gagal ambil data profile", error);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!thumbnail?.file) {
      toast.info("Silakan pilih file gambar terlebih dahulu 😥");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", thumbnail.file);

      const uploadResponse = await uploadProfile(formData);

      // Cek upload response
      const uploadedUrl = uploadResponse?.data?.file_url;
      if (!uploadedUrl) {
        toast.error("Gagal mengupload gambar 😥");
        return; // ⬅️ STOP kalau gagal upload
      }

      // Baru kirim ke server
      await handleProfile({
        ImgSejarah: uploadedUrl,
      });

      setImgVisiUrl(uploadedUrl);
        fetchData(); // Refresh data setelah upload
      setPreviewUrl(uploadedUrl); // Update preview URL
      setThumbnail({ file: null }); // Reset thumbnail state
      toast.success("Gambar berhasil diupload dan disimpan! 🎉");
    } catch (error) {
      console.error("Upload atau simpan gagal", error);
      toast.error("Gagal mengupload atau menyimpan gambar 😥");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setThumbnail({ file });
    setPreviewUrl(URL.createObjectURL(file));
  };
  if (loadingData) return <Loading />

  return (
    <div className="">
      <Navigation text={"Sejarah"} />
      <form onSubmit={handleSubmit} className="space-y-4 mt-12">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 
                     file:rounded-full file:border-0 file:text-sm file:font-semibold 
                     file:bg-blue-50 file:text-green-700 hover:file:bg-green-100"
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-xl text-white font-medium transition 
                      ${
                        loading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-700 hover:bg-green-600"
                      }`}
        >
          {loading ? "Mengupload..." : "Simpan"}
        </button>
        {/* Preview Gambar */}
        {imgVisiUrl && (
          <div
            className="mt-4 text-sm text-green-600 hover:underline cursor-pointer"
            onClick={() => window.open(imgVisiUrl, "_blank")}
          >
            ✅ ImgVisi URL: <span className="break-all">{imgVisiUrl}</span>
          </div>
        )}
        {(previewUrl || imgVisiUrl) && (
          <img
            src={previewUrl || imgVisiUrl}
            alt="Preview"
            className="w-full object-cover rounded-xl border border-gray-200"
          />
        )}
      </form>
    </div>
  );
};

export default SejarahSetting;
