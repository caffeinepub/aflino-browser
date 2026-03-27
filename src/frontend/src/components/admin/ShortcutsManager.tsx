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
import { Eye, EyeOff, GripVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  type Shortcut,
  type ShortcutCategory,
  useShortcutsStore,
} from "../../useShortcutsStore";
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
  category: ShortcutCategory;
  items: Shortcut[];
}

function ShortcutSection({ category, items }: SectionProps) {
  const {
    addShortcut,
    updateShortcut,
    deleteShortcut,
    reorderShortcuts,
    categoryTitles,
    setCategoryTitle,
    categoryVisibility,
    setCategoryVisibility,
  } = useShortcutsStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Shortcut | undefined>();
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState("");

  const sensors = useSensors(useSensor(PointerSensor));
  const title = categoryTitles[category];
  const visible = categoryVisibility[category];

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

  const startTitleEdit = () => {
    setTitleDraft(title);
    setEditingTitle(true);
  };

  const commitTitleEdit = () => {
    const trimmed = titleDraft.trim();
    if (trimmed) setCategoryTitle(category, trimmed);
    setEditingTitle(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Section header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {/* Inline title edit */}
          {editingTitle ? (
            <input
              type="text"
              value={titleDraft}
              onChange={(e) => setTitleDraft(e.target.value)}
              onBlur={commitTitleEdit}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitTitleEdit();
                if (e.key === "Escape") setEditingTitle(false);
              }}
              maxLength={40}
              className="text-base font-bold text-gray-800 bg-transparent border-b-2 border-blue-500 outline-none min-w-0 flex-1"
              data-ocid={`admin.${category}.input`}
            />
          ) : (
            <button
              type="button"
              onClick={startTitleEdit}
              className="flex items-center gap-1.5 group hover:text-blue-600 transition-colors"
              title="Click to edit section title"
            >
              <h2 className="text-base font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                {title}
              </h2>
              <Pencil
                size={13}
                className="text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0"
              />
            </button>
          )}
          <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0">
            {items.length}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
          {/* Visibility toggle */}
          <button
            type="button"
            data-ocid={`admin.${category}.toggle`}
            onClick={() => setCategoryVisibility(category, !visible)}
            title={visible ? "Hide on home page" : "Show on home page"}
            className={[
              "flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-all",
              visible
                ? "border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100"
                : "border-gray-200 bg-gray-50 text-gray-400 hover:bg-gray-100",
            ].join(" ")}
          >
            {visible ? <Eye size={13} /> : <EyeOff size={13} />}
            {visible ? "Visible" : "Hidden"}
          </button>

          <button
            type="button"
            data-ocid={`admin.${category}.open_modal_button`}
            onClick={openAdd}
            className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 border border-blue-200 hover:bg-blue-50 rounded-lg px-3 py-1.5 transition-colors"
          >
            <Plus size={15} />
            Add
          </button>
        </div>
      </div>

      {/* DnD List */}
      <div className="p-4">
        {!visible && (
          <div className="mb-3 px-3 py-2 rounded-xl bg-gray-50 border border-gray-100 text-xs text-gray-400 flex items-center gap-2">
            <EyeOff size={12} />
            This section is hidden on the home page.
          </div>
        )}
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

const CATEGORIES: { key: ShortcutCategory }[] = [
  { key: "aflinoApps" },
  { key: "globalBrands" },
  { key: "social" },
  { key: "productivity" },
];

export function ShortcutsManager() {
  const aflinoApps = useShortcutsStore((s) => s.aflinoApps);
  const globalBrands = useShortcutsStore((s) => s.globalBrands);
  const social = useShortcutsStore((s) => s.social);
  const productivity = useShortcutsStore((s) => s.productivity);

  const itemsMap: Record<ShortcutCategory, Shortcut[]> = {
    aflinoApps,
    globalBrands,
    social,
    productivity,
  };

  return (
    <div data-ocid="admin.shortcuts.panel" className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Shortcuts Manager</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage and reorder carousel shortcuts shown on the Aflino home page.
          Toggle visibility or click a section title to rename it.
        </p>
      </div>
      {CATEGORIES.map(({ key }) => (
        <ShortcutSection key={key} category={key} items={itemsMap[key]} />
      ))}
    </div>
  );
}
