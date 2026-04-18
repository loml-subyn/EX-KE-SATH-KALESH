/* ═══════════════════════════════════════════
   Closure.exe — Environment Configuration
   ═══════════════════════════════════════════ */

// 🔐 Add your Google Gemini API key here
// Get key from: https://ai.google.dev/aistudio/signup
// Example: 'AIzaSyDxxx...'

const CONFIG = {
    GEMINI_API_KEY: 'AIzaSyB2HToTtHk1P5TkkgnaLFR7ld1QBnR81ws',  // ← Paste your API key here
    USE_HARDCODED_KEY: true  // Set to true to use the hardcoded key above, false to use landing page input
};

// Export for use in app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
