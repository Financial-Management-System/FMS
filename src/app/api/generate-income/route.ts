import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Prompt is required' },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

    const systemPrompt = `You are a financial data extraction assistant. Extract income information from the user's description and return it as a JSON object with the following fields:
- source: string (the income source/title)
- category: string (one of: Sales, Services, Investment, Grant, Donation, Other)
- amount: number (the numeric amount without currency symbols)
- currency: string (currency code like USD, EUR, etc.)
- description: string (detailed description of the income)
- receivedDate: string (date in YYYY-MM-DD format, use today's date if not specified: ${new Date().toISOString().split('T')[0]})
- invoiceNumber: string (invoice/reference number if mentioned, otherwise empty string)
- client: string (client or payer name)

IMPORTANT: Return ONLY valid JSON. No markdown, no explanation, no code blocks. Just the raw JSON object.

User's description: ${prompt}`;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const text = response.text();

    // Try to extract JSON from the response
    let jsonText = text.trim();
    
    // Remove markdown code blocks if present
    jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    // Parse the JSON
    const incomeData = JSON.parse(jsonText);

    // Validate required fields
    const requiredFields = ['source', 'category', 'amount', 'currency', 'description', 'client'];
    const missingFields = requiredFields.filter(field => !incomeData[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Set defaults for optional fields
    incomeData.receivedDate = incomeData.receivedDate || new Date().toISOString().split('T')[0];
    incomeData.invoiceNumber = incomeData.invoiceNumber || '';

    return NextResponse.json({
      success: true,
      data: incomeData
    });

  } catch (error: any) {
    console.error('Gemini API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate income data' },
      { status: 500 }
    );
  }
}
