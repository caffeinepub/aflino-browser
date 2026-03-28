import {
  Edit2,
  Eye,
  EyeOff,
  Globe,
  Key,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  DEFAULT_COUNTRY_CONFIGS,
  useShortcutsStore,
} from "../../useShortcutsStore";

type FormState = {
  title: string;
  url: string;
  apiKey: string;
  countryCodes: string[];
};

const emptyForm: FormState = {
  title: "",
  url: "",
  apiKey: "",
  countryCodes: [],
};

function CountryChips({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (codes: string[]) => void;
}) {
  function toggle(code: string) {
    if (selected.includes(code)) {
      onChange(selected.filter((c) => c !== code));
    } else {
      onChange([...selected, code]);
    }
  }
  return (
    <div>
      <p className="mb-1.5 text-xs font-semibold text-gray-600">
        Show to users in:{" "}
        <span className="font-normal text-gray-400">
          (leave empty for all countries)
        </span>
      </p>
      <div className="flex flex-wrap gap-1.5">
        {DEFAULT_COUNTRY_CONFIGS.map((c) => (
          <button
            key={c.countryCode}
            type="button"
            onClick={() => toggle(c.countryCode)}
            className="rounded-full px-2.5 py-1 text-xs font-semibold transition-colors"
            style={{
              background: selected.includes(c.countryCode)
                ? "#1A73E8"
                : "#F3F4F6",
              color: selected.includes(c.countryCode) ? "#fff" : "#374151",
            }}
          >
            {c.flag} {c.countryCode}
          </button>
        ))}
      </div>
    </div>
  );
}

export function DomainPartnersSection() {
  const {
    domainPartners,
    addDomainPartner,
    updateDomainPartner,
    deleteDomainPartner,
  } = useShortcutsStore();
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editForm, setEditForm] = useState<FormState>(emptyForm);
  const [revealedKeys, setRevealedKeys] = useState<Record<string, boolean>>({});

  function handleAdd() {
    if (!form.title || !form.url) {
      toast.error("Title and URL are required.");
      return;
    }
    addDomainPartner({
      title: form.title,
      url: form.url,
      apiKey: form.apiKey,
      countryCodes: form.countryCodes,
    });
    setForm(emptyForm);
    setShowAdd(false);
    toast.success("Domain partner added.");
  }

  function handleEditSave(id: string) {
    if (!editForm.title || !editForm.url) {
      toast.error("Title and URL are required.");
      return;
    }
    updateDomainPartner(id, {
      title: editForm.title,
      url: editForm.url,
      apiKey: editForm.apiKey,
      countryCodes: editForm.countryCodes,
    });
    setEditingId(null);
    toast.success("Partner updated.");
  }

  function handleDelete(id: string) {
    deleteDomainPartner(id);
    toast.success("Partner removed.");
  }

  function toggleReveal(id: string) {
    setRevealedKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Domain Partners &amp; API Keys
          </h2>
          <p className="text-sm text-gray-500">
            Manage partner domains that can validate Aflino coupons.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAdd((v) => !v)}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white"
          style={{ background: "#1A73E8" }}
          data-ocid="wallet.open_modal_button"
        >
          <Plus size={16} /> Add Partner
        </button>
      </div>

      {/* Add form */}
      {showAdd && (
        <div
          className="rounded-2xl border border-[#1A73E8]/30 bg-[#EBF3FD] p-4"
          data-ocid="wallet.panel"
        >
          <h3 className="mb-3 text-sm font-bold text-gray-800">
            New Domain Partner
          </h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Partner Title (e.g. Aflino Shop)"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#1A73E8]"
              data-ocid="wallet.input"
            />
            <input
              type="url"
              placeholder="Domain URL (e.g. https://shop.aflino.com)"
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#1A73E8]"
              data-ocid="wallet.input"
            />
            <input
              type="text"
              placeholder="API Key (optional)"
              value={form.apiKey}
              onChange={(e) => setForm({ ...form, apiKey: e.target.value })}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#1A73E8]"
              data-ocid="wallet.input"
            />
            <CountryChips
              selected={form.countryCodes}
              onChange={(codes) => setForm({ ...form, countryCodes: codes })}
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowAdd(false);
                  setForm(emptyForm);
                }}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white py-2.5 text-sm font-semibold text-gray-600"
                data-ocid="wallet.cancel_button"
              >
                <X size={14} /> Cancel
              </button>
              <button
                type="button"
                onClick={handleAdd}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-bold text-white"
                style={{ background: "#1A73E8" }}
                data-ocid="wallet.save_button"
              >
                <Save size={14} /> Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Partners list */}
      {domainPartners.length === 0 ? (
        <div
          className="rounded-2xl border-2 border-dashed border-gray-100 p-10 text-center"
          data-ocid="wallet.empty_state"
        >
          <Globe size={32} className="mx-auto mb-2 text-gray-300" />
          <p className="text-sm text-gray-400">
            No domain partners yet. Add one to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {domainPartners.map((partner, idx) => (
            <div
              key={partner.id}
              className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
              data-ocid={`wallet.item.${idx + 1}`}
            >
              {editingId === partner.id ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm({ ...editForm, title: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#1A73E8]"
                    data-ocid="wallet.input"
                  />
                  <input
                    type="url"
                    value={editForm.url}
                    onChange={(e) =>
                      setEditForm({ ...editForm, url: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#1A73E8]"
                    data-ocid="wallet.input"
                  />
                  <input
                    type="text"
                    value={editForm.apiKey}
                    onChange={(e) =>
                      setEditForm({ ...editForm, apiKey: e.target.value })
                    }
                    placeholder="API Key"
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#1A73E8]"
                    data-ocid="wallet.input"
                  />
                  <CountryChips
                    selected={editForm.countryCodes ?? []}
                    onChange={(codes) =>
                      setEditForm({ ...editForm, countryCodes: codes })
                    }
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-gray-200 py-2 text-sm text-gray-600"
                      data-ocid="wallet.cancel_button"
                    >
                      <X size={13} /> Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEditSave(partner.id)}
                      className="flex flex-1 items-center justify-center gap-1 rounded-xl py-2 text-sm font-bold text-white"
                      style={{ background: "#1A73E8" }}
                      data-ocid="wallet.save_button"
                    >
                      <Save size={13} /> Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl"
                    style={{ background: "#EBF3FD" }}
                  >
                    <Globe size={16} style={{ color: "#1A73E8" }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-gray-900">
                      {partner.title}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {partner.url}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {partner.countryCodes && partner.countryCodes.length > 0
                        ? partner.countryCodes
                            .map((cc) => {
                              const cfg = DEFAULT_COUNTRY_CONFIGS.find(
                                (c) => c.countryCode === cc,
                              );
                              return cfg ? cfg.flag : cc;
                            })
                            .join(" ")
                        : "All countries"}
                    </p>
                    {partner.apiKey && (
                      <div className="mt-1 flex items-center gap-1.5">
                        <Key size={11} className="text-gray-400" />
                        <span className="font-mono text-xs text-gray-400">
                          {revealedKeys[partner.id]
                            ? partner.apiKey
                            : `${partner.apiKey.slice(0, 4)}${"..".repeat(4)}`}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleReveal(partner.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          {revealedKeys[partner.id] ? (
                            <EyeOff size={11} />
                          ) : (
                            <Eye size={11} />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(partner.id);
                        setEditForm({
                          title: partner.title,
                          url: partner.url,
                          apiKey: partner.apiKey,
                          countryCodes: partner.countryCodes ?? [],
                        });
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100"
                      data-ocid="wallet.edit_button"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(partner.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100"
                      data-ocid="wallet.delete_button"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
