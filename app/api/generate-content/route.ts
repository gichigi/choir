import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not defined in environment variables');
  }
  return new OpenAI({ apiKey });
};

export async function POST(req: Request) {
  try {
    // Check if OpenAI API key is available
    const openai = getOpenAIClient();
    
    const {
      brandVoice,
      contentType,
      topic,
      targetAudience,
      readingLevel,
      tone,
      length,
      additionalInstructions,
    } = await req.json();

    // Validate required fields
    if (!brandVoice || !contentType || !topic) {
      return NextResponse.json(
        { error: 'Missing required fields: brandVoice, contentType, and topic are required' },
        { status: 400 }
      );
    }

    // Construct the prompt for content generation
    const prompt = `Generate ${contentType} content about ${topic}.
    
Brand Voice:
${JSON.stringify(brandVoice, null, 2)}

Target Audience:
${targetAudience || 'Not specified'}

Content Requirements:
- Reading Level: ${readingLevel || 'Not specified'}
- Tone: ${tone || 'Not specified'}
- Length: ${length || 'Not specified'}

${additionalInstructions ? `Additional Instructions:\n${additionalInstructions}` : ''}

The content should fully embody the brand voice described above while focusing on the topic "${topic}".`;

    // Make the API call to OpenAI
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an expert content creator who specializes in writing in a brand's unique voice. You've been given a brand voice guide with specific pillars and examples.

Your task is to generate content that perfectly matches this brand voice while maintaining:
1. The exact tone, style, and personality described in the brand voice pillars
2. The appropriate level of formality, humor, and technical detail
3. Consistency with "What It Means" guidelines while avoiding "What It Doesn't Mean" pitfalls

When generating content:
- Begin by analyzing the brand voice pillars to understand the core communication style
- Incorporate elements from all pillars in a balanced way
- Use sentence structure, word choice, and pacing that reflects the brand's personality
- Maintain the appropriate reading level for the target audience
- Include any specific content elements requested (calls to action, product details, etc.)
- Ensure factual accuracy while maintaining the brand's distinctive style

The content should feel authentic to the brand and immediately recognizable as belonging to them, not generic or interchangeable with competitors.

If given specific instructions about content length, format, or purpose, prioritize those requirements while staying true to the brand voice.`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    // Extract the generated content
    const generatedContent = response.choices[0]?.message?.content;
    if (!generatedContent) {
      throw new Error('No content generated from OpenAI');
    }
    
    return NextResponse.json({ content: generatedContent });
  } catch (error: any) {
    console.error('Error generating content:', error);
    
    // Return a more specific error message if available
    const errorMessage = error.message || 'Failed to generate content';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 