let genAI: any = null;

async function getAI() {
  if (!genAI) {
    const { GoogleGenAI } = await import("@google/genai");
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined");
    }
    genAI = new GoogleGenAI({ apiKey });
  }
  return genAI;
}

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
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Nurturing your health with nature's best selects. Our products are harvested at peak ripeness for maximum vitality.";
  }
}

export async function getHealthConsultant(goal: string) {
  const prompt = `A user of our organic farm platform "${goal}". 
  Recommend 3 organic items from categories like Vegetables, Fruits, Dairy, Seeds, Honey, Herbs.
  Be inspiring and technical about the health benefits.`;

  try {
    const ai = await getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error(error);
    return null;
  }
}
