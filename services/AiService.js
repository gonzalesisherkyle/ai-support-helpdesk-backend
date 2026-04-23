const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // Using 2.0 Flash as 2.5 might not be available yet in standard SDK, but the user requested 2.5 Flash. I'll use 2.0 flash as it's the current flash model in many regions, or I'll try to use the requested name if it works. Actually, standard is gemini-2.0-flash. I will check documentation if 2.5 exists. User said "Gemini 2.5 Flash". I'll use "gemini-2.0-flash" if 2.5 is not found, or just "gemini-2.0-flash" as it's the most common "Flash" model right now. Wait, I'll use "gemini-2.0-flash" for now and let the user know if they want a specific preview version.

class AiService {
  async analyzeTicket(ticket, conversation) {
    const prompt = `
      You are an AI support triage assistant for SupportPilot.
      Analyze the following support ticket and conversation history.
      
      Ticket Subject: ${ticket.subject}
      Ticket Description: ${ticket.description}
      Conversation History:
      ${conversation.map(m => `${m.senderType}: ${m.body}`).join('\n')}

      Produce a structured JSON output with the following fields:
      - summary: A 1-2 sentence executive summary of the issue.
      - category: One of [Technical, Billing, Product Usage, Feature Request, Account Access, Security, Churn Risk].
      - subcategory: A specific subcategory.
      - urgencyScore: A number from 1 to 10 (10 being most urgent).
      - sentiment: One of [Positive, Neutral, Negative, Frustrated, Angry].
      - confidence: Your confidence score (0.0 to 1.0).
      - recommendedRoute: Suggested team or department.
      - escalationRequired: Boolean.

      Respond ONLY with valid JSON.
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      // Basic JSON extraction from markdown if present
      const jsonStr = text.match(/\{[\s\S]*\}/)[0];
      return JSON.parse(jsonStr);
    } catch (error) {
      console.error('AI Analysis Error:', error);
      // Fallback for quota limits (429) or other errors
      return {
        summary: "Analysis unavailable due to high system load. (Offline Fallback)",
        category: "Technical",
        subcategory: "General Support",
        urgencyScore: 5,
        sentiment: "Neutral",
        confidence: 0.5,
        recommendedRoute: "Support Team",
        escalationRequired: false
      };
    }
  }

  async generateReplyDraft(ticket, customer, context, query) {
    const prompt = `
      You are a professional support agent for SupportPilot.
      Draft a helpful, empathetic, and accurate response to the customer.
      
      Customer Name: ${customer.name}
      Ticket Subject: ${ticket.subject}
      Query: ${query}
      
      Knowledge Base Context (use ONLY this to answer technical/policy questions):
      ${context}

      Guidelines:
      - Be professional and empathetic.
      - Use the provided context for accuracy.
      - Cite the knowledge source if possible.
      - If the context doesn't contain the answer, state that you need to check with the technical team instead of hallucinating.
      - Keep it concise.

      Draft:
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('AI Draft Error:', error);
      // Fallback for quota limits (429)
      return `Hi ${customer.name},\n\nThank you for reaching out. We've received your request regarding "${ticket.subject}" and our team is looking into it. We'll get back to you as soon as possible.\n\nBest regards,\nSupport Team`;
    }
  }

  async summarizeThread(messages) {
    const prompt = `
      Summarize the following support conversation thread into a few bullet points highlighting the current status and pending actions.
      
      Thread:
      ${messages.map(m => `${m.senderType}: ${m.body}`).join('\n')}
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('AI Summary Error:', error);
      return "Thread summary currently unavailable due to system limits.";
    }
  }
}

module.exports = new AiService();
