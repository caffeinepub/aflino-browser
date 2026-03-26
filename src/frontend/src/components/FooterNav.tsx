import { Bookmark, Home, Search, User } from "lucide-react";

interface FooterNavProps {
  onHome: () => void;
  onSearch: () => void;
}

export function FooterNav({ onHome, onSearch }: FooterNavProps) {
  const items = [
    { icon: Home, label: "Home", action: onHome, id: "home" },
    { icon: Search, label: "Search", action: onSearch, id: "search" },
    { icon: Bookmark, label: "Bookmarks", action: () => {}, id: "bookmarks" },
    { icon: User, label: "Profile", action: () => {}, id: "profile" },
  ];

  return (
    <footer
      data-ocid="footer.panel"
      className="bg-white border-t border-gray-100 flex-shrink-0"
    >
      <nav className="flex items-center justify-around px-2 py-2">
        {items.map(({ icon: Icon, label, action, id }) => (
          <button
            type="button"
            key={id}
            data-ocid={`footer.${id}_button`}
            onClick={action}
            className="flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl text-gray-400 hover:text-blue-500 transition-colors duration-200 active:scale-95"
          >
            <Icon size={22} />
            <span className="text-[10px] font-medium">{label}</span>
          </button>
        ))}
      </nav>
      <div className="flex items-center justify-center gap-8 py-2 bg-gray-50">
        <div className="w-5 h-5 rounded-full border-2 border-gray-400" />
        <div className="w-4 h-4 rounded-sm border-2 border-gray-400" />
        <div className="w-6 h-0.5 rounded-full bg-gray-400" />
      </div>
    </footer>
  );
}
