import React, { useState, useEffect } from "react";
import { Plus, Trash, ArrowUp, ArrowDown } from "lucide-react";
import { uploadProfile } from "@/Services/Uploads/Uploads.services";
import Navigation from "@/components/Navigation";
import {
  getUnitPendidikan,
  handleUnitPendidikan,
} from "@/Services/Setting/UnitPendidikan.service";
import { toast } from "sonner";
import Loading from "@/components/Loading";

const UnitPendidikan = () => {
  const [units, setUnits] = useState([
    { id: Date.now(), icon: "", iconFile: null, title: "", description: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getUnitPendidikan();
      const formatted = response.data.map((unit) => ({
        id: Date.now() + Math.random(),
        backendId: unit.id,
        icon: unit.url_Image,
        iconFile: null,
        title: unit.judul,
        description: unit.deskripsi,
      }));
      setUnits(formatted);
    } catch (error) {
      console.error("Gagal ambil data:", error);
      toast.error("Gagal mengambil data unit pendidikan.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (index, field, value) => {
    const updatedUnits = [...units];
    updatedUnits[index][field] = value;
    setUnits(updatedUnits);
  };

  const handleFileChange = (index, file) => {
    const updatedUnits = [...units];
    updatedUnits[index].iconFile = file;
    updatedUnits[index].icon = URL.createObjectURL(file);
    setUnits(updatedUnits);
  };

  const handleAddUnit = () => {
    setUnits([
      ...units,
      { id: Date.now(), icon: "", iconFile: null, title: "", description: "" },
    ]);
  };

  const handleRemoveUnit = (id) => {
    setUnits(units.filter((unit) => unit.id !== id));
  };

  const moveUnitUp = (index) => {
    if (index === 0) return;
    const updated = [...units];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setUnits(updated);
  };

  const moveUnitDown = (index) => {
    if (index === units.length - 1) return;
    const updated = [...units];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    setUnits(updated);
  };

  const handleSubmit = async () => {
    if (units.some((unit) => !unit.title || !unit.description)) {
      setMessage({
        type: "error",
        text: "Mohon lengkapi semua data sebelum menyimpan.",
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const uploadedUnits = await Promise.all(
        units.map(async (unit) => {
          let iconUrl = unit.icon;
          if (unit.iconFile) {
            const formData = new FormData();
            formData.append("file", unit.iconFile);
            const uploadResult = await uploadProfile(formData);
            iconUrl = uploadResult?.data?.file_url || unit.icon;
          }

          return {
            id: unit?.backendId || null,
            icon: iconUrl,
            title: unit.title,
            description: unit.description,
          };
        })
      );

      await handleUnitPendidikan({ units: uploadedUnits });
      toast.success("Data berhasil disimpan.");
    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        text: "Gagal menyimpan data. Coba lagi nanti.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />

  return (
    <>
      <Navigation text="Unit Pendidikan" />
      <div className="flex flex-col gap-6 mt-5">
        {units.map((unit, index) => (
          <div
            key={unit.id}
            className="border p-5 rounded-2xl shadow-md space-y-4 relative bg-white"
          >
            <div className="absolute top-3 right-3 flex gap-2">
              <button
                onClick={() => moveUnitUp(index)}
                className="p-1 text-gray-600 hover:bg-gray-200 rounded-full"
                title="Pindah ke atas"
              >
                <ArrowUp className="w-5 h-5" />
              </button>
              <button
                onClick={() => moveUnitDown(index)}
                className="p-1 text-gray-600 hover:bg-gray-200 rounded-full"
                title="Pindah ke bawah"
              >
                <ArrowDown className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleRemoveUnit(unit.id)}
                className="p-1 text-red-500 hover:bg-red-100 rounded-full"
                title="Hapus Unit"
              >
                <Trash className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Icon / Gambar
              </label>
              {unit.icon && (
                <img
                  src={unit.icon}
                  alt="icon preview"
                  className="w-12 h-12 object-cover rounded mb-2 border"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(index, e.target.files[0])}
                className="w-full border rounded px-3 py-2 file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-sm file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Judul Unit Pendidikan
              </label>
              <input
                type="text"
                placeholder="Contoh: TK - Taman Kanak-kanak"
                value={unit.title}
                onChange={(e) => handleChange(index, "title", e.target.value)}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deskripsi Singkat
              </label>
              <textarea
                placeholder="Tulis deskripsi singkat mengenai unit ini..."
                value={unit.description}
                onChange={(e) =>
                  handleChange(index, "description", e.target.value)
                }
                className="w-full border px-3 py-2 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
          </div>
        ))}

        <div className="flex flex-wrap gap-4 flex-col ">
          <button
            onClick={handleAddUnit}
            className="flex items-center gap-2 px-4 py-2 justify-center  bg-white text-black border-gray-500 border rounded-lg hover:opacity-80 transition"
          >
            <Plus className="w-4 h-4" /> Tambah Unit
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-4 py-2 rounded-lg transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-700 hover:bg-green-600"
            } text-white`}
          >
            {loading ? "Menyimpan..." : "Simpan Semua"}
          </button>
        </div>

        {message && (
          <p
            className={`mt-4 text-sm ${
              message.type === "error" ? "text-red-600" : "text-green-600"
            }`}
          >
            {message.text}
          </p>
        )}
      </div>
    </>
  );
};

export default UnitPendidikan;
