import Editor from "@/components/Editor";
import Loading from "@/components/Loading";
import Navigation from "@/components/Navigation";
import { getProfile, handleProfile } from "@/Services/Setting/Profil.services";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const SejarahSetting = () => {
const [EditorContent , setEditorContent] = useState("");
  const [loading, setLoading] = useState(false);
const [loadingData, setLoadingData] = useState(true);
  const fetchData = async () => {
    try {
      const response = await getProfile();
  
      setEditorContent(response?.data?.kontentTentangKami);
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

 

    setLoading(true);
    try {
     if (!EditorContent) {
        toast.info("Silakan isi konten tentang kami terlebih dahulu 😥");
        return;
      }
      // Baru kirim ke server
      await handleProfile({
        kontenTentang: EditorContent,
      });

  
        fetchData(); // Refresh data setelah upload
   
      toast.success("Berhasil disimpan! 🎉");
    } catch (error) {
      console.error(" simpan gagal", error);
      toast.error("Gagal menyimpan 😥");
    } finally {
      setLoading(false);
    }
  };


  if (loadingData) return <Loading />

  return (
    <div className="">
      <Navigation text={"Sejarah"} />
      <form onSubmit={handleSubmit} className="space-y-4 mt-12">
       
        <Editor setEditorContent={setEditorContent} editorContent={EditorContent} />
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
       
      </form>
    </div>
  );
};

export default SejarahSetting;
