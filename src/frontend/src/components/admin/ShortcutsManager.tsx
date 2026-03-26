import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { type Shortcut, useShortcutsStore } from "../../useShortcutsStore";
import { ShortcutFormModal } from "./ShortcutFormModal";

interface SortableItemProps {
  shortcut: Shortcut;
  index: number;
  onEdit: (s: Shortcut) => void;
  onDelete: (id: string) => void;
}

function SortableItem({
  shortcut,
  index,
  onEdit,
  onDelete,
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: shortcut.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isImageUrl =
    shortcut.icon.startsWith("http") || shortcut.icon.startsWith("/");

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-ocid={`admin.shortcut.item.${index}`}
      className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-3 py-2.5 shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Drag handle */}
      <button
        type="button"
        data-ocid="admin.shortcut.drag_handle"
        {...attributes}
        {...listeners}
        className="text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing flex-shrink-0 touch-none"
        aria-label="Drag to reorder"
      >
        <GripVertical size={18} />
      </button>

      {/* Icon */}
      <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
        {shortcut.iconImageUrl ? (
          <img
            src={shortcut.iconImageUrl}
            alt=""
            className="w-full h-full object-cover rounded-lg"
          />
        ) : isImageUrl ? (
          <img src={shortcut.icon} alt="" className="w-6 h-6 object-contain" />
        ) : (
          <span className="text-lg leading-none">{shortcut.icon || "🔗"}</span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate">
            {shortcut.name}
          </p>
          {shortcut.isSponsored && (
            <span className="flex-shrink-0 text-xs font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
              Sponsored
            </span>
          )}
        </div>
        <p className="text-xs text-gray-400 truncate">{shortcut.url}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          type="button"
          data-ocid="admin.shortcut.edit_button"
          onClick={() => onEdit(shortcut)}
          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          aria-label="Edit"
        >
          <Pencil size={15} />
        </button>
        <button
          type="button"
          data-ocid="admin.shortcut.delete_button"
          onClick={() => onDelete(shortcut.id)}
          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          aria-label="Delete"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}

interface SectionProps {
  title: string;
  category: "aflinoApps" | "globalBrands";
  items: Shortcut[];
}

function ShortcutSection({ title, category, items }: SectionProps) {
  const { addShortcut, updateShortcut, deleteShortcut, reorderShortcuts } =
    useShortcutsStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Shortcut | undefined>();

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((s) => s.id === active.id);
    const newIndex = items.findIndex((s) => s.id === over.id);
    const reordered = arrayMove(items, oldIndex, newIndex);
    reorderShortcuts(
      category,
      reordered.map((s) => s.id),
    );
  };

  const openAdd = () => {
    setEditTarget(undefined);
    setModalOpen(true);
  };

  const openEdit = (s: Shortcut) => {
    setEditTarget(s);
    setModalOpen(true);
  };

  const handleSave = (values: Omit<Shortcut, "id">) => {
    if (editTarget) {
      updateShortcut(category, editTarget.id, values);
    } else {
      addShortcut(category, values);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Section header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-gray-800">{title}</h2>
          <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">
            {items.length}
          </span>
        </div>
        <button
          type="button"
          data-ocid={`admin.${category}.open_modal_button`}
          onClick={openAdd}
          className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 border border-blue-200 hover:bg-blue-50 rounded-lg px-3 py-1.5 transition-colors"
        >
          <Plus size={15} />
          Add Shortcut
        </button>
      </div>

      {/* DnD List */}
      <div className="p-4">
        {items.length === 0 ? (
          <div
            data-ocid={`admin.${category}.empty_state`}
            className="flex flex-col items-center justify-center py-8 text-gray-400"
          >
            <span className="text-3xl mb-2">🔗</span>
            <p className="text-sm">No shortcuts yet. Add one!</p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={items.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col gap-2">
                {items.map((shortcut, i) => (
                  <SortableItem
                    key={shortcut.id}
                    shortcut={shortcut}
                    index={i + 1}
                    onEdit={openEdit}
                    onDelete={(id) => deleteShortcut(category, id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      <ShortcutFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialValues={editTarget}
      />
    </div>
  );
}

export function ShortcutsManager() {
  const aflinoApps = useShortcutsStore((s) => s.aflinoApps);
  const globalBrands = useShortcutsStore((s) => s.globalBrands);

  return (
    <div data-ocid="admin.shortcuts.panel" className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Shortcuts Manager</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage and reorder carousel shortcuts shown on the Aflino home page.
        </p>
      </div>
      <ShortcutSection
        title="Line 1 — Aflino Apps"
        category="aflinoApps"
        items={aflinoApps}
      />
      <ShortcutSection
        title="Line 2 — Global Brands"
        category="globalBrands"
        items={globalBrands}
      />
    </div>
  );
}
