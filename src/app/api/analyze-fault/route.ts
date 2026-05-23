import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageUrl, description } = body;

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API key not configured.' }, { status: 500 });
    }

    // Fetch the image from the provided URL (Firebase Storage download URL)
    const imageResp = await fetch(imageUrl);
    if (!imageResp.ok) {
        throw new Error('Failed to fetch image from URL');
    }
    const arrayBuffer = await imageResp.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = imageResp.headers.get('content-type') || 'image/jpeg';

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are an expert infrastructure and civil engineering AI assessor for Osun State Government.
Analyze the provided image of a reported civic fault (and the citizen's description: "${description || 'None provided'}").

Determine:
1. Is this a verified, legitimate infrastructure fault?
2. What is the urgency score on a scale of 1 to 10? (10 being life-threatening or severe infrastructure failure like a collapsed bridge or exposed high-voltage wires, 1 being minor aesthetic issues).
3. A short, professional title for the issue.
4. A brief explanation of your assessment.

Format your response strictly as JSON without any markdown formatting:
{
  "isVerifiedFault": true/false,
  "urgencyScore": <number 1-10>,
  "aiTitle": "<string>",
  "aiAnalysis": "<string>"
}`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: buffer.toString('base64'),
          mimeType
        }
      }
    ]);

    const text = result.response.text().replace(/```json\n?|\n?```/g, '').trim();
    const parsed = JSON.parse(text);

    return NextResponse.json(parsed);

  } catch (err: any) {
    console.error('[Analyze Fault API Error]', err);
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 });
  }
}
