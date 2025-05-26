import ArsipSwitch from "@/components/ArsipSwitch";
import BeritaSkeleton from "@/components/BeritaSkeleton";
import ButtonVariant from "@/components/ButtonVariant";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import useUserStore from "@/lib/AuthZustand";
import { responseHandler } from "@/lib/utils";
import { DeleteBerita, GetBerita } from "@/Services/Berita/Berita.services";
import { Pencil, Plus, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Berita = () => {
  const [loading, setLoading] = useState(true);
  const [berita, setBerita] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useUserStore();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await GetBerita(user.role);
      setBerita(response.data);
    } catch (error) {
      responseHandler(error);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const DeleteData = async (id) => {
    setLoading(true);
    try {
      await DeleteBerita(id);
      toast.success("Postingan berhasil dihapus.");
      fetchData();
    } catch (error) {
      responseHandler(error);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="px-4 pt-4 space-y-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <BeritaSkeleton key={i} />
        ))}
      </div>
    );
  }

  const filteredBerita = berita.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex gap-2 items-center">
          <Button
            onClick={() => {
              navigate("/berita/posting");
            }}
            className="bg-green-300 hover:bg-green-400 text-black w-32 h-8 text-sm rounded-md"
          >
            <div className="flex gap-2 items-center">
              <Plus />
              <p>Posting</p>
            </div>
          </Button>
          <Button
            onClick={() => {
              window.location.href =
                "https://media.aljihadketapang.sch.id/wp-login.php?redirect_to=https%3A%2F%2Fmedia.aljihadketapang.sch.id%2Fwp-admin%2F&reauth=1";
            }}
            className="bg-green-300 hover:bg-green-400 text-black w-32 h-8 text-sm rounded-md"
          >
            <div className="flex gap-2 items-center">
              <Pencil />
              <p>Kelola Media</p>
            </div>
          </Button>
        </div>

        {/* Input Search dengan Icon */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Cari judul berita..."
            className="pl-9 pr-3 py-1.5 border outline-none border-gray-300 rounded-md text-sm w-full focus:outline-none "
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {filteredBerita.length === 0 ? (
          <p className="text-gray-500 text-center mt-20">
            Berita tidak ditemukan.
          </p>
        ) : (
          filteredBerita.map((item) => (
            <div
              key={item.id}
              className="relative group border rounded-lg shadow-sm p-4 flex gap-4 items-start hover:shadow-md transition-all"
            >
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-20 h-20 object-cover rounded-md"
              />
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-800 hover:text-green-800 hover:underline hover:cursor-pointer">
                  {item.title}
                </h2>
                <p className="text-sm text-gray-500">{item.kategori}</p>
                <p className="text-sm text-gray-500">
                  Oleh {item.author} •{" "}
                  {new Date(item.createdAt).toLocaleDateString("id-ID")}
                </p>
                <ArsipSwitch
                  id={item.id}
                  isArsip={item.isArsip}
                  onUpdate={fetchData}
                />
              </div>

              {/* Tombol Edit & Hapus */}
              <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  className="text-sm w-20 py-1 rounded bg-yellow-400 text-white hover:bg-yellow-500"
                  onClick={() => navigate(`/berita/edit/${item.id}`)}
                >
                  Edit
                </button>
                <button
                  className="text-sm w-20 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                  onClick={() => DeleteData(item.id)}
                >
                  Hapus
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Berita;
