# Environment Configuration Guide

## Overview

This project now supports environment-based configuration to avoid hardcoding API keys directly in your source code.

## Setup Instructions

### Step 1: Locate the Config File

The main configuration file is:
```
config.js
```

### Step 2: Add Your API Key

Open `config.js` and replace the placeholder with your actual Gemini API key:

```javascript
const CONFIG = {
    GEMINI_API_KEY: 'AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',  // ← Paste your key here
    USE_HARDCODED_KEY: true  // Set to true to use the hardcoded key
};
```

Example with real key:
```javascript
const CONFIG = {
    GEMINI_API_KEY: 'AIzaSyDxxx1234567890abcdefghijklmnopqrst',
    USE_HARDCODED_KEY: true
};
```

### Step 3: Launch the App

1. Open `index.html` in your browser
2. The app will automatically load your API key from `config.js`
3. **The landing page will NOT ask for an API key** (the input field is optional)
4. Click "Start Arguing ⚡" and begin!

## Configuration Options

### Option A: Use Hardcoded Key (Recommended for Development)

Set `USE_HARDCODED_KEY: true` in `config.js`:

```javascript
const CONFIG = {
    GEMINI_API_KEY: 'AIzaSy...your_key...',
    USE_HARDCODED_KEY: true
};
```

**Behavior**:
- ✅ No API key input needed on landing page
- ✅ Automatically uses key from `config.js`
- ✅ Landing page shows disabled/hidden input field
- ⚠️ Don't commit `config.js` to public repos!

### Option B: Use Landing Page Input (Recommended for Production)

Set `USE_HARDCODED_KEY: false` in `config.js`:

```javascript
const CONFIG = {
    GEMINI_API_KEY: '',  // Leave empty
    USE_HARDCODED_KEY: false
};
```

**Behavior**:
- ✅ Safe to commit to public repos
- ✅ Users enter API key on landing page
- ✅ Key stored in browser localStorage
- ✅ Key not exposed in source code

## Security Best Practices

### ✅ DO:
- ✓ Put `config.js` in `.gitignore` if it contains real keys
- ✓ Use production secrets management for deployment
- ✓ Regenerate keys if accidentally exposed
- ✓ Monitor API usage regularly
- ✓ Use separate keys for dev/prod

### ❌ DON'T:
- ✗ Commit `config.js` with real API keys to public repositories
- ✗ Share your API key with others
- ✗ Paste API keys in chat or issue trackers
- ✗ Use the same key in multiple projects
- ✗ Leave test keys in production code

## File Structure

```
project/
├── index.html              # Main UI (loads config.js first)
├── app.js                  # Game logic (uses HARDCODED_API_KEY)
├── config.js               # ← Your API key goes here
├── .env.example            # Example configuration
├── .gitignore              # Prevents committing config.js
├── styles.css
└── README.md
```

## How It Works

### Flow with Hardcoded Key

```
1. Browser loads index.html
   ↓
2. Loads config.js (before app.js)
   CONFIG = { GEMINI_API_KEY: 'AIza...', USE_HARDCODED_KEY: true }
   ↓
3. Loads app.js
   Sets HARDCODED_API_KEY = 'AIza...' (from CONFIG)
   ↓
4. Landing page loads
   Shows message: "API key loaded from config"
   ↓
5. User clicks "Start Arguing ⚡"
   ✅ Uses API key automatically
   ✅ No input prompt needed
```

### Flow with Landing Page Input

```
1. Browser loads index.html
   ↓
2. Loads config.js (USE_HARDCODED_KEY: false)
   ↓
3. Loads app.js
   Sets HARDCODED_API_KEY = ''
   ↓
4. Landing page loads
   Shows API key input field
   ↓
5. User enters API key
   ↓
6. Clicks "Start Arguing ⚡"
   ✅ Uses entered API key
   ✅ Stores in localStorage
```

## Switching Between Options

