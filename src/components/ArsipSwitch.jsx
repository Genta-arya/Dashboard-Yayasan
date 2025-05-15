import { toast } from "sonner";
import { useState } from "react";
import BeritaSkeleton from "./BeritaSkeleton";
import { updateStatus } from "@/Services/Berita/Berita.services";

const ArsipSwitch = ({ id, isArsip, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(isArsip); // true = aktif

  const handleToggle = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await updateStatus(id, !isActive);
      setIsActive(!isActive);
      toast.success(`Berita berhasil di${!isActive ? "aktifkan" : "arsipkan"}`);
      onUpdate?.();
    } catch (error) {
      toast.error("Gagal mengubah status arsip.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 mt-2">
      {!loading && (
        <>
          <button
            type="button"
            disabled={loading}
            onClick={handleToggle}
            className={`w-10 h-5 flex items-center rounded-full p-1 transition-colors duration-300 ${
              isActive ? "bg-green-500" : "bg-gray-300"
            } ${loading && "opacity-50 cursor-not-allowed"}`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                isActive ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
          <span className="text-xs text-gray-600">
            {isActive ? "Publish" : "Diarsipkan"}
          </span>
        </>
      )}
    </div>
  );
};

export default ArsipSwitch;
