# Gemini API Integration for Income Form Generation

## Setup Instructions

### 1. Get Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Get API Key" or "Create API Key"
4. Copy your API key

### 2. Configure Environment Variable
1. Create or update `.env.local` file in the project root
2. Add your Gemini API key:
```
GEMINI_API_KEY=your_actual_api_key_here
```

### 3. Restart Development Server
After adding the API key, restart your dev server:
```bash
npm run dev
```

## How It Works

### User Flow
1. **User clicks "Add Income"** → Opens AI prompt dialog
2. **User describes income** in natural language
   - Example: "Monthly subscription revenue of $5,000 from Enterprise clients, received on January 15, 2026"
3. **Clicks "Generate Form"** → Sends prompt to Gemini API
4. **AI processes the description** and extracts structured data
5. **Form auto-fills** with the extracted information
6. **User reviews and submits** the pre-filled form

### Technical Implementation

#### API Route: `/api/generate-income`
- **Location**: `src/app/api/generate-income/route.ts`
- **Method**: POST
- **Input**: `{ prompt: string }`
- **Output**: 
```json
{
  "success": true,
  "data": {
    "source": "Subscription Revenue",
    "category": "Sales",
    "amount": 5000,
    "currency": "USD",
    "description": "Monthly subscription revenue from Enterprise clients",
    "receivedDate": "2026-01-15",
    "invoiceNumber": "",
    "client": "Enterprise clients"
  }
}
```

#### Components Updated
1. **AddIncomeForm** (`addIncomeForm.tsx`)
   - Added loading state (`isGenerating`)
   - Added AI-generated data state (`generatedData`)
   - Calls `/api/generate-income` endpoint
   - Passes generated data to FormDialog

2. **FormDialog** (`formDialog.tsx`)
   - Added `useEffect` to watch `defaultValues` changes
   - Resets form with new values when AI data arrives

### Features
- ✅ Natural language processing via Gemini API
- ✅ Automatic field extraction and validation
- ✅ Loading state with spinner during generation
- ✅ Error handling with toast notifications
- ✅ Pre-filled form for user review
- ✅ Secure API key handling (server-side only)

## Example Prompts

### Good Examples
```
"Received $10,000 from Acme Corp for consulting services on January 20, 2026. Invoice #INV-2026-001"

"Monthly SaaS subscription revenue of $2,500 from TechStart Inc, paid via bank transfer"

"Grant of $50,000 from Innovation Foundation for research project, received on 2026-01-10"

"Investment income: $15,000 dividend from stock portfolio, received January 15"
```

### What Gets Extracted
- **source**: Income source/title
- **category**: Sales, Services, Investment, Grant, Donation, or Other
- **amount**: Numeric value (without currency symbol)
- **currency**: USD, EUR, etc.
- **client**: Payer name
- **receivedDate**: Date in YYYY-MM-DD format
- **invoiceNumber**: Reference number (if mentioned)
- **description**: Full description

## Troubleshooting

### API Key Not Working
- Ensure `.env.local` exists in project root
- Verify no spaces around the `=` sign
- Restart development server after adding key
- Check API key is valid at [Google AI Studio](https://makersuite.google.com/app/apikey)

### Generation Fails
- Check browser console for errors
- Verify API key in `.env.local`
- Ensure prompt is clear and descriptive
- Check network tab for API response details

### Form Not Pre-filling
- Verify FormDialog `useEffect` is working
- Check that `generatedData` state is set
- Ensure field names match exactly

## Security Notes
- ✅ API key stored in environment variables (never in client code)
- ✅ API calls happen server-side only
- ✅ Client never sees the API key
- ✅ Rate limiting and error handling implemented
