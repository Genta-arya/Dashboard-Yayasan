import ArsipSwitch from "@/components/ArsipSwitch";
import ButtonVariant from "@/components/ButtonVariant";
import Editor from "@/components/Editor";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { responseHandler } from "@/lib/utils";
import {
  EditBeritas,
  getDetailBerita,
} from "@/Services/Berita/Berita.services";
import { Pencil, Plus, Save } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import DOMPurify from "dompurify";
import { uploadProfile } from "@/Services/Uploads/Uploads.services";
import useUserStore from "@/lib/AuthZustand";
import Loading from "@/components/Loading";
const EditBerita = () => {
  const [loading, setLoading] = useState(true);
  const [currentThumbnail, setCurrentThumbnail] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [editorContent, setEditorContent] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [isChange, setIsChange] = useState(false);
  const navigate = useNavigate();
  const { user } = useUserStore();
  const [author, setAuthor] = useState(user?.username);
  const { id } = useParams();
  const fetchData = async () => {
    try {
      const response = await getDetailBerita(id);
      setTitle(response.data.title);
      setCategory(response.data.kategori);
      setEditorContent(response.data.content);
      setIsChecked(response.data.isArsip);
      setCurrentThumbnail({
        file: response.data.thumbnail,
        preview: response.data.thumbnail,
        name: response.data.thumbnail,
      });
      setAuthor(response.data.author);
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

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail({
        file: file,
        preview: URL.createObjectURL(file),
        name: file.name,
      });
    }
  };

  // Fungsi untuk menangani drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) {
      setThumbnail({
        file: file,
        preview: URL.createObjectURL(file),
        name: file.name,
      });
    }
  };

  // Fungsi untuk menghapus thumbnail
  const handleRemoveThumbnail = () => {
    setThumbnail(null);
  };

  // Fungsi untuk menangani perubahan kategori
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handlePostClick = async () => {
    let sanitizedContent = DOMPurify.sanitize(editorContent);

    const div = document.createElement("div");
    div.innerHTML = sanitizedContent;
    const poweredByElements = div.querySelectorAll("p");

    poweredByElements.forEach((element) => {
      if (element.textContent.includes("Powered by")) {
        element.remove();
      }
    });

    sanitizedContent = div.innerHTML;

    try {
      if (!sanitizedContent) {
        toast.error("Isi postingan harus diisi.");
        return;
      }

      setLoading(true);

      let uploadedThumbnailUrl = currentThumbnail?.file;

      if (thumbnail) {
        try {
          const formData = new FormData();
          formData.append("file", thumbnail.file);
          const uploadResponse = await uploadProfile(formData);
          uploadedThumbnailUrl = uploadResponse.data.file_url;
        } catch (uploadErr) {
          toast.error("Gagal mengunggah thumbnail.");

          return;
        }
      }

      await EditBeritas(id, {
        title: title,
        thumbnail: uploadedThumbnailUrl,
        content: sanitizedContent,
        kategori: category,
        author: author,
        isArsip: isChecked,
      });
      fetchData();
      setIsChange(false);
      setThumbnail(null);
      toast.success("Postingan berhasil diubah.");
    } catch (error) {
      responseHandler(error);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  if (loading) return <Loading />;

  return (
    <>
      <>
        <Navigation text={"Edit Berita"} />
        <div className="p-6">
          <div className="flex flex-row justify-between items-center pb-4 mb-4 border-b">
            <h1>Publish</h1>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                id="publish-toggle"
                name="publish"
                checked={isChecked}
                onChange={() => setIsChecked(!isChecked)}
              />
              <div
                className={`w-11 h-6 ${
                  isChecked ? "bg-green-500" : "bg-gray-300"
                } rounded-full transition-all duration-300 relative`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    isChecked ? "translate-x-5 left-1" : "left-1"
                  }`}
                ></span>
              </div>
            </label>
          </div>
          {!isChange ? (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Thumbnail
              </label>
              <div className="border p-4 border-dashed py-8 rounded-lg cursor-default relative">
                {currentThumbnail && (
                  <div className="flex items-center space-x-4">
                    <img
                      src={currentThumbnail.preview}
                      alt="Thumbnail"
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <p className="text-sm font-medium">
                        {currentThumbnail.file}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Ganti Thumbnail
                </label>
                <div
                  className="border p-4 border-dashed py-8 rounded-lg cursor-pointer relative"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  {thumbnail ? (
                    <div className="flex items-center space-x-4">
                      <img
                        src={thumbnail.preview}
                        alt="Thumbnail"
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <p className="text-sm font-medium">{thumbnail.name}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Plus />
                      <p className="text-center text-gray-500">
                        Klik atau seret gambar disini
                      </p>
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              {thumbnail && (
                <div className="mb-4  flex justify-center">
                  <Button
                    variant="outline"
                    onClick={handleRemoveThumbnail}
                    className="text-red-500 text-center"
                  >
                    Hapus Thumbnail
                  </Button>
                </div>
              )}
            </>
          )}

          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => setIsChange(!isChange)}
              className={`${
                isChange ? "bg-red-500" : "bg-green-500"
              } hover:opacity-90 w-52 items-center text-center flex justify-center text-white px-4 rounded-md mt-1 mb-4 py-1`}
            >
              {isChange ? (
                <div className="flex gap-2 items-center">
                  <p>Batal</p>
                </div>
              ) : (
                <div className="flex gap-2 items-center">
                  <Pencil size={16} />
                  <p>Ganti Thumbnail</p>
                </div>
              )}
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Judul</label>
            <input
              type="text"
              value={title}
              placeholder="Judul Postingan"
              min={3}
              maxLength={100}
              onChange={(e) => setTitle(e.target.value)}
              className="border p-2 w-full rounded-md outline-none"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Author</label>
            <input
              type="text"
              value={author}
              placeholder="Author"
              min={3}
              maxLength={100}
              onChange={(e) => setAuthor(e.target.value)}
              className="border p-2 w-full rounded-md outline-none"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Kategori</label>
            <select
              value={category}
              onChange={handleCategoryChange}
              className="border p-2 w-full rounded-md"
            >
               <option value="pengumuman">Pengumuman</option>
              <option value="berita">Berita</option>
              <option value="opini">Opini</option>
            </select>
          </div>

          <Editor
            editorContent={editorContent}
            setEditorContent={setEditorContent}
          />

          <ButtonVariant
            text={"Simpan"}
            disabled={loading}
            onClick={handlePostClick}
            className="bg-blue-600 text-white  py-2 px-6 rounded-lg mt-4"
          />
        </div>
      </>
    </>
  );
};

export default EditBerita;
