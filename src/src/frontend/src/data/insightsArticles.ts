export type ArticleCategory =
  | "Ghost Mode"
  | "OCR & Translate"
  | "Data Saver"
  | "Productivity"
  | "Security"
  | "Tips";

export interface InsightsArticle {
  id: string;
  title: string;
  category: ArticleCategory;
  summary: string;
  body: string;
  readTime: string;
  date: string;
  featureTag: string;
  accentColor: string;
}

export const insightsArticles: InsightsArticle[] = [
  {
    id: "ghost-mode-guide",
    title: "How to Browse Privately with Ghost Mode",
    category: "Ghost Mode",
    summary:
      "Activate Aflino Ghost Mode to browse without saving history, cookies, or session data—all wiped on exit.",
    body: `Ghost Mode is Aflino's built-in privacy shield. When you tap the 🔥 flame icon in the top header, every piece of browsing data—history entries, cookies, cached pages, and form autofill—is routed to sessionStorage instead of your permanent localStorage. The moment you close the tab or refresh, all of that data is wiped automatically, leaving zero traces on your device.\n\nActivating Ghost Mode is instant and reversible. You'll notice the address bar shifts to a dark charcoal tint with a deep orange glow, and the Aflino logo pulses orange as a visual reminder that you're in private mode. A toast notification confirms the switch, so you always know exactly when privacy is active.\n\nGhost Mode also purges your Magic Clipboard history when disabled, so no copied passwords or private links linger after your session. This makes it ideal for banking, sensitive research, or any browsing you'd rather not leave a footprint on—especially on shared devices.\n\nPro tip: Ghost Mode works seamlessly alongside Data Saver and the Zen Reader. You can combine privacy browsing with lightweight, distraction-free reading in a single session. Simply activate both from the header icons and enjoy a clean, private, low-data browsing experience.`,
    readTime: "3 min read",
    date: "Mar 2026",
    featureTag: "ghostMode",
    accentColor: "from-orange-500 to-red-600",
  },
  {
    id: "ocr-guide",
    title: "Scan & Translate Any Document with Aflino OCR",
    category: "OCR & Translate",
    summary:
      "Use the camera icon in the search bar to scan printed text from any image—100% on-device, zero privacy risk.",
    body: `Aflino's Smart Image-to-Text feature lets you point your camera at any printed document, sign, menu, or screenshot and instantly extract the text using Tesseract.js—a powerful OCR engine that runs entirely on your device. No data is ever sent to a server, keeping your documents completely private.\n\nTo use it, tap the 📷 camera icon inside the Aflino search bar. You can capture a live photo or pick an image from your gallery. Within seconds, the extracted text appears in the search bar, ready to search, copy, or translate. A "Copy to Clipboard" button lets you quickly move the text to any other app.\n\nOnce text is extracted, tap the 🌐 Translate button to open the full Scan-to-Translate modal. Choose from Hindi, Bengali, or Spanish, and you'll see the original and translated text side-by-side—each with its own copy button. This is especially useful for travelers, students, or anyone working with multilingual content.\n\nThe OCR engine releases its memory as soon as you close the translation modal, keeping the app fast and responsive. All processing happens locally, so even scans of sensitive documents like prescription labels or bank statements never leave your phone.`,
    readTime: "4 min read",
    date: "Mar 2026",
    featureTag: "ocr",
    accentColor: "from-blue-500 to-cyan-500",
  },
  {
    id: "data-saver-guide",
    title: "Tips to Save 90% Data on Slow Networks",
    category: "Data Saver",
    summary:
      "Enable Data Saver Extreme to block heavy images and videos, cutting bandwidth usage by up to 80% on 2G/3G.",
    body: `Aflino Data Saver Extreme is engineered for low-bandwidth connections. When activated, it intercepts every image request and blocks any image larger than 50KB from loading automatically. Instead, a clean gray placeholder card appears with a "Tap to load image" button, giving you full control over what consumes your data.\n\nBeyond images, Data Saver also disables video auto-play and suppresses heavy animated GIFs across all web content. This single change can cut page weight by 60–80% on media-heavy news and social sites, making them load dramatically faster on 2G or 3G connections.\n\nYou'll find the toggle in Profile → Browser Settings. Once active, a 🍃 leaf icon appears in the header. Long-press the leaf to see a live tooltip showing exactly how many MB you've saved this session. The Profile page also shows a live counter: "💰 You saved approx. X MB this session," with a counting animation each time a large asset is blocked.\n\nData Saver is fully compatible with Ghost Mode and Zen Reader. Combine all three for the lightest possible browsing experience: private, distraction-free, and ultra-low-data. Perfect for travel, international roaming, or any situation where every megabyte counts.`,
    readTime: "3 min read",
    date: "Mar 2026",
    featureTag: "dataSaver",
    accentColor: "from-green-500 to-teal-600",
  },
  {
    id: "zen-mode-guide",
    title: "Zen Reader Mode: Distraction-Free Browsing",
    category: "Productivity",
    summary:
      "Strip ads and clutter from any article and read in a clean, customizable Sepia or Dark theme with auto-scroll.",
    body: "Zen Reader Mode transforms any text-heavy webpage into a serene, distraction-free reading experience. When you navigate to an article, a 📖 book icon appears in the address bar. Tap it, and Aflino strips away all ads, navigation menus, comment sections, and scripts, leaving only the clean article content rendered in beautiful premium typography.\n\nYou can choose from three reading themes: Sepia (warm, easy on the eyes), Dark (OLED-friendly for night reading), and Standard (clean white). Three font options—Serif, Sans-Serif, and Monospace—let you match the reading style to the content. All your preferences are saved to localStorage and restored automatically every time you open Zen Mode.\n\nThe Auto-Scroll feature is where Zen Mode truly shines. Enable it from the control bar at the bottom and adjust the speed from 1 to 10. Aflino scrolls the article for you at a smooth, steady pace—perfect for hands-free reading while commuting, cooking, or exercising.\n\nZen Mode pairs perfectly with the Web-Speech Narrator. Open Zen Mode first to get clean article text, then activate the Speaker on any paragraph to have it read aloud while you scroll. Combine this with Auto-Scroll for a completely hands-free, audiobook-style reading session.",
    readTime: "4 min read",
    date: "Mar 2026",
    featureTag: "zenMode",
    accentColor: "from-purple-500 to-indigo-600",
  },
  {
    id: "clipboard-guide",
    title: "Magic Clipboard: Your Multi-Copy Powerhouse",
    category: "Productivity",
    summary:
      "Access your last 5 copied items instantly from the left-edge panel. Tap any entry to re-copy it in one tap.",
    body: `Every time you copy text or a link in Aflino, the Magic Clipboard automatically saves it to a private session panel. Tap the clipboard button on the left edge of the screen to slide open the panel and see your last 5 unique copied items, displayed as compact cards with clean typography.\n\nTapping any card in the panel instantly re-copies that text to your system clipboard and shows a "Copied!" toast—so switching between URLs, passwords, and addresses during a session is a single tap instead of hunting back through tabs. This is especially powerful when filling out forms that require the same information in multiple fields.\n\nThe Magic Clipboard is also accessible inside the Omnibox search overlay. When you tap the address bar to search, your clipboard history appears as a horizontal scrollable strip above the suggestions. Tap any item to instantly paste and search—no typing required. This glassmorphic Smart Paste strip is perfect for quickly navigating to a URL you copied earlier.\n\nAll clipboard data is stored in sessionStorage only, not localStorage. This means it's automatically cleared when you close the browser or refresh, maintaining your privacy. Ghost Mode goes one step further, purging the clipboard immediately when you disable it—ensuring nothing lingers from a private session.`,
    readTime: "3 min read",
    date: "Mar 2026",
    featureTag: "clipboard",
    accentColor: "from-yellow-500 to-orange-500",
  },
  {
    id: "split-view-guide",
    title: "Split-View Browsing: Shop & Compare Simultaneously",
    category: "Productivity",
    summary:
      "Divide your screen into two browser windows and compare products, articles, or prices side by side in real time.",
    body: `Aflino's Dynamic Split-View splits your screen into two 50/50 browser iframes, letting you browse two completely different websites simultaneously. Activate it by tapping the Split button in the bottom navigation bar while a website is loaded. Both windows scroll independently and support full interaction.\n\nThe smartest part is the automatic store sync. If the URL in the top frame contains shopping-related keywords—like 'shop', 'product', or 'p/'—Aflino automatically opens a relevant store search in the bottom frame and pre-loads the results in the background. This means by the time you're done reading the product description in the top frame, price comparisons are already loaded below.\n\nSplit-View is perfect for comparing product reviews and prices, reading an article while keeping a reference page open, or monitoring a live dashboard while filling in a form. The dual-frame setup also works great for translating a webpage: load the original in the top frame and a translation service in the bottom.\n\nTo exit Split-View, simply tap the Split button again. Both frames continue loading in the background during transitions, so your browsing state is preserved. The active tab's URL is always updated in the address bar to reflect the top frame.`,
    readTime: "3 min read",
    date: "Mar 2026",
    featureTag: "splitView",
    accentColor: "from-sky-500 to-blue-600",
  },
  {
    id: "vault-guide",
    title: "Secure Your Bookmarks with App Vault",
    category: "Security",
    summary:
      "Move sensitive bookmarks into a PIN-protected Secure Vault hidden inside your Bookmarks tab.",
    body: `App Vault is a hidden, PIN-protected folder inside your Bookmarks tab designed for bookmarks you want to keep private—banking portals, private research, medical records, or any link you'd rather not expose to anyone who picks up your phone. The vault is invisible until you deliberately reveal it with a downward scroll gesture at the bottom of the Bookmarks sheet.\n\nOn your first access, you'll be prompted to set a 4-digit PIN. This PIN is stored locally and required every time you open the vault. To move a bookmark into the vault, tap the lock icon on any bookmark card in your regular bookmarks list—it disappears from the main list and appears inside the vault instead. You can move it back out at any time by unlocking the vault.\n\nThe vault is persistent across sessions, stored in Zustand's persisted localStorage state. It's completely separate from your regular bookmarks, so even if someone looks at your bookmarks list, they'll see no trace of the vault's contents. Only a subtle "Show Vault" gesture at the bottom of the sheet reveals it exists.\n\nFor even greater security, consider combining App Vault with Ghost Mode for your most sensitive browsing sessions. History and cookies won't be saved, and your vault remains protected by PIN—a two-layer privacy approach that rivals dedicated privacy browsers.`,
    readTime: "4 min read",
    date: "Mar 2026",
    featureTag: "vault",
    accentColor: "from-slate-600 to-gray-800",
  },
  {
    id: "speed-dial-guide",
    title: "Understanding Aflino's Smart Speed-Dial",
    category: "Tips",
    summary:
      "Your 8 most-visited sites automatically appear as glassmorphic tiles on the home screen for instant one-tap access.",
    body: `Smart Speed-Dial is Aflino's intelligent quick-access grid. The home screen automatically populates up to 8 tiles with your most frequently visited domains, tracked silently in the background using Zustand's personalization engine. Each tile shows the site's favicon and domain name on a glassmorphic background that complements the Aflino Blue theme.\n\nThe algorithm weighs three factors: visit count (how many times you've been to that domain), recency (how recently you visited), and keyword alignment (whether your recent searches relate to that domain). This means the Speed-Dial isn't just "most visited"—it's a genuinely smart prediction of where you're about to go next.\n\nYou don't need to configure anything. Simply browse normally and the grid updates automatically. New sites push older ones out as your habits evolve, keeping the grid fresh and relevant. If you clear your history, the Speed-Dial resets and will repopulate as you browse.\n\nTapping any Speed-Dial tile immediately navigates to that site in the Aflino browser frame. Combine Speed-Dial with the Jump Back carousel above it for a powerful home screen that surfaces both your recent single visits and your habitual destinations in two distinct, scannable sections.`,
    readTime: "2 min read",
    date: "Mar 2026",
    featureTag: "speedDial",
    accentColor: "from-indigo-500 to-blue-700",
  },
  {
    id: "scan-translate-guide",
    title: "Scan-to-Translate is Live: Full Guide",
    category: "OCR & Translate",
    summary:
      "Point your camera at any printed text to translate it instantly into Hindi, Bengali, or Spanish—all on-device.",
    body: `Scan-to-Translate is Aflino's newest power feature and it changes how you interact with the physical world. Tap the 📷 camera icon in the search bar, capture an image of any text—a restaurant menu, street sign, product label, or foreign-language document—and Aflino extracts the text using Tesseract.js running entirely on your device.\n\nOnce the text is extracted, the "🌐 Translate" button appears in the result bar. Tap it to open the full Scan-to-Translate modal. Select your target language—Hindi, Bengali, or Spanish—and the translation appears in seconds using the free MyMemory translation API. The original and translated text sit side-by-side with individual Copy buttons for each, making it easy to paste translations wherever you need them.\n\nEverything happens on-device or via minimal API calls—no images are ever uploaded to a server. Your scans of sensitive documents like medical prescriptions, legal notices, or banking forms stay completely private. The OCR worker is terminated immediately after use to free up memory.\n\nThis feature is a game-changer for travelers, multilingual households, and students. Instead of switching between a camera app, a translator, and your browser, you now have a seamless scan-to-result pipeline in one tap. Aflino v50 enhances this with a dedicated guide right here in Insights—bookmark it and share it with friends who could benefit.`,
    readTime: "4 min read",
    date: "Mar 2026",
    featureTag: "ocr",
    accentColor: "from-pink-500 to-rose-600",
  },
  {
    id: "backup-restore-guide",
    title: "Backup & Restore Your Aflino Data",
    category: "Security",
    summary:
      "Export all your bookmarks, vault, rewards, and settings as an encrypted .aflino file—restore in one tap on any device.",
    body: `Aflino's Backup & Restore system lets you export your entire browser setup—bookmarks, App Vault, wallet rewards, clipboard history, and settings—into a single encrypted .aflino file. You can store this file in cloud storage, email it to yourself, or move it to a new device for instant setup.\n\nTo create a backup, go to Profile and scroll down to the Data Management card. Tap "Backup Data" and the app will compile all your Zustand store data, encrypt it, and download it as a .aflino file. The encryption uses Base64 encoding as a basic obfuscation layer—more advanced encryption is planned for future versions.\n\nRestoring is equally simple. Tap "Restore Data" on any Aflino installation, select your .aflino file, and your full setup—shortcuts, bookmarks, vault contents, theme preferences, and search settings—is restored within seconds. You won't need to re-add any bookmarks or reconfigure any shortcuts.\n\nThis feature is especially useful when switching phones, setting up Aflino for a family member with the same preferences, or as a safety net if browser data gets cleared. Pair it with QR Sync in Profile for a zero-account device transfer that takes under 30 seconds.`,
    readTime: "3 min read",
    date: "Mar 2026",
    featureTag: "backup",
    accentColor: "from-emerald-500 to-green-700",
  },
];