### To Use Hardcoded Key:
```javascript
// config.js
const CONFIG = {
    GEMINI_API_KEY: 'AIza...your_actual_key...',
    USE_HARDCODED_KEY: true  // ← Change this to true
};
```

### To Use Landing Page Input:
```javascript
// config.js
const CONFIG = {
    GEMINI_API_KEY: '',
    USE_HARDCODED_KEY: false  // ← Change this to false
};
```

Then refresh the browser.

## Troubleshooting

### Problem: "No API key set"
**Cause**: API key is empty and USE_HARDCODED_KEY is true
**Solution**: 
1. Check config.js has your actual API key (not placeholder)
2. Verify `USE_HARDCODED_KEY: true`
3. Refresh browser (Ctrl+Shift+R for hard refresh)

### Problem: Landing page shows input field when I want hardcoded
**Cause**: `USE_HARDCODED_KEY` is set to false
**Solution**: Change to `true` in config.js

### Problem: API key not loading
**Cause**: config.js not loading before app.js
**Solution**:
1. Check index.html has `<script src="config.js"></script>` before `app.js`
2. Verify files are in same directory
3. Check browser console (F12) for errors

### Problem: "Invalid key format"
**Cause**: Key doesn't start with `AIza`
**Solution**:
1. Get new key from https://ai.google.dev/aistudio
2. Paste full key (copy-paste entire string)
3. Verify no spaces or extra characters

## Deployment

### For Development (Use Hardcoded Key)
```javascript
// config.js
const CONFIG = {
    GEMINI_API_KEY: 'AIza...your_dev_key...',
    USE_HARDCODED_KEY: true
};
```
- Easy to test locally
- Don't commit to repo if public

### For Production (Use Landing Page Input)
```javascript
// config.js
const CONFIG = {
    GEMINI_API_KEY: '',
    USE_HARDCODED_KEY: false
};
```
- Safe to commit to public repos
- Users provide their own API keys
- No sensitive data in code

### For Hosted/Enterprise (Advanced)
Use environment variables with a build process:
1. Create `.env` file (not committed)
2. Use a bundler to inject values
3. Deploy without keys in source code

## Advanced: Using Environment Variables

For advanced users with build tools (Webpack, Vite, etc.):

### Step 1: Install dotenv
```bash
npm install dotenv
```

### Step 2: Create .env file
```
VITE_GEMINI_API_KEY=AIza...your_key...
VITE_USE_HARDCODED_KEY=true
```

### Step 3: Update config.js
```javascript
const CONFIG = {
    GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY || '',
    USE_HARDCODED_KEY: import.meta.env.VITE_USE_HARDCODED_KEY === 'true'
};
```

## Quick Checklist

- [ ] Opened `config.js`
- [ ] Pasted your Gemini API key (from https://ai.google.dev/aistudio)
- [ ] Set `USE_HARDCODED_KEY: true`
- [ ] Saved `config.js`
- [ ] Opened `index.html` in browser
- [ ] Clicked "Start Arguing ⚡"
- [ ] ✅ Game started without asking for API key!

## FAQ

**Q: Where do I get my API key?**
A: https://ai.google.dev/aistudio/signup - Sign in and create an API key.

**Q: Is it safe to put my key in config.js?**
A: Safe locally. When deploying, use landing page input (USE_HARDCODED_KEY: false) or environment variables.

**Q: Can I use both hardcoded and landing page keys?**
A: No, only one method at a time. Set USE_HARDCODED_KEY to enable/disable.

**Q: What if I forget to add my key?**
A: Get a new one at https://ai.google.dev/aistudio - They're free to generate.

**Q: Can I change my key without editing code?**
A: Yes! Set USE_HARDCODED_KEY: false and enter key on landing page instead.

**Q: How do I clear my key?**
A: Edit config.js, set GEMINI_API_KEY to empty string '', or set USE_HARDCODED_KEY to false.

---

**Version**: 2.0 (Config Edition)  
**Last Updated**: April 2026
