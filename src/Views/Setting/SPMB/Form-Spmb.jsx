import React, { useEffect, useState } from "react";
import Editor from "@/components/Editor";
import Navigation from "@/components/Navigation";
import { uploadProfile } from "@/Services/Uploads/Uploads.services";
import { GetSpmb, SpmbService } from "@/Services/Spmb/Spmb.service";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const FormSpmb = () => {
  const [judul, setJudul] = useState("");
  const [previewUrls, setPreviewUrls] = useState([]);
  const [iconFile, setIconFile] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [konten, setKonten] = useState("");
  const { type } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await GetSpmb(type);
        const data = response?.data;
        if (!data) return;

        setJudul(data.judul || "");
        setKonten(data.konten || "");
        setIconPreview(data.url_icon || "");
        setThumbnailPreview(data.header || "");
        const imageUrls = (data.images || []).map((img) => ({
          url: img.url,
          file: null,
        }));
        setPreviewUrls(imageUrls);
      } catch (error) {
        console.error("Gagal fetch data:", error);
        toast.error("Gagal mengambil data SPMB");
      }
    };
    fetchData();
  }, [type]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }));
    setPreviewUrls((prev) => [...prev, ...previews]);
  };

  const moveImage = (index, direction) => {
    const newOrder = [...previewUrls];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;
    [newOrder[index], newOrder[targetIndex]] = [
      newOrder[targetIndex],
      newOrder[index],
    ];
    setPreviewUrls(newOrder);
  };

  const removeImage = (index) => {
    const newImages = [...previewUrls];
    newImages.splice(index, 1);
    setPreviewUrls(newImages);
  };

  const submit = async () => {
    if (!judul.trim()) return toast.info("Judul masih kosong!");
    if (!iconFile && !iconPreview) return toast.info("Ikon belum dipilih!");
    if (previewUrls.length === 0) return toast.info("Thumbnail belum dipilih!");
    // if (!konten.trim()) return alert("Konten belum diisi!");

    try {
      let iconUrl = iconPreview;
      if (iconFile) {
        const form = new FormData();
        form.append("file", iconFile);
        const res = await uploadProfile(form);
        iconUrl = res.data.file_url;
        if (!iconUrl) throw new Error("Gagal upload ikon");
      }

      let thumbnailUrl = thumbnailPreview;
      if (thumbnail) {
        const form = new FormData();
        form.append("file", thumbnail);
        const res = await uploadProfile(form);
        thumbnailUrl = res.data.file_url;
        if (!thumbnailUrl) throw new Error("Gagal upload thumbnail");
      }

      const uploadedImages = await Promise.all(
        previewUrls.map(async (item) => {
          if (item.file) {
            const form = new FormData();
            form.append("file", item.file);
            const res = await uploadProfile(form);
            return res.data.file_url;
          }
          return item.url;
        })
      );

      const payload = {
        judul,
        konten,
        type,
        header: thumbnailUrl,
        imageUrls: uploadedImages,
        icon_url: iconUrl,
      };

      await SpmbService(payload);
      toast.success("Berhasil menyimpan data SPMB");
    } catch (error) {
      console.error("Submit error:", error);
      alert("Gagal menyimpan data SPMB");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-10">
      <Navigation text={`SPMB - ${type}`} />

      <div className="max-w-4xl mx-auto mt-6 space-y-6 p-4">
        {/* Judul */}
        <div className="bg-white p-4 rounded-2xl shadow space-y-2">
          <label className="font-semibold">Judul:</label>
          <input
            type="text"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            placeholder="Masukkan judul konten"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* Thumbnail */}
        <div className="bg-white p-4 rounded-2xl shadow space-y-2">
          <div className="flex justify-between gap-2 mb-8">
            <label className="font-semibold">Thumbnail</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                setThumbnail(e.target.files[0]);
                setThumbnailPreview(URL.createObjectURL(e.target.files[0]));
              }}
            />
          </div>
          {thumbnailPreview && (
            <div className="flex justify-center">
              <img
                src={thumbnailPreview}
                alt="Thumbnail"
                className="mt-2 w-32 h-32 object-cover rounded-xl shadow"
              />
            </div>
          )}
        </div>

        {/* Ikon */}
        <div className="bg-white p-4 rounded-2xl shadow space-y-2 w-full">
          <div className="flex justify-between gap-2 mb-8">
            <label className="font-semibold">Ikon</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                setIconFile(e.target.files[0]);
                setIconPreview(URL.createObjectURL(e.target.files[0]));
              }}
            />
          </div>
          {iconPreview && (
            <div className="flex justify-center">
              <img
                src={iconPreview}
                alt="Ikon"
                className="mt-2 w-32 h-32 object-cover rounded-xl shadow"
              />
            </div>
          )}
        </div>

        {/* Gambar Brosur */}
        <div className="bg-white p-4 rounded-2xl shadow space-y-2">
          <div className="flex justify-between gap-2 mb-8">
            <label className="font-semibold">Gambar Brosur:</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
            />
          </div>
          {previewUrls.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {previewUrls.map((img, index) => (
                <div
                  key={index}
                  className="relative group border rounded-xl overflow-hidden shadow"
                >
                  <img
                    src={img.url}
                    alt={`Preview ${index}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={() => moveImage(index, -1)}
                      className="bg-white p-1 rounded shadow hover:bg-gray-200 text-xs"
                    >
                      ⬅
                    </button>
                    <button
                      onClick={() => moveImage(index, 1)}
                      className="bg-white p-1 rounded shadow hover:bg-gray-200 text-xs"
                    >
                      ➡
                    </button>
                    <button
                      onClick={() => removeImage(index)}
                      className="bg-red-500 text-white p-1 rounded shadow hover:bg-red-600 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Editor */}
        <div className="bg-white p-4 rounded-2xl shadow space-y-2">
          <label className="font-semibold">Konten:</label>
          <Editor setEditorContent={setKonten} editorContent={konten} />
        </div>

        {/* Submit */}
        <div className="text-center pt-4">
          <button
            onClick={submit}
            className="bg-green-800 w-full hover:bg-green-700 transition text-white px-6 py-2 rounded-xl shadow"
          >
            💾 Simpan
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormSpmb;
