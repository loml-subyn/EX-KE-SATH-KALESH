# Closure.exe - Gemini API Integration Details

## Overview

Closure.exe has been redesigned to use **Google Gemini API** instead of OpenAI. This document explains the technical implementation.

## API Integration Changes

### Previous Implementation (OpenAI)
```javascript
// OLD - OpenAI Format
const CFG = {
    MODEL_MAIN: 'gpt-4o',
    API_URL: 'https://api.openai.com/v1/chat/completions',
    // ...
};

// Request Headers
headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
}

// Request Body
{
    model: 'gpt-4o',
    messages: [{ role: 'system', content: '...' }, ...],
    temperature: 0.85,
    max_tokens: 400,
    response_format: { type: 'json_object' }  // For JSON responses
}

// Response Format
data.choices[0].message.content  // Text response
```

### New Implementation (Gemini)
```javascript
// NEW - Gemini Format
const CFG = {
    MODEL_MAIN: 'gemini-2.0-flash',
    API_URL: 'https://generativelanguage.googleapis.com/v1beta/models',
    // ...
};

// Request URL
https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={apiKey}

// Request Headers
headers: {
    'Content-Type': 'application/json'
    // API key is in URL, not headers
}

// Request Body
{
    contents: [
        {
            role: 'user',
            parts: [{ text: 'System prompt...' }]
        },
        {
            role: 'model',
            parts: [{ text: 'Understood.' }]
        },
        // ... conversation history ...
    ],
    generationConfig: {
        temperature: 0.85,
        maxOutputTokens: 400,
    },
    safetySettings: [...]  // HARM_CATEGORY settings
}

// Response Format
data.candidates[0].content.parts[0].text  // Text response
```

## Key Differences Explained

### 1. Authentication
- **OpenAI**: Bearer token in `Authorization` header
- **Gemini**: API key in query string parameter `?key={apiKey}`

### 2. Message Format
- **OpenAI**: Linear `messages` array with `role` + `content`
- **Gemini**: `contents` array with alternating `role` (user/model) and `parts` array

**Important**: Gemini requires alternating user/model roles, so we:
1. Add system prompt as user message
2. Add acknowledgment as model message
3. Add actual conversation history

### 3. JSON Output
- **OpenAI**: Use `response_format: { type: 'json_object' }`
- **Gemini**: Gemini natively outputs JSON when instructed in system prompt
  - Our code still parses the response with `JSON.parse()`
  - Add JSON schema instructions in system prompts if needed

### 4. Safety Settings
Gemini's safety filters are ENABLED by default. We disable them to allow:
- Sarcastic/toxic content (for game simulation)
- Harsh language (for realistic argument simulation)

```javascript
safetySettings: [
    { category: 'HARM_CATEGORY_UNSPECIFIED', threshold: 'BLOCK_NONE' },
    { category: 'HARM_CATEGORY_DEROGATORY_LANGUAGE', threshold: 'BLOCK_NONE' },
    // ... all categories set to BLOCK_NONE
]
```

## Function: `callAI()`

The main API integration function in `app.js`:

```javascript
async function callAI(system, messages, model, json = false) {
    // 1. Validate API key
    // 2. Build Gemini-format contents array
    // 3. Construct request body with generationConfig
    // 4. Build API URL with model and key
    // 5. Fetch from Gemini API
    // 6. Parse response from candidates array
    // 7. JSON parse if needed
    // 8. Return text
}
```

### Parameters
- `system` (string): System prompt that defines AI behavior
- `messages` (array): Conversation history `[{ role, content }]`
- `model` (string): Model name ('gemini-2.0-flash')
- `json` (boolean): If true, response is parsed as JSON

### Returns
- String: AI response text or parsed JSON

### Error Handling
```javascript
if (res.status === 401)  // Invalid key
if (res.status === 403)  // Quota exceeded
if (res.status === 429)  // Rate limited
```

## System Prompts

Each system prompt ends with specific instructions:

### 1. Toxic Ex Prompt
- Defines toxic relationship behaviors
- Returns creative, sarcastic text responses
- No JSON required

### 2. Referee Prompt
- Instructs model to return ONLY valid JSON
- Includes JSON schema with expected fields
- Uses `json: true` parameter

### 3. Scanner Prompt
- Analyzes text for toxic patterns
- Returns `{ flags: [...] }` JSON array
- Uses `json: true` parameter

### 4. Hints Prompt
- Returns 3 comeback options as JSON
- Returns `{ highRoad, lowRoad, nuclear }`
- Uses `json: true` parameter

## Model Selection

### gemini-2.0-flash (Recommended)
- **Speed**: ~500ms average response time
- **Cost**: Cheapest per-token
- **Quality**: Excellent for game scenarios
- **Use Case**: Perfect for Closure.exe

### gemini-1.5-pro
- **Speed**: Slower
- **Cost**: More expensive
- **Quality**: Higher, more nuanced
- **Use Case**: If you want more sophisticated AI

### gemini-1.5-flash
- **Speed**: Fast
- **Cost**: Moderate
- **Quality**: Good
- **Use Case**: Older alternative

## Configuration: app.js

```javascript
// Line 13: Optional hardcoded key (development)
const HARDCODED_API_KEY = '';

// Lines 15-21: API Settings
const CFG = {
    MODEL_MAIN: 'gemini-2.0-flash',    // Primary model
    MODEL_FAST: 'gemini-2.0-flash',    // Quick analysis
    API_URL: 'https://generativelanguage.googleapis.com/v1beta/models',
    TOUCH_GRASS_MIN: 15,               // Salt threshold for warning
    MAX_DIGNITY: 5,                    // Initial dignity points
    REF_AUTO_HIDE: 8000,               // Hide referee after 8s
};
```

## Temperature & Token Settings

