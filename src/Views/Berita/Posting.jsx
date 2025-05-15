import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Editor from "@/components/Editor";
import ButtonVariant from "@/components/ButtonVariant";
import { Pencil, Plus } from "lucide-react";
import DOMPurify from "dompurify";
import { toast } from "sonner";
import { posting } from "@/Services/Berita/Berita.services";
import { uploadProfile } from "@/Services/Uploads/Uploads.services";
import { responseHandler } from "@/lib/utils";
import Navigation from "@/components/Navigation";
import useUserStore from "@/lib/AuthZustand";

const Posting = () => {
  const [editorContent, setEditorContent] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [category, setCategory] = useState("informasi");
  const [isChecked, setIsChecked] = useState(true);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
    const { user } = useUserStore();
  const [author, setAuthor] = useState(user?.username);
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
      if (!thumbnail) {
        toast.error("Thumbnail postingan harus diisi.");
        return;
      }
      if (!sanitizedContent) {
        toast.error("Isi postingan harus diisi.");
        return;
      }

      setLoading(true);

      let uploadedThumbnailUrl = "";
      try {
        const formData = new FormData();
        formData.append("file", thumbnail.file);
        const uploadResponse = await uploadProfile(formData);
        uploadedThumbnailUrl = uploadResponse.data.file_url;
      } catch (uploadErr) {
        toast.error("Gagal mengunggah thumbnail.");

        return; // stop di sini kalau upload gagal
      }

      await posting({
        title: title,
        thumbnail: uploadedThumbnailUrl,
        content: sanitizedContent,
        kategori: category,
        author: author,
        isArsip: isChecked,
      });

      toast.success("Postingan berhasil dipublish.");
      setEditorContent("");
      setThumbnail(null);
      setTitle("");
      setAuthor(user?.username);
      setCategory("berita");
    } catch (error) {
      responseHandler(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navigation text={"Tulis Berita"} />
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

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Thumbnail</label>
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
           <option value="informasi">Informasi</option>
            <option value="berita">Berita</option>
            <option value="opini">Opini</option>
          </select>
        </div>

        <Editor
          editorContent={editorContent}
          setEditorContent={setEditorContent}
        />

        <ButtonVariant
          icon={<Pencil />}
          text={"Posting"}
          disabled={loading}
          onClick={handlePostClick}
          className="bg-blue-600 text-white py-2 px-6 rounded-lg mt-4"
        />
      </div>
    </>
  );
};

export default Posting;
