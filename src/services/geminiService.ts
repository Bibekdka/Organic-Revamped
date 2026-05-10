import { GoogleGenAI } from "@google/genai";

let genAI: GoogleGenAI | null = null;

/**
 * Lazy initialization of the Gemini AI client.
 * This prevents crashes if the API key is temporarily missing on startup.
 */
async function getAI() {
  if (!genAI) {
    // Note: The platform provides GEMINI_API_KEY in the process.env context.
    const apiKey = (process.env.GEMINI_API_KEY as string);
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined. Please check your AI Studio settings.");
    }
    genAI = new GoogleGenAI(apiKey);
  }
  return genAI;
}

/**
 * Generates nutritional and culinary tips for a specific product.
 */
export async function getProductTips(productName: string) {
  const prompt = `You are an expert organic farm chef and nutritionist for "Organic-O-Eats". 
  A customer is looking at "${productName}". 
  Provide 3 short, punchy, and inspiring bullet points on:
  1. A unique cooking tip or recipe idea.
  2. A surprising nutritional benefit.
  3. A seasonal pairing suggestion.
  Return as a clean list. Stay on brand: premium, nature-focused, healthy.`;

  try {
    const ai = await getAI();
    // Using gemini-1.5-flash for fast and efficient content generation
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Content Generation Error:", error);
    // Fallback content to maintain UX even if API fails
    return "Nurturing your health with nature's best harvest. These products are curated for maximum vitality and purely organic integrity.";
  }
}

/**
 * Recommends organic items based on user health goals.
 */
export async function getHealthConsultant(goal: string) {
  const prompt = `A user of our organic farm platform is interested in: "${goal}". 
  Recommend 3 organic items from categories like Vegetables, Fruits, Dairy, Seeds, Honey, Herbs.
  Be inspiring and technically accurate about the health benefits.
  Format as concise paragraphs.`;

  try {
    const ai = await getAI();
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Consultation Error:", error);
    return null;
  }
}