### Temperature
- **Text Responses**: `0.85` - Creative, varied, personality
- **JSON Analysis**: `0.3` - Deterministic, structured, accurate

### Max Tokens
- **Text**: `400` tokens (~300 words)
- **JSON**: `800` tokens (~600 words)

## Rate Limits & Quotas

### Free Tier (Default)
- 60 requests per minute
- Unlimited usage (with quota management)
- Reset rate limits after hitting 429

### Paid Tier
- Up to 1,500 requests per minute
- Pay-as-you-go pricing
- First $20/month free

### In Code
```javascript
if (res.status === 429) {
    throw new Error('Rate limited. Wait a moment and try again.');
}
```

## Testing the API

### Manual Test in Browser Console
```javascript
// Test API key validation
const apiKey = 'AIza...';
console.log(apiKey.startsWith('AIza')); // Should be true

// Test API call
const response = await callAI(
    'You are helpful.',
    [{ role: 'user', content: 'Hello' }],
    'gemini-2.0-flash'
);
console.log(response);
```

### Test with hardcoded key
1. Edit app.js line 13: `const HARDCODED_API_KEY = 'AIza...'`
2. Open index.html
3. Leave API key field empty
4. Click "Start Arguing"
5. Check console for errors

## Debugging

### Enable API logging
Already in code:
```javascript
console.log('[Closure.exe] Calling', model, json ? '(JSON)' : '');
console.log('[Closure.exe] Response OK');
console.error('[Closure.exe] API error:', res.status, msg);
```

### Check browser console
Press F12, go to Console tab to see:
- API calls being made
- Response status
- Error messages
- Stack traces

### Inspect Network requests
Press F12, go to Network tab to see:
- API request URL
- Request headers
- Request body (JSON)
- Response body (JSON)
- Response headers

## Potential Issues & Solutions

### Issue: "Invalid key format"
**Cause**: Key doesn't start with `AIza`
**Solution**: 
- Regenerate key in Google AI Studio
- Verify full key was copied

### Issue: "Empty API response"
**Cause**: Gemini returned empty content or different format
**Solution**:
- Check `data.candidates[0].content.parts[0].text` in debugger
- Verify model name is correct
- Try different model

### Issue: JSON parsing error
**Cause**: Response isn't valid JSON when `json: true`
**Solution**:
- Check system prompt includes JSON schema
- Increase max_tokens for complex responses
- Add `JSON.parse()` error handling

### Issue: Slow responses
**Cause**: Network or model latency
**Solution**:
- Model first request is slower (cold start)
- Subsequent requests are faster
- Consider using `gemini-2.0-flash` (faster)

### Issue: Different responses vs OpenAI
**Cause**: Different model behavior
**Solution**:
- Gemini 2.0 Flash has different tone
- Adjust system prompts for Gemini's style
- Both are good, just different personalities

## Migration from OpenAI to Gemini

### Changes Required
1. ✅ `callAI()` function - rewritten for Gemini API
2. ✅ `CFG` object - updated endpoints and models
3. ✅ System prompts - optional tuning for Gemini style
4. ✅ HTML - updated "Get API key" link
5. ✅ Error messages - updated for Gemini

### No Changes Required
- Game mechanics (scoring, UI)
- Chat display
- Audio effects
- localStorage storage
- CSS styling

## Performance Comparison

| Metric | OpenAI GPT-4o | Gemini 2.0 Flash |
|--------|---------------|------------------|
| First Response | 1-2s | 0.5-1s |
| Subsequent | 0.5-1s | 0.3-0.7s |
| Cost (M tokens) | ~15¢ | ~3.75¢ |
| Temperature | 0-2 | 0-2 |
| Max Tokens | Unlimited | Varies |
| Reasoning | Strong | Good |
| Speed | Moderate | Fast |

## API Endpoint Reference

### Generate Content (Main)
```
POST /v1beta/models/{model}:generateContent?key={API_KEY}
```

### Available Models
- `gemini-2.0-flash`
- `gemini-1.5-pro`
- `gemini-1.5-flash`
- `gemini-pro`

### Request Body Schema
```javascript
{
    contents: [
        {
            role: 'user' | 'model',
            parts: [{ text: string }]
        }
    ],
    generationConfig: {
        temperature: 0-2,
        maxOutputTokens: number,
        topP: 0-1,
        topK: 1+
    },
    safetySettings: [
        {
            category: string,
            threshold: 'BLOCK_ALL' | 'BLOCK_MOST_SAFE' | 'BLOCK_SOME_SAFE' | 'BLOCK_NONE'
        }
    ]
}
```

### Response Schema
```javascript
{
    candidates: [
        {
            content: {
                parts: [{ text: string }]
            },
            finishReason: string,
            index: number
        }
    ],
    usageMetadata: {
        promptTokenCount: number,
        candidatesTokenCount: number,
        totalTokenCount: number
    }
}
```

## Cost Estimation

Free tier: **60 requests/min**, unlimited data

Each game round = 2 API calls:
1. **Toxic Ex response** (~400 output tokens, ~50 input tokens)
2. **Referee scoring** (~300 output tokens, ~100 input tokens)

**Per round cost** (Pay as you go):
- Input: ~150 tokens × $0.075/M = ~$0.00001125
- Output: ~700 tokens × $0.3/M = ~$0.00021
- **Total: ~$0.00022 per round (~$0.22 per 1000 rounds)**

Free tier: Up to ~30 rounds/min before hitting rate limit

## Future Improvements

- [ ] Streaming responses for faster perceived speed
- [ ] Token counting API to predict costs
- [ ] System instruction caching (coming to Gemini API)
- [ ] Custom models via model tuning
- [ ] Multi-turn conversation optimization
- [ ] Analytics integration

---

**For more**: https://ai.google.dev/docs
