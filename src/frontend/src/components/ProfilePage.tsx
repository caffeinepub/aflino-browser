import {
  ArrowLeft,
  ChevronRight,
  Clock,
  Download,
  Shield,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

interface ProfilePageProps {
  onClose: () => void;
}

export function ProfilePage({ onClose }: ProfilePageProps) {
  const quickLinks = [
    {
      icon: Clock,
      label: "Browser History",
      description: "View your browsing history",
      action: () =>
        toast("Coming soon", {
          description: "Browser History will be available in a future update.",
        }),
    },
    {
      icon: Download,
      label: "Downloads",
      description: "Manage your downloaded files",
      action: () =>
        toast("Coming soon", {
          description: "Downloads will be available in a future update.",
        }),
    },
    {
      icon: Shield,
      label: "Admin Panel",
      description: "Access Aflino admin dashboard",
      action: () => {
        window.location.href = "/admin";
      },
      isBlue: true,
    },
  ];

  return (
    <motion.div
      data-ocid="profile.modal"
      className="fixed inset-0 z-[300] bg-white flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 border-b border-gray-100"
        style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 12px)" }}
      >
        <button
          type="button"
          data-ocid="profile.close_button"
          onClick={onClose}
          className="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-base font-bold text-gray-900">Profile</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Avatar section */}
        <div className="flex flex-col items-center py-10 px-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3, ease: "easeOut" }}
            className="w-[72px] h-[72px] rounded-full flex items-center justify-center mb-4 shadow-lg"
            style={{ background: "linear-gradient(135deg, #1A73E8, #0d5cc7)" }}
          >
            <User size={34} className="text-white" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.3 }}
            className="text-center"
          >
            <h2 className="text-xl font-bold text-gray-900">Aflino User</h2>
            <p className="text-sm text-gray-400 mt-0.5">aflino@browser.app</p>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="flex gap-8 mt-6 px-8 py-4 rounded-2xl w-full max-w-xs"
            style={{ background: "rgba(26,115,232,0.06)" }}
          >
            <div className="flex-1 text-center">
              <p className="text-lg font-bold" style={{ color: "#1A73E8" }}>
                24
              </p>
              <p className="text-xs text-gray-400 mt-0.5">Tabs</p>
            </div>
            <div className="w-px bg-blue-100" />
            <div className="flex-1 text-center">
              <p className="text-lg font-bold" style={{ color: "#1A73E8" }}>
                0
              </p>
              <p className="text-xs text-gray-400 mt-0.5">Bookmarks</p>
            </div>
            <div className="w-px bg-blue-100" />
            <div className="flex-1 text-center">
              <p className="text-lg font-bold" style={{ color: "#1A73E8" }}>
                0
              </p>
              <p className="text-xs text-gray-400 mt-0.5">Downloads</p>
            </div>
          </motion.div>
        </div>

        {/* Quick Links */}
        <div className="px-4 pb-8">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">
            Quick Links
          </p>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {quickLinks.map(
              ({ icon: Icon, label, description, action, isBlue }, idx) => (
                <motion.button
                  key={label}
                  type="button"
                  data-ocid={`profile.${label.toLowerCase().replace(/\s+/g, "_")}_button`}
                  onClick={action}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + idx * 0.06, duration: 0.25 }}
                  className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
                  style={{
                    borderTop: idx > 0 ? "1px solid #f3f4f6" : undefined,
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: isBlue ? "rgba(26,115,232,0.1)" : "#f9fafb",
                    }}
                  >
                    <Icon
                      size={18}
                      style={{ color: isBlue ? "#1A73E8" : "#6b7280" }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-semibold"
                      style={{ color: isBlue ? "#1A73E8" : "#111827" }}
                    >
                      {label}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {description}
                    </p>
                  </div>
                  <ChevronRight
                    size={16}
                    className="text-gray-300 flex-shrink-0"
                  />
                </motion.button>
              ),
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
