import OpenAI from 'openai';
import { logError } from './errorLogger';

class AIAssistant {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  async generateResponse(prompt: string): Promise<string> {
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

  async analyzeFreightData(data: any): Promise<string> {
    const prompt = `Analyze the following freight data and provide insights: ${JSON.stringify(data)}`;
    return this.generateResponse(prompt);
  }

  async suggestOptimizations(currentProcess: string): Promise<string> {
    const prompt = `Suggest optimizations for the following freight process: ${currentProcess}`;
    return this.generateResponse(prompt);
  }

  async generateSuggestions(formData: any): Promise<Record<string, string>> {
    const prompt = `Generate suggestions for the following form data: ${JSON.stringify(formData)}`;
    const response = await this.generateResponse(prompt);
    
    // Parse the response and convert it to a key-value object
    const suggestions = response.split('\n').reduce((acc, line) => {
      const [key, value] = line.split(':');
      if (key && value) {
        acc[key.trim()] = value.trim();
      }
      return acc;
    }, {} as Record<string, string>);

    return suggestions;
  }
}

export default AIAssistant;
