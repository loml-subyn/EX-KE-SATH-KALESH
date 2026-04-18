# Closure.exe - Powered by Google Gemini

Win the argument you never had. A gamified AI argument simulator powered by **Google Gemini AI**.

## 🚀 Quick Start

### 1. Get a Gemini API Key
- Go to [Google AI Studio](https://ai.google.dev/aistudio/signup)
- Sign in with your Google account
- Create a new API key
- Copy the key (starts with `AIza`)

### 2. Run the App
- Open `index.html` in your web browser
- Paste your Gemini API key on the landing page
- Click "Start Arguing ⚡"

### 3. Play the Game
- Type your argument messages against your AI-simulated toxic ex
- The AI referee scores your emotional maturity, gaslighting resistance, and pettiness
- Accumulate salt 🧂 and work towards closure
- Try different comeback styles: high road, low road, or nuclear

## 🤖 Gemini API Integration

This project uses **Google's Gemini 2.0 Flash** model for:
- **Toxic Ex Response**: Realistic, sarcastic responses that simulate toxic relationship dynamics
- **AI Referee**: Scores your arguments on multiple dimensions
- **Red Flag Scanner**: Detects toxic communication patterns
- **Hint Generator**: Provides comeback suggestions

### API Configuration
- **Model**: `gemini-2.0-flash` (fast, intelligent, and cost-effective)
- **Endpoint**: `https://generativelanguage.googleapis.com/v1beta/models`
- **Temperature**: 0.85 for creative replies, 0.3 for structured JSON analysis
- **Safety Settings**: All HARM_CATEGORY thresholds set to BLOCK_NONE for parody game mechanics

### Key Features
✅ Real-time API responses  
✅ No backend server required (client-side API calls)  
✅ Automatic API key storage in browser localStorage  
✅ Error handling with user-friendly messages  
✅ Rate limit handling  

## 📊 Game Mechanics

### Scoreboard Stats
- **🛡 Gaslight Resistance**: How well you resist manipulation (0-100)
- **😈 Savagery**: How devastating your comebacks are (1-10)
- **🧠 Emotional Maturity**: Quality of your responses (1-10)
- **🧂 Salt Level**: Overall toxicity accumulated (0-100%)
- **💔 Closure Progress**: Journey to closure (0-60)
- **💎 Dignity**: Lives remaining (0-5)

### Features
- **Red Flag Scanner**: Paste messages to detect toxic patterns
- **Comeback Hints**: Get suggestions (high road, low road, nuclear)
- **Hall of Shame**: Track your best (worst?) moments
- **Export**: Screenshot your scoreboard

## 🛠️ Project Structure

```
├── index.html       # Main UI with landing page and game board
├── app.js          # Game logic and Gemini API integration
├── styles.css      # Dark mode minimalist styling
└── README.md       # This file
```

## 📝 System Prompts

### Toxic Ex Persona
- Never takes accountability
- Uses gaslighting, DARVO, and love-bombing
- Deflects with passive-aggressive comments
- Goes cold when losing ("K", one-word replies)

### AI Referee
Rates arguments on:
- Savage Factor (1-10)
- Emotional Maturity (1-10)
- Gaslight Resistance (0-100)
- Pettiness Multiplier (1.0-5.0)
- Dignity Penalty (0 to -50)
- Closure Progress (0-10)
- Logical Fallacy Detection

### Red Flag Scanner
Detects:
- Gaslighting
- DARVO (Deny, Attack, Reverse Victim & Offender)
- Love-bombing
- Stonewalling
- Guilt-tripping
- Blame-shifting
- Passive aggression

## 🎨 Design

- **Dark Mode**: Sleek dark UI optimized for long play sessions
- **Minimalist**: Clean, distraction-free interface
- **Responsive**: Works on desktop and mobile
- **Sound Effects**: Web Audio API for retro-style sounds (mutable)

## ⚙️ Advanced Configuration

### Hardcode API Key (optional)
Edit `app.js` line 13:
```javascript
const HARDCODED_API_KEY = 'AIza...';  // Your Gemini API key
```
This overrides the landing page input and is useful for demos/testing.

### Customize Models
Edit `app.js` lines 15-16:
```javascript
const CFG = {
    MODEL_MAIN: 'gemini-2.0-flash',   // For complex responses
    MODEL_FAST: 'gemini-2.0-flash',   // For quick analysis
    // ... other config
};
```

### Adjust Game Parameters
In `CFG` object:
- `TOUCH_GRASS_MIN`: Minimum salt before suggestion to touch grass
- `MAX_DIGNITY`: Starting dignity points
- `REF_AUTO_HIDE`: Auto-hide referee card after X milliseconds

## 🔐 Security & Privacy

- **Client-side Only**: Your API key is used directly in the browser
- **localStorage**: API key is saved to browser localStorage for convenience
- **No Backend**: No data sent to any server except Google's Gemini API
- **Your Data**: Arguments are only stored in your browser session

## ⚠️ API Rate Limits

Google Gemini API has free tier limits:
- Check your usage at [Google AI Studio](https://ai.google.dev/)
- Implement delays between messages if hitting limits
- Consider upgrading to paid tier for higher limits

## 🐛 Troubleshooting

### "Invalid API Key"
- Verify key starts with `AIza`
- Check you copied the full key from Google AI Studio
- Ensure no extra spaces or characters

### "Network Error"
- Check internet connection
- Verify Google's API servers are accessible
- Try clearing browser cache

### "Empty API Response"
- Model might be overloaded
- Try again in a few seconds
- Check Gemini API status page

### "Rate Limited (429)"
- Wait a few seconds and retry
- Consider spacing out rapid requests
- Upgrade to paid tier for higher quotas

## 📦 Technologies

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **AI API**: Google Gemini 2.0 Flash
- **Audio**: Web Audio API
- **Storage**: Browser localStorage
- **Fonts**: Google Fonts (Inter, JetBrains Mono)

## 🎮 Tips for Better Scores

1. **High Road**: Mature, boundary-setting responses = +20 emotional maturity
2. **Low Road**: Petty but witty = +25 savage factor
3. **Gaslight Resistance**: Call out manipulation directly
4. **Closure**: Focus on personal growth, not winning
5. **Mute**: Hit 🔊 to disable sound effects
6. **Screenshot**: Export your best moments with 📸

## 📄 License

This project is for entertainment purposes. Use responsibly!

## 🙏 Credits

- **UI/UX**: Minimalist dark design
- **AI**: Powered by [Google Gemini](https://ai.google.dev/)
- **Sound**: Web Audio API synthesis
- **Fonts**: Google Fonts

---

**Made with 💔 and AI**

For Gemini API documentation: https://ai.google.dev/
