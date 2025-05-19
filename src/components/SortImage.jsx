import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash } from "lucide-react";

const SortableImageItem = ({ img, index, onRemove }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: img.id });

  const style = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border rounded-xl overflow-hidden shadow flex flex-col justify-between cursor-default " // tambahin height fix juga biar konsisten
    >
      {/* Area gambar (draggable) */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-move flex-1 flex items-center justify-center overflow-hidden"
      >
        <img
          src={img.preview || img.url}
          alt={`Preview ${index}`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Tombol hapus selalu di bawah */}
      <button
        onClick={() => {
          onRemove(img.id);
        }}
        className="w-full flex items-center justify-center gap-1 text-red-500 bg-red-100 py-2 hover:bg-red-200 transition"
      >
        <Trash className="w-4 h-4" />
        <span className="text-sm">Hapus</span>
      </button>
    </div>
  );
};

export default SortableImageItem;
