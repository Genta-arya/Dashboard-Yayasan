import Navigation from "@/components/Navigation";
import { getSlider, HandleSlider } from "@/Services/Setting/Slider.services";
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
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import SortableImageItem from "@/components/SortImage";
import Loading from "@/components/Loading";

const Slider = () => {
  const [slider, setSlider] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getSlider();
      const backendImages = response.data?.[0]?.images || [];

      const formattedImages = backendImages.map((img, index) => ({
        id: `img-${index}-${img.url}`, // ID unik
        preview: img.url,
        file: null,
      }));

      setSlider(formattedImages);
    } catch (error) {
      toast.error("Gagal mengambil data slider.");
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

    if (files.length + slider.length > 5) {
      toast.error("Max 5 gambar aja ya!");
      return;
    }

    files.forEach((file, idx) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} ukurannya lebih dari 5MB!`);
        return;
      }

      const objectUrl = URL.createObjectURL(file);
      const img = new Image();
      img.src = objectUrl;

      img.onload = () => {
        if (img.width < 650 || img.height < 500) {
          toast.warning(`Gambar ${file.name} resolusinya kurang dari 650x500!`);
          URL.revokeObjectURL(objectUrl);
          return;
        }

        setSlider((prev) => {
          if (prev.length >= 5) {
            toast.error("Max 5 gambar ya!");
            return prev;
          }
          return [
            ...prev,
            {
              id: `img-${Date.now()}-${idx}`,
              file,
              preview: objectUrl,
            },
          ];
        });
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

    setLoading(true);

    try {
      const form = new FormData();
      slider.forEach(({ file }) => {
        if (file) {
          form.append("file[]", file);
        }
      });

      let uploadedImages = [];
      if (form.has("file[]")) {
        const res = await uploadProfile(form);
        uploadedImages = res.data.files.map((file) => file.file_url);
      }

      const existingImages = slider
        .filter(({ file }) => !file)
        .map(({ preview }) => preview);

      const allImages = [...existingImages, ...uploadedImages];

      if (allImages.length === 0) {
        toast.error("Gagal mendapatkan URL gambar.");
        return;
      }
      const payload = {
        imageUrls: slider.map((img, index) => ({
          url: allImages[index], // karena file baru pun udah di-convert jadi preview URL
          index: index,
        })),
      };

      await HandleSlider({ imageUrls: payload.imageUrls });
      toast.success("Upload sukses!");
      fetchData();
    } catch (error) {
      toast.error("Upload gagal!");
      console.error(error);
    } finally {
      setLoading(false);
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
      <Navigation text="Slider" />
      <div className="p-4 space-y-4 mt-8">
        <div>
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
          <p className="text-sm text-gray-600">
            * Maks 5 gambar, resolusi minimal 1200x600, ukuran maksimal
            5MB/gambar.
          </p>
        </div>

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
          className="bg-green-700 w-full text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          Simpan
        </button>
      </div>
    </>
  );
};

export default Slider;
