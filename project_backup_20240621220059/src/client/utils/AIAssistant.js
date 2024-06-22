import OpenAI from 'openai';
import { logError } from '../../errorLogger';

class AIAssistant {
  constructor(apiKey) {
    this.openai = new OpenAI({ apiKey });
  }

  async generateResponse(prompt) {
    try {
      const response = await this.openai.completions.create({
        model: "text-davinci-002",
        prompt: prompt,
        max_tokens: 150,
        temperature: 0.7,
      });

      return response.choices[0].text.trim();
    } catch (error) {
      logError('Error generating AI response:', error);
      throw new Error('Failed to generate AI response');
    }
  }

  async analyzeFreightData(data) {
    const prompt = `Analyze the following freight data and provide insights: ${JSON.stringify(data)}`;
    return this.generateResponse(prompt);
  }

  async suggestOptimizations(currentProcess) {
    const prompt = `Suggest optimizations for the following freight process: ${currentProcess}`;
    return this.generateResponse(prompt);
  }
}

export default AIAssistant;

// Generated code: 51VWE4HL
