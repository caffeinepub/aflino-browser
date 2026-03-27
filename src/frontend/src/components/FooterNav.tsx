import { Bookmark, Home, Search, User } from "lucide-react";
import { toast } from "sonner";

interface FooterNavProps {
  onHome: () => void;
  onSearch: () => void;
  activePage: "home" | "search" | "other";
}

export function FooterNav({ onHome, onSearch, activePage }: FooterNavProps) {
  const items = [
    { icon: Home, label: "Home", id: "home", action: onHome },
    { icon: Search, label: "Search", id: "search", action: onSearch },
    {
      icon: Bookmark,
      label: "Bookmarks",
      id: "bookmarks",
      action: () =>
        toast("Coming Soon", {
          description: "Bookmarks will be available in the next update.",
        }),
    },
    {
      icon: User,
      label: "Profile",
      id: "profile",
      action: () =>
        toast("Coming Soon", {
          description: "Profile will be available in the next update.",
        }),
    },
  ];

  return (
    <footer
      data-ocid="footer.panel"
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-2px_12px_rgba(0,0,0,0.06)]"
    >
      <nav className="flex items-center justify-around px-2 py-2 pb-2">
        {items.map(({ icon: Icon, label, action, id }) => {
          const isActive = activePage === id;
          return (
            <button
              type="button"
              key={id}
              data-ocid={`footer.${id}_button`}
              onClick={action}
              className="flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-colors duration-200 active:scale-95"
            >
              <Icon
                size={22}
                style={{ color: isActive ? "#1A73E8" : "#9ca3af" }}
                strokeWidth={isActive ? 2.5 : 1.8}
              />
              <span
                className="text-[10px] font-medium"
                style={{ color: isActive ? "#1A73E8" : "#9ca3af" }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </nav>
    </footer>
  );
}
