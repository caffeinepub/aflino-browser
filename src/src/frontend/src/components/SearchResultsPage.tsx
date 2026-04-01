import { ChevronLeft, Search, X, Zap } from "lucide-react";

interface SearchResult {
  title: string;
  link: string;
  snippet: string;
  pagemap?: { cse_thumbnail?: Array<{ src: string }> };
}

interface SearchResultsPageProps {
  query: string;
  results: SearchResult[];
  onClose: () => void;
  onNavigate: (url: string) => void;
  loading?: boolean;
  inAppSearchEnabled?: boolean;
  hasApiKeys?: boolean;
  onGoToAdmin?: () => void;
}

function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 mb-3 shadow-sm animate-pulse">
      <div className="flex gap-3">
        <div className="flex-1">
          <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-100 rounded w-1/3 mb-3" />
          <div className="h-3 bg-gray-100 rounded w-full mb-1" />
          <div className="h-3 bg-gray-100 rounded w-5/6" />
        </div>
        <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0" />
      </div>
    </div>
  );
}

export function SearchResultsPage({
  query,
  results,
  onClose,
  onNavigate,
  loading = false,
  inAppSearchEnabled,
  hasApiKeys,
  onGoToAdmin,
}: SearchResultsPageProps) {
  const thumbnail = (r: SearchResult) =>
    r.pagemap?.cse_thumbnail?.[0]?.src ?? null;

  const showSetupCard = inAppSearchEnabled && !hasApiKeys;

  return (
    <div
      data-ocid="search_results.panel"
      className="fixed inset-0 z-50 bg-white flex flex-col"
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 text-white"
        style={{ background: "#1A73E8" }}
      >
        <button
          type="button"
          data-ocid="search_results.close_button"
          onClick={onClose}
          className="p-1 rounded-full hover:bg-blue-600 transition-colors"
          aria-label="Back"
        >
          <ChevronLeft size={22} />
        </button>
        <div className="flex-1 text-sm font-medium truncate">{query}</div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-full hover:bg-blue-600 transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col">
        {showSetupCard ? (
          <div
            data-ocid="search_results.empty_state"
            className="flex flex-col items-center justify-center flex-1 px-6 py-12 text-center"
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-md"
              style={{
                background: "linear-gradient(135deg, #1A73E8, #0d5cc7)",
              }}
            >
              <Zap size={28} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Activate Pro Search
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs mb-6">
              To see results directly inside Aflino, please add your Google API
              Key and CX ID in the Admin Panel.
            </p>
            <button
              type="button"
              data-ocid="search_results.primary_button"
              onClick={onGoToAdmin}
              className="px-6 py-3 rounded-full text-white text-sm font-semibold shadow-md active:scale-95 transition-transform"
              style={{ background: "#1A73E8" }}
            >
              Go to Admin Settings
            </button>
          </div>
        ) : loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : results.length === 0 ? (
          <div
            data-ocid="search_results.empty_state"
            className="flex flex-col items-center justify-center h-64 gap-4 text-gray-400"
          >
            <Search size={48} strokeWidth={1.2} />
            <p className="text-base font-medium">No results found</p>
            <p className="text-sm text-gray-400">Try a different search term</p>
          </div>
        ) : (
          results.map((result, idx) => {
            const thumb = thumbnail(result);
            return (
              <button
                type="button"
                key={`${result.link}-${idx}`}
                data-ocid={`search_results.item.${idx + 1}`}
                className="w-full text-left bg-white border border-gray-100 rounded-xl p-4 mb-3 shadow-sm hover:shadow-md cursor-pointer transition-shadow"
                onClick={() => onNavigate(result.link)}
              >
                <div className="flex gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-semibold text-blue-600 truncate leading-snug">
                      {result.title}
                    </p>
                    <p className="text-xs text-green-600 truncate mt-0.5">
                      {result.link}
                    </p>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {result.snippet}
                    </p>
                  </div>
                  {thumb && (
                    <img
                      src={thumb}
                      alt=""
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
