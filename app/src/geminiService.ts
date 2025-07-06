const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

export const generateAssessment = async (textContent: string): Promise<{ detailedSummary: string, impactAssessment: string }> => {
  const prompt = `
    Based on the following text, please provide a detailed summary and an impact assessment.
    Return the response as a JSON object with two keys: "detailedSummary" and "impactAssessment".

    Text:
    ---
    ${textContent}
    ---
  `;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          response_mime_type: "application/json",
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const responseText = data.candidates[0].content.parts[0].text;
    return JSON.parse(responseText);
  } catch (error) {
    console.error("Error generating assessment:", error);
    throw error;
  }
};

export const continueChat = async (context: string, history: any[], message: string): Promise<string> => {
  const prompt = `
    You are a helpful assistant. You are having a conversation about the following document:
    ---
    ${context}
    ---
    Here is the conversation history:
    ${history.map(h => `${h.role}: ${h.parts[0].text}`).join('\n')}
    ---
    Now, please respond to the following message:
    ${message}
  `;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error continuing chat:", error);
    throw error;
  }
};
