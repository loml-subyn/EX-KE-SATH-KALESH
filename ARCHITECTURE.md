# Closure.exe - Project Architecture (Gemini Edition)

## Project Overview

**Closure.exe** is a gamified AI argument simulator that uses **Google Gemini API** to roleplay a toxic ex-partner and score your argument responses.

### Key Stats
- **Framework**: Vanilla JavaScript (no frameworks)
- **AI Engine**: Google Gemini 2.0 Flash
- **Architecture**: Client-side only (no backend server)
- **Lines of Code**: ~1500 (app.js)
- **Entry Point**: `index.html`

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser (Client-Side)                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐                                           │
│  │  index.html  │ ← User Interface (Views)                  │
│  └──────────────┘                                           │
│         ↓                                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              app.js (Game Logic)                     │   │
│  │  • Game State Management (S object)                  │   │
│  │  • UI Event Handlers                                 │   │
│  │  • Gemini API Integration (callAI)                   │   │
│  │  • Scoring System                                    │   │
│  └──────────────────────────────────────────────────────┘   │
│         ↓                                                   │
│  ┌──────────────┐                                           │
│  │ styles.css   │ ← Styling & Themes                        │
│  └──────────────┘                                           │
│         ↓                                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Web Audio API (Sound Effects)                │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
         ↕ HTTPS
┌─────────────────────────────────────────────────────────────┐
│           Google Gemini API (External Service)              │
│  https://generativelanguage.googleapis.com/v1beta/models    │
└─────────────────────────────────────────────────────────────┘
```

## File Structure

```
project/
│
├── index.html                    # Main UI HTML
│   ├── Landing page (API key input)
│   ├── Game page (chat + scoreboard)
│   ├── Scanner page (red flag detector)
│   └── Hall of Shame (high scores)
│
├── app.js                        # Game engine (~1500 lines)
│   ├── Configuration (CFG, PROMPTS)
│   ├── State Management (S object)
│   ├── Audio synthesis (Audio object)
│   ├── Gemini API calls (callAI function)
│   ├── Game mechanics (send, referee, scoring)
│   ├── UI rendering
│   └── Event handlers
│
├── styles.css                    # Styling & dark theme
│   ├── Landing page styles
│   ├── Game page styles
│   ├── Components (buttons, cards, etc.)
│   └── Animations & effects
│
├── README.md                     # Quick start guide
├── SETUP.md                      # Detailed API setup
├── API_INTEGRATION.md            # Technical API details
└── ARCHITECTURE.md               # This file
```

## State Management (S Object)

All game state is stored in a single `S` object:

```javascript
const S = {
    apiKey: '',                  // User's Gemini API key
    messages: [],                // All messages in session
    chatHistory: [],             // Chat format for API
    scores: {                    // Scoring metrics
        gaslightResistance: 0,   // How well you resist manipulation
        pettinessMultiplier: 1,  // Toxic behavior multiplier
        closureProgress: 0,      // Journey to closure
        dignityPenalty: 0,       // Damage taken
        totalScore: 0,           // Overall score
        savageFactor: 0,         // Roast level
        emotionalMaturity: 0     // Maturity level
    },
    dignity: 5,                  // Lives remaining (0-5)
    salt: 0,                     // Toxicity level (0-100)
    round: 0,                    // Current round number
    sessionStart: null,          // When game started
    timer: null,                 // Timer reference
    grassShown: false,           // "Touch grass" shown?
    busy: false,                 // API call in progress?
    muted: false,                // Sound enabled?
    discAccepted: false,         // Disclaimer accepted?
    refTimer: null               // Referee card timer
};
```

## Game Flow

```
┌─ Start: index.html loads
│
├─ Landing Page (landing view)
│  ├─ User enters Gemini API key
│  └─ Click "Start Arguing ⚡"
│
├─ Game Initialization
│  ├─ Validate API key (starts with AIza)
│  ├─ Initialize game state (S)
│  └─ Show game view
│
├─ Game Loop (Repeat)
│  │
│  ├─ User types message
│  │
│  ├─ Click "Send" or press Enter
│  │
│  ├─ Add user message to chat display
│  │
│  ├─ Show "typing..." indicator
│  │
│  ├─ Call Gemini API (1st call)
│  │  └─ System: Toxic Ex persona
│  │  └─ Model: gemini-2.0-flash
│  │  └─ Response: Sarcastic reply
│  │
│  ├─ Display AI response
│  │
│  ├─ Call Gemini API (2nd call) - Non-blocking
│  │  └─ System: AI Referee persona
│  │  └─ Model: gemini-2.0-flash
│  │  └─ Response: JSON scores
│  │
│  ├─ Update scoreboard
│  │  ├─ Add to gaslight resistance
│  │  ├─ Adjust pettiness multiplier
│  │  ├─ Update closure progress
│  │  ├─ Apply dignity penalties
│  │  └─ Calculate total score
│  │
│  ├─ Play sound effects
│  │
│  ├─ Show/hide referee card
│  │
│  └─ Repeat
│
├─ Game End (Click "Back")
│  ├─ Save scores to localStorage
│  ├─ Return to landing page
│  └─ Show final stats
│
└─ End: Player exits
```

## Core Components

### 1. Gemini API Integration (`callAI`)

Handles all communication with Google Gemini API:

```javascript
async callAI(system, messages, model, json = false)
  ├─ Validate API key
  ├─ Build Gemini request format
  ├─ Send HTTPS POST to Gemini API
  ├─ Handle errors (401, 403, 429)
  ├─ Parse response
  ├─ JSON parse if needed
  └─ Return text or object
