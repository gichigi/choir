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
      businessName,
      yearFounded,
      businessDescription,
      targetAudience,
      companyValues,
      additionalInfo,
    } = await req.json();

    // Validate required fields
    if (!businessName || !businessDescription || !targetAudience || !companyValues) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create business summary
    const businessSummary = `${businessName}, founded in ${yearFounded || 'recent years'}, ${businessDescription.split('.')[0]}.`;

    // Construct the prompt for brand voice generation
    const prompt = `Generate a brand voice for ${businessName}, a company founded in ${yearFounded || 'recent years'}.
    
Business Description:
${businessDescription}

Target Audience:
${targetAudience}

Company Values:
${companyValues}

${additionalInfo ? `Additional Information:\n${additionalInfo}` : ''}

Based on the information above, create a brand voice with 3 distinct pillars. For each pillar, provide:
1. A name for the pillar
2. 3-4 bullet points explaining what this pillar means for the brand's communication
3. 3-4 bullet points explaining what this pillar does NOT mean
4. 2-3 examples of iconic brands that exemplify this pillar

Format the response as a JSON object with the following structure:
{
  "brandVoice": {
    "companyName": "${businessName}",
    "businessSummary": "A one-line summary of the business that captures its essence",
    "pillars": [
      {
        "name": "Pillar Name",
        "whatItMeans": ["Point 1", "Point 2", "Point 3", "Point 4"],
        "whatItDoesntMean": ["Point 1", "Point 2", "Point 3"],
        "iconicBrandInspiration": ["Brand 1 – brief explanation", "Brand 2 – brief explanation"]
      }
    ],
    "sampleBlogPost": "A sample blog post introduction (200-300 words) that demonstrates this brand voice in action."
  }
}`;

    // Make the API call to OpenAI
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a brand voice expert who helps companies develop distinctive and consistent communication styles.

Based on the information provided about the business, create a brand voice with 3 distinct pillars that capture the essence of their communication style and values. For each pillar:

1. Provide a clear, descriptive name for the pillar (like "Simplicity" or "Transparency")
2. Include 3-4 bullet points explaining what this pillar means for the brand's communication
3. Include 3 bullet points explaining what this pillar does NOT mean
4. Provide 2 examples of iconic brands that exemplify this pillar with brief explanations

Also include a concise one-line business summary that captures the essence of what the company does, who they serve, and what makes them special.

IMPORTANT: Your response must be valid JSON with the exact structure:
{
  "brandVoice": {
    "companyName": "Company Name", 
    "businessSummary": "One-line summary of the business",
    "pillars": [
      {
        "name": "Pillar Name",
        "whatItMeans": ["Point 1", "Point 2", "Point 3", "Point 4"],
        "whatItDoesntMean": ["Point 1", "Point 2", "Point 3"],
        "iconicBrandInspiration": ["Brand 1 – brief explanation", "Brand 2 – brief explanation"]
      }
    ],
    "sampleBlogPost": "A sample blog post introduction."
  }
}

Do not include any markdown formatting, just the JSON object.`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    // Extract and parse the generated brand voice
    const generatedContent = response.choices[0]?.message?.content;
    if (!generatedContent) {
      throw new Error('No content generated from OpenAI');
    }
    
    try {
      // Clean the response - sometimes OpenAI might include markdown code block formatting
      let cleanedContent = generatedContent;
      if (generatedContent.includes('```json')) {
        cleanedContent = generatedContent.replace(/```json\n|\n```/g, '');
      } else if (generatedContent.includes('```')) {
        cleanedContent = generatedContent.replace(/```\n|\n```/g, '');
      }
      
      console.log("API Response content:", cleanedContent);
      
      const brandVoice = JSON.parse(cleanedContent);
      
      // Validate the response structure
      if (!brandVoice.brandVoice || !brandVoice.brandVoice.pillars) {
        console.error("Invalid response structure:", brandVoice);
        throw new Error('Invalid response structure: missing brandVoice or pillars');
      }

      // Add fallback business summary if none was generated
      if (!brandVoice.brandVoice.businessSummary) {
        brandVoice.brandVoice.businessSummary = businessSummary;
      }

      const { pillars } = brandVoice.brandVoice;
      
      // Validate pillars
      if (!Array.isArray(pillars) || pillars.length !== 3) {
        throw new Error('Invalid pillars: expected array of 3 pillars');
      }

      // Validate each pillar's structure
      pillars.forEach((pillar, index) => {
        if (!pillar.name || !pillar.whatItMeans || !pillar.whatItDoesntMean || !pillar.iconicBrandInspiration) {
          throw new Error(`Invalid pillar structure at index ${index}`);
        }
        if (!Array.isArray(pillar.whatItMeans) || pillar.whatItMeans.length < 3) {
          throw new Error(`Invalid whatItMeans at pillar ${index}: expected at least 3 points`);
        }
        if (!Array.isArray(pillar.whatItDoesntMean) || pillar.whatItDoesntMean.length < 3) {
          throw new Error(`Invalid whatItDoesntMean at pillar ${index}: expected at least 3 points`);
        }
        if (!Array.isArray(pillar.iconicBrandInspiration) || pillar.iconicBrandInspiration.length < 2) {
          throw new Error(`Invalid iconicBrandInspiration at pillar ${index}: expected at least 2 examples`);
        }
      });

      return NextResponse.json(brandVoice);
    } catch (parseError: any) {
      console.error('Error parsing or validating response:', parseError);
      throw new Error(`Failed to parse OpenAI response: ${parseError.message}`);
    }
  } catch (error: any) {
    console.error('Error generating brand voice:', error);
    
    // Return a more specific error message if available
    const errorMessage = error.message || 'Failed to generate brand voice';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 