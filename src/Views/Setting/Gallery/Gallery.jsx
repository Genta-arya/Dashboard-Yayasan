"use client";
import Navigation from "@/components/Navigation";
import { uploadProfile } from "@/Services/Uploads/Uploads.services";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import SortableImageItem from "@/components/SortImage";
import Loading from "@/components/Loading";
import { getGallery, HandleGallery } from "@/Services/Setting/Gallery.services";

const Gallery = () => {
  const [slider, setSlider] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState(null);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [totalBatch, setTotalBatch] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getGallery();
      const backendImages = response.data || [];

      const formattedImages = backendImages
        .sort((a, b) => a.order - b.order)
        .map((img) => ({
          id: img.id,
          preview: img.url_image,
          file: null,
          dbId: img.id,
        }));

      setSlider(formattedImages);
    } catch (error) {
      toast.error("Gagal mengambil data galeri.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file, idx) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} ukurannya lebih dari 5MB!`);
        return;
      }

      const objectUrl = URL.createObjectURL(file);
      const img = new Image();
      img.src = objectUrl;

      img.onload = () => {
        setSlider((prev) => [
          ...prev,
          {
            id: `img-${Date.now()}-${idx}`,
            file,
            preview: objectUrl,
          },
        ]);
      };

      img.onerror = () => {
        toast.error(`${file.name} gagal dibaca sebagai gambar.`);
        URL.revokeObjectURL(objectUrl);
      };
    });
  };

  const handleDeleteImage = (id) => {
    setSlider((prev) => prev.filter((img) => img.id !== id));
  };

  const handleSubmit = async () => {
    if (slider.length === 0) {
      toast.warning("Belum ada gambar yang dipilih.");
      return;
    }

    setLoadingUpload(true);
    let uploadedImages = [];

    try {
      const newImages = slider.filter(({ file }) => file);
      const existingImages = slider
        .filter(({ file }) => !file)
        .map(({ preview }) => preview);

      const batches = [];
      for (let i = 0; i < newImages.length; i += 10) {
        batches.push(newImages.slice(i, i + 10));
      }

      setTotalBatch(batches.length);

      for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        setUploadingIndex(i + 1);

        const form = new FormData();
        batch.forEach(({ file }) => {
          if (file) {
            form.append("file[]", file);
          }
        });

        const res = await uploadProfile(form);
        const urls = res.data.files.map((f) => f.file_url);
        uploadedImages.push(...urls);
      }

      const allImages = [...existingImages, ...uploadedImages];
      if (allImages.length !== slider.length) {
        toast.error("Jumlah gambar yang diupload tidak sesuai!");
        return;
      }

      const payload = {
        galleries: slider.map((img, index) => ({
          id: img.dbId || undefined,
          url_image: allImages[index],
          order: index + 1,
        })),
      };

      await HandleGallery(payload);
      toast.success("Upload sukses!");
      fetchData();
    } catch (error) {
      toast.error("Upload gagal!");
      console.error(error);
    } finally {
      setUploadingIndex(null);
      setLoadingUpload(false);
      setTotalBatch(0);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = slider.findIndex((i) => i.id === active.id);
      const newIndex = slider.findIndex((i) => i.id === over?.id);
      setSlider((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      <Navigation text="Gallery" />
      <div className="p-4 space-y-4 mt-8">
        <p className="font-bold">Total Gambar: {slider.length}</p>
        {uploadingIndex && (
          <p className="text-yellow-600">
            ⏳ Mengupload batch ke-{uploadingIndex} dari {totalBatch}...
          </p>
        )}

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="mb-4 block w-full text-sm text-green-700
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-green-50 file:text-green-700
            hover:file:bg-green-100"
        />

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={slider.map((img) => img.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {slider.map((img, index) => (
                <SortableImageItem
                  key={img.id}
                  img={img}
                  index={index}
                  onRemove={handleDeleteImage}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

      <button
  onClick={handleSubmit}
  disabled={loadingUpload}
  className={`w-full text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 ${
    loadingUpload
      ? "bg-gray-500 cursor-not-allowed"
      : "bg-green-700 hover:bg-green-600"
  }`}
>
  {loadingUpload
    ? `Uploading... Batch ${uploadingIndex + 1} dari ${totalBatch}`
    : "Simpan"}

  {loadingUpload && (
    <span className="animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent text-white rounded-full" />
  )}
</button>

      </div>
    </>
  );
};

export default Gallery;