```

**Key Features**:
- Automatic retry logic with error messages
- JSON parsing for structured responses
- Safety settings disabled for game content
- Temperature control (0.85 for text, 0.3 for JSON)

### 2. Chat System

Manages message display and interaction:

```javascript
send()                   ← User clicks send
  ├─ Get message text
  ├─ Add to local state
  ├─ Display in chat UI
  ├─ Show typing indicator
  ├─ Call Gemini API (Toxic Ex)
  ├─ Display response
  └─ Call Gemini API (Referee)

addMsg(role, text)       ← Add message to state & display
renderBubble()           ← Display single message bubble
showTyping()             ← Show "typing..." animation
hideTyping()             ← Hide typing indicator
scrollChat()             ← Auto-scroll to latest message
```

### 3. Scoring System

Calculates game score from API responses:

```javascript
referee(userMsg, exMsg)  ← Get scores from Gemini Referee
  ├─ Call Gemini API with referee prompt
  └─ Parse JSON response

applyScores(scores)      ← Apply scores to game state
  ├─ Add gaslight resistance
  ├─ Update pettiness multiplier
  ├─ Increase closure progress
  ├─ Apply dignity penalties
  ├─ Calculate total score
  ├─ Update salt level
  ├─ Play appropriate sound
  └─ Update UI

updateUI()               ← Refresh all visual elements
  ├─ Update stat values
  ├─ Update progress bars
  ├─ Update visual indicators
  └─ Show animations
```

### 4. UI System

Renders views and handles interactions:

```javascript
Views:
  ├─ #landing       ← API key input & start button
  ├─ #game          ← Main game board
  ├─ #scanner       ← Red flag analyzer
  └─ #hall          ← High scores

Navigation:
  go(viewId)        ← Switch between views

Interactions:
  ├─ #btn-send      ← Send message
  ├─ #btn-hint      ← Get comeback hints
  ├─ #btn-mute      ← Toggle sound
  ├─ #btn-export    ← Screenshot scoreboard
  ├─ #btn-back      ← Return to landing
  ├─ #toggle-key    ← Show/hide API key
  └─ #start-btn     ← Start game
```

### 5. Audio System

Web Audio API for sound effects:

```javascript
Audio object
  ├─ init()         ← Create AudioContext
  ├─ play(type)     ← Play sound effect
  ├─ _send()        ← Send button sound
  ├─ _ding()        ← Positive response
  ├─ _shatter()     ← Dignity loss
  ├─ _glitch()      ← Error sound
  └─ _victory()     ← Win sound
```

## API Flow Details

### Normal Request Flow

```
User Input
    ↓
send() function
    ↓
Validate input
    ↓
Add to chat display
    ↓
Show typing indicator
    ↓
callAI(PROMPTS.ex, history, 'gemini-2.0-flash')
    ├─ Format Gemini request
    ├─ Send to API
    └─ Return text response
    ↓
Display AI response
    ↓
referee() function (non-blocking)
    ├─ callAI(PROMPTS.referee, ..., true)  // json=true
    └─ applyScores() and showRef()
    ↓
Update scoreboard
    ↓
Play sounds
    ↓
User can send again
```

### Error Handling Flow

```
callAI() throws error
    ↓
catch (e)
    ├─ hideTyping()
    ├─ toast('⚠️ ' + error message)
    ├─ Log to console
    └─ Reset UI
    ↓
User can retry
```

## System Prompts

Each game feature has a specific Gemini prompt:

### 1. Toxic Ex Persona
```
"You are the user's toxic ex-partner in a parody argument simulator.
 Rules:
 - Never take accountability
 - Keep responses to 1-3 sentences max
 - Deflect or bring up past issues
 - Use passive-aggressive emojis
 - Classic tactics: DARVO, minimizing, gaslighting
 - Sometimes love-bomb: 'you know I still care right? 🥺'
 - Never break character"
