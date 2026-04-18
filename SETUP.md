# Closure.exe Setup Guide - Google Gemini API

## Step 1: Get Your Google Gemini API Key

### Method A: Google AI Studio (Easiest - Free Tier)

1. Visit [Google AI Studio](https://ai.google.dev/aistudio/signup)
2. Click **"Sign in with Google"**
3. Sign in with your Google account (or create one)
4. Click **"Create API key in new project"** or go to API Keys section
5. Click **"Create API Key"**
6. A new API key starting with `AIza` will appear
7. Click the copy button to copy your key

### Method B: Google Cloud Console (Advanced)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Generative Language API
4. Go to **"Credentials"** → **"Create Credentials"** → **"API Key"**
5. Copy your API key (starts with `AIza`)

## Step 2: Set Up the Project

### Option A: Use Landing Page Input (Recommended)

1. Open `index.html` in your web browser
2. On the landing page, you'll see a field labeled **"Google Gemini API Key"**
3. Paste your API key (starts with `AIza`)
4. Click **"Start Arguing ⚡"**

Your key will be saved to browser storage for future sessions.

### Option B: Hardcode API Key (Advanced)

1. Open `app.js` in your text editor
2. Find this line (around line 13):
   ```javascript
   const HARDCODED_API_KEY = '';
   ```
3. Replace with:
   ```javascript
   const HARDCODED_API_KEY = 'AIza_your_actual_key_here';
   ```
4. Save the file
5. Open `index.html` - your key will be pre-loaded

⚠️ **Warning**: Don't commit hardcoded keys to public repositories!

## Step 3: Verify Setup

1. Open `index.html` in your browser
2. Enter your Gemini API key
3. Click **"Start Arguing ⚡"**
4. Type a message to test
5. If the AI responds, setup is complete! ✅

## Troubleshooting Setup

### API Key Not Working

**Problem**: "Invalid key format. Gemini keys start with AIza"

- ✓ Check your key actually starts with `AIza`
- ✓ Verify you didn't miss any characters when copying
- ✓ Try regenerating the key in Google AI Studio

**Problem**: "Invalid API key or quota exceeded"

- ✓ Check your API quota at [Google AI Studio](https://ai.google.dev/aistudio)
- ✓ Free tier has limits - consider upgrading to paid
- ✓ Wait a few minutes before retrying

### Browser Issues

- ✓ Try a different browser (Chrome, Firefox, Edge, Safari)
- ✓ Clear browser cache: Ctrl+Shift+Delete (Cmd+Shift+Delete on Mac)
- ✓ Disable browser extensions temporarily
- ✓ Try incognito/private browsing mode

### Network Issues

- ✓ Check your internet connection
- ✓ Try a VPN if you're in a restricted region
- ✓ Check if Google's API is accessible from your network

## API Quota & Limits

### Free Tier (Default)
- 60 requests per minute
- No monthly limit (but limited to free tier quota)
- Perfect for casual use

### Paid Tier
- Up to 1,500 requests per minute
- Pay per use (first $20/month free credits)
- Best for heavy usage

Check your usage: https://ai.google.dev/aistudio

## Key Storage

### Browser localStorage
- Your API key is stored in browser's localStorage
- Only accessible from `file://` or `https://` origins
- Cleared when you clear browser cookies/cache
- **Never shared** with any server

### How to Clear Stored Key
1. Open browser DevTools (F12)
2. Go to **"Application"** → **"Local Storage"**
3. Look for `closure_key`
4. Delete it
5. Refresh the page

## File Structure

```
project/
├── index.html          # Main UI (update API key input here)
├── app.js             # Game logic (update CFG and callAI here)
├── styles.css         # Styling
├── README.md          # Full documentation
└── SETUP.md          # This file
```

## Configuration Reference

### app.js Configuration

```javascript
// Line 13: Optional hardcoded API key
const HARDCODED_API_KEY = '';

// Lines 15-21: API Configuration
const CFG = {
    MODEL_MAIN: 'gemini-2.0-flash',           // Primary model
    MODEL_FAST: 'gemini-2.0-flash',           // Fast analysis model
    API_URL: 'https://generativelanguage.googleapis.com/v1beta/models',
    TOUCH_GRASS_MIN: 15,                      // Salt threshold
    MAX_DIGNITY: 5,                           // Starting dignity
    REF_AUTO_HIDE: 8000,                      // Referee card hide delay (ms)
};
```

### Supported Gemini Models

- `gemini-2.0-flash` - Latest, fastest, recommended ⭐
- `gemini-1.5-flash` - Previous generation, still good
- `gemini-1.5-pro` - More powerful, slower, higher cost
- `gemini-pro` - Older model, not recommended

## Security Best Practices

1. ✓ **Never commit API keys** to version control
2. ✓ **Use environment variables** in production
3. ✓ **Regenerate keys** if accidentally exposed
4. ✓ **Monitor usage** regularly at Google AI Studio
5. ✓ **Set spending limits** in Google Cloud Console

## Performance Tips

1. **Cold Start**: First request might take 2-3 seconds (Gemini initializing)
2. **Faster Responses**: `gemini-2.0-flash` is optimized for speed
3. **Batch Messages**: Don't spam rapid requests (respects rate limits)
4. **Token Counting**: Long conversation history = slower responses

## Advanced: Custom Models

To use a different Gemini model:

1. Edit `app.js` line 16:
   ```javascript
   MODEL_MAIN: 'gemini-1.5-pro',  // or 'gemini-2.0-flash', etc.
   ```

2. Available models (as of 2024):
   - `gemini-2.0-flash` - Fastest, recommended
   - `gemini-1.5-pro` - Most powerful
   - `gemini-1.5-flash` - Balanced

3. Check latest at: https://ai.google.dev/models

## Advanced: System Prompts

Edit the `PROMPTS` object in `app.js` to customize:

```javascript
const PROMPTS = {
    ex: `Your custom toxic ex persona...`,
    referee: `Your custom referee scoring rules...`,
    scanner: `Your custom toxic pattern detector...`,
    hints: `Your custom comeback hint generator...`
};
```

Each prompt is sent to Gemini to define AI behavior.

## Getting Help

- **Gemini Docs**: https://ai.google.dev/docs
- **API Reference**: https://ai.google.dev/api
- **Status Page**: https://status.cloud.google.com/
- **Support**: https://support.google.com/

## Next Steps

1. ✓ Get your API key
2. ✓ Open `index.html` in browser
3. ✓ Paste your key
4. ✓ Start arguing!
5. ✓ Share your high scores 🏆

Good luck! 💔

---

**Last Updated**: April 2026
**Closure.exe Version**: 2.0 (Gemini Edition)
