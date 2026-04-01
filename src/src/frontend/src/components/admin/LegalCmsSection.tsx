import { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { FileText, Globe } from "lucide-react";
import { toast } from "sonner";
import { useShortcutsStore } from "../../useShortcutsStore";

const LEGAL_PAGES = [
  { slug: "privacy-policy", label: "Privacy Policy" },
  { slug: "terms-of-service", label: "Terms of Service" },
  { slug: "cookie-policy", label: "Cookie Policy" },
  { slug: "contact-us", label: "Contact Us" },
  { slug: "about-us", label: "About Us" },
];

const DEFAULT_CONTENT: Record<string, string> = {
  "privacy-policy":
    "<h2>Privacy Policy</h2><p>Aflino Browser respects your privacy. We collect minimal data necessary to provide browser services. Your browsing history is stored locally on your device and never transmitted to our servers without your consent.</p><p>We use industry-standard encryption to protect your data. You may request deletion of your account and associated data at any time.</p>",
  "terms-of-service":
    "<h2>Terms of Service</h2><p>By using Aflino Browser, you agree to these terms. Aflino Browser is provided as-is for personal, non-commercial use. You must not use Aflino Browser for unlawful purposes or to distribute malicious content.</p><p>We reserve the right to update these terms at any time. Continued use of the browser constitutes acceptance of updated terms.</p>",
  "cookie-policy":
    "<h2>Cookie Policy</h2><p>Aflino Browser uses local storage and session storage to provide a personalized browsing experience. We use cookies only for essential browser functionality such as session management, preferences, and security.</p><p>Third-party websites you visit through Aflino Browser may set their own cookies. We recommend reviewing each site's cookie policy.</p>",
  "contact-us":
    "<h2>Contact Us</h2><p>For support, feedback, or business inquiries, reach out to the Aflino team:</p><ul><li><strong>Email:</strong> support@aflino.in</li><li><strong>Website:</strong> https://aflino.in</li><li><strong>Address:</strong> India</li></ul><p>We aim to respond within 24–48 business hours.</p>",
  "about-us":
    "<h2>About Aflino Browser</h2><p>Aflino Browser is a premium, privacy-first web browser built in India 🇮🇳. Our mission is to deliver a fast, secure, and rewarding browsing experience for every user — from students to professionals.</p><p>We believe in an open web where your data belongs to you. Aflino is built by a passionate team dedicated to innovation, accessibility, and user empowerment.</p><p><em>Made with ❤️ in India by Aflino.</em></p>",
};

export function LegalCmsSection() {
  const { legalPages, setLegalPage } = useShortcutsStore();
  const [activeSlug, setActiveSlug] = useState("privacy-policy");
  const [content, setContent] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const p of LEGAL_PAGES) {
      init[p.slug] = legalPages[p.slug] ?? DEFAULT_CONTENT[p.slug] ?? "";
    }
    return init;
  });

  const handleUpdate = () => {
    setLegalPage(activeSlug, content[activeSlug]);
    toast.success("Legal page updated successfully!", {
      style: { borderLeft: "4px solid #1A73E8" },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: "#1A73E8" }}
        >
          <FileText size={18} className="text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Browser Legal Manager
          </h2>
          <p className="text-xs text-gray-500">
            Edit legal pages accessible at /legal/[slug]
          </p>
        </div>
      </div>

      {/* Page Tabs */}
      <div className="flex flex-wrap gap-2">
        {LEGAL_PAGES.map((page) => (
          <button
            key={page.slug}
            type="button"
            onClick={() => setActiveSlug(page.slug)}
            data-ocid={`legal.${page.slug}.tab`}
            className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all border"
            style={
              activeSlug === page.slug
                ? {
                    background: "#1A73E8",
                    color: "white",
                    borderColor: "#1A73E8",
                  }
                : {
                    background: "white",
                    color: "#374151",
                    borderColor: "#e5e7eb",
                  }
            }
          >
            {page.label}
          </button>
        ))}
      </div>

      {/* URL Preview */}
      <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
        <Globe size={14} className="text-gray-400" />
        <span className="text-xs text-gray-500 font-mono">
          aflino.in/legal/{activeSlug}
        </span>
      </div>

      {/* Rich Text Editor */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <ReactQuill
          theme="snow"
          value={content[activeSlug] ?? ""}
          onChange={(val) =>
            setContent((prev) => ({ ...prev, [activeSlug]: val }))
          }
          style={{ minHeight: 320 }}
          modules={{
            toolbar: [
              [{ header: [1, 2, 3, false] }],
              ["bold", "italic", "underline", "strike"],
              [{ list: "ordered" }, { list: "bullet" }],
              ["link"],
              ["clean"],
            ],
          }}
        />
      </div>

      {/* Update Button */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400">
          Changes are saved to local database and reflected immediately on the
          legal page.
        </p>
        <button
          type="button"
          onClick={handleUpdate}
          data-ocid="legal.save_button"
          className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold transition-all active:scale-95 shadow-sm"
          style={{ background: "#1A73E8" }}
        >
          Update Page
        </button>
      </div>
    </div>
  );
}