```

**Used by**: `send()` function  
**Model**: `gemini-2.0-flash`  
**Output**: Text response (~400 tokens)

### 2. AI Referee
```
"You are the AI Referee in 'Closure.exe', rating arguments.
 
 Return ONLY valid JSON:
 {
   "savageFactor": <1-10>,
   "emotionalMaturity": <1-10>,
   "gaslightResistance": <0-100>,
   "pettinessMultiplier": <1.0-5.0>,
   "dignityPenalty": <0 to -50>,
   "closureProgress": <0-10>,
   "commentary": "<snarky 2-sentence commentary>",
   "fallacy": "<logical fallacy or null>"
 }"
```

**Used by**: `referee()` function  
**Model**: `gemini-2.0-flash`  
**Output**: JSON object

### 3. Red Flag Scanner
```
"Analyze pasted messages for toxic communication patterns.
 Return ONLY JSON:
 {
   "flags": [
     {
       "text": "<exact toxic phrase>",
       "reason": "<1-2 sentence explanation>",
       "severity": "yellow|red|marinara"
     }
   ]
 }
 Look for: gaslighting, DARVO, love-bombing, stonewalling,
 guilt-tripping, blame-shifting, passive aggression, controlling."
```

### 4. Hint Generator
```
"Based on conversation context, generate 3 comeback options.
 Return ONLY JSON:
 {
   "highRoad": "<mature, boundary-setting, 1-2 sentences>",
   "lowRoad": "<petty but devastating, 1-2 sentences>",
   "nuclear": "<nuclear option, max 1 sentence or even 'K.'>"
 }"
```

## Configuration Points

### app.js Lines 13-21
```javascript
const HARDCODED_API_KEY = '';  // Line 13

const CFG = {
    MODEL_MAIN: 'gemini-2.0-flash',     // Line 16
    MODEL_FAST: 'gemini-2.0-flash',     // Line 17
    API_URL: 'https://generativelanguage.googleapis.com/v1beta/models',  // Line 18
    TOUCH_GRASS_MIN: 15,                // Line 19
    MAX_DIGNITY: 5,                     // Line 20
    REF_AUTO_HIDE: 8000,                // Line 21
};
```

### Customizable
- `MODEL_MAIN` / `MODEL_FAST`: Change model
- `TOUCH_GRASS_MIN`: Salt threshold for "touch grass" warning
- `MAX_DIGNITY`: Starting dignity (lives)
- `REF_AUTO_HIDE`: How long referee card stays visible
- `PROMPTS` object: System prompts (lines 24-...)

## Performance Characteristics

### Request Times (Typical)
- **First API call**: 0.5-1.5 seconds
- **Subsequent calls**: 0.3-0.8 seconds
- **Total round time**: 0.5-2 seconds

### Storage
- **localStorage**: ~1KB API key + ~5KB scores per session
- **RAM**: ~2-5MB for full game session

### Network
- **Requests**: 2 per round (1 for ex, 1 for referee)
- **Payload**: ~500 bytes per request
- **Response**: ~100-500 bytes

### Tokens (Per Round)
- **Input**: ~150 tokens (history + prompts)
- **Output**: ~700 tokens (responses)
- **Total**: ~850 tokens per round

## Security Architecture

```
┌─────────────────────────────────────────┐
│      Browser (Client-Side)              │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │   API Key (in memory only)      │   │
│  │   - Validated locally           │   │
│  │   - Never sent to 3rd parties   │   │
│  │   - Optional localStorage save  │   │
│  └─────────────────────────────────┘   │
│           ↓ HTTPS Encrypted            │
│  ┌─────────────────────────────────┐   │
│  │  Request/Response Encrypted     │   │
│  │  - API key in URL (HTTPS)       │   │
│  │  - Conversation data encrypted  │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│   Google's Secure Infrastructure        │
│   - Gemini API servers                  │
│   - SSL/TLS termination                 │
│   - Data handling per Google policy     │
└─────────────────────────────────────────┘
```

## Differences from OpenAI Version

### Before (OpenAI)
- API: `https://api.openai.com/v1/chat/completions`
- Model: `gpt-4o` or `gpt-4o-mini`
- Auth: Bearer token in header
- Format: OpenAI chat format

### After (Gemini)
- API: `https://generativelanguage.googleapis.com/v1beta/models`
- Model: `gemini-2.0-flash`
- Auth: API key in URL
- Format: Gemini content format
- **New Features**:
  - Faster response times
  - Lower cost per token
  - Same game mechanics

### No Changes
- Game logic
- UI/UX
- Scoring system
- Audio effects
- User experience

## Future Expansion Points

1. **Streaming Responses**: Use Gemini's streaming API for real-time text
2. **Vision**: Add image analysis for toxic screenshots
3. **Voice**: TTS/STT for voice arguments
4. **Multiplayer**: Real-time arguments with other players
5. **Leaderboard**: Cloud storage for high scores
6. **Customization**: User-created argument scenarios
7. **Analytics**: Track argument patterns and growth

---

**Document Version**: 2.0 (Gemini Edition)  
**Last Updated**: April 2026
