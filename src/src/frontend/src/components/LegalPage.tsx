import { ArrowLeft, Globe } from "lucide-react";
import { useShortcutsStore } from "../useShortcutsStore";

const LEGAL_PAGES: Record<string, { label: string; defaultContent: string }> = {
  "privacy-policy": {
    label: "Privacy Policy",
    defaultContent:
      "<h2>Privacy Policy</h2><p>Aflino Browser respects your privacy. We collect minimal data necessary to provide browser services. Your browsing history is stored locally on your device and never transmitted to our servers without your consent.</p><p>We use industry-standard encryption to protect your data. You may request deletion of your account and associated data at any time.</p>",
  },
  "terms-of-service": {
    label: "Terms of Service",
    defaultContent:
      "<h2>Terms of Service</h2><p>By using Aflino Browser, you agree to these terms. Aflino Browser is provided as-is for personal, non-commercial use. You must not use Aflino Browser for unlawful purposes or to distribute malicious content.</p><p>We reserve the right to update these terms at any time. Continued use of the browser constitutes acceptance of updated terms.</p>",
  },
  "cookie-policy": {
    label: "Cookie Policy",
    defaultContent:
      "<h2>Cookie Policy</h2><p>Aflino Browser uses local storage and session storage to provide a personalized browsing experience. We use cookies only for essential browser functionality such as session management, preferences, and security.</p><p>Third-party websites you visit through Aflino Browser may set their own cookies. We recommend reviewing each site's cookie policy.</p>",
  },
  "contact-us": {
    label: "Contact Us",
    defaultContent:
      "<h2>Contact Us</h2><p>For support, feedback, or business inquiries, reach out to the Aflino team:</p><ul><li><strong>Email:</strong> support@aflino.in</li><li><strong>Website:</strong> https://aflino.in</li><li><strong>Address:</strong> India</li></ul><p>We aim to respond within 24–48 business hours.</p>",
  },
  "about-us": {
    label: "About Us",
    defaultContent:
      "<h2>About Aflino Browser</h2><p>Aflino Browser is a premium, privacy-first web browser built in India 🇮🇳. Our mission is to deliver a fast, secure, and rewarding browsing experience for every user.</p><p>Made with ❤️ in India by Aflino.</p>",
  },
};

export function LegalPage() {
  const slug =
    window.location.pathname
      .replace("/legal/", "")
      .replace("/legal", "")
      .split("?")[0] || "privacy-policy";

  const pageInfo = LEGAL_PAGES[slug];
  const { legalPages } = useShortcutsStore();
  const html =
    legalPages[slug] ?? pageInfo?.defaultContent ?? "<p>Page not found.</p>";
  const label = pageInfo?.label ?? slug;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() => window.history.back()}
            data-ocid="legal.back_button"
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition-colors"
          >
            <ArrowLeft size={18} className="text-gray-700" />
          </button>
          <div className="flex-1">
            <h1 className="text-base font-bold text-gray-900">{label}</h1>
            <div className="flex items-center gap-1">
              <Globe size={10} className="text-gray-400" />
              <span className="text-[10px] text-gray-400">
                aflino.in/legal/{slug}
              </span>
            </div>
          </div>
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-black"
            style={{ background: "#1A73E8" }}
          >
            A
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        <div
          className="prose prose-blue max-w-none"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: admin-controlled content
          dangerouslySetInnerHTML={{ __html: html }}
          style={{
            lineHeight: 1.75,
            color: "#1a1a1a",
            fontSize: "15px",
          }}
        />
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 py-4">
        <p className="text-center text-[11px] text-gray-400">
          © {new Date().getFullYear()} Aflino. All Rights Reserved.
        </p>
      </div>
    </div>
  );
}
