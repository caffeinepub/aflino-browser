import { Bookmark, Columns, Home, Search, User } from "lucide-react";

interface FooterNavProps {
  onHome: () => void;
  onSearch: () => void;
  onBookmarkClick: () => void;
  onProfileClick: () => void;
  activePage: "home" | "search" | "bookmarks" | "profile" | "other";
  enableUserProfiles?: boolean;
  splitViewActive?: boolean;
  onToggleSplitView?: () => void;
  ghostMode?: boolean;
}

export function FooterNav({
  onHome,
  onSearch,
  onBookmarkClick,
  onProfileClick,
  activePage,
  enableUserProfiles = true,
  splitViewActive = false,
  onToggleSplitView,
  ghostMode = false,
}: FooterNavProps) {
  const items = [
    { icon: Home, label: "Home", id: "home", action: onHome },
    { icon: Search, label: "Search", id: "search", action: onSearch },
    {
      icon: Bookmark,
      label: "Bookmarks",
      id: "bookmarks",
      action: onBookmarkClick,
    },
    ...(enableUserProfiles
      ? [
          {
            icon: User,
            label: "Profile",
            id: "profile",
            action: onProfileClick,
          },
        ]
      : []),
  ];

  return (
    <footer
      data-ocid="footer.panel"
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-2px_12px_rgba(0,0,0,0.06)]"
      style={
        ghostMode
          ? {
              borderTop: "2px solid #FF4500",
              boxShadow:
                "0 -2px 16px rgba(255,69,0,0.18), 0 -1px 4px rgba(255,69,0,0.08)",
            }
          : undefined
      }
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

        {/* Split View button */}
        <button
          type="button"
          data-ocid="footer.split_view.toggle"
          onClick={onToggleSplitView}
          className="flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-colors duration-200 active:scale-95"
        >
          <Columns
            size={22}
            style={{ color: splitViewActive ? "#1A73E8" : "#9ca3af" }}
            strokeWidth={splitViewActive ? 2.5 : 1.8}
          />
          <span
            className="text-[10px] font-medium"
            style={{ color: splitViewActive ? "#1A73E8" : "#9ca3af" }}
          >
            Split
          </span>
        </button>
      </nav>
    </footer>
  );
}
