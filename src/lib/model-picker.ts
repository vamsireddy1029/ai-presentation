import { createOpenAI } from "@ai-sdk/openai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { type LanguageModelV1 } from "ai";
import { ollama } from "ollama-ai-provider-v2";

/**
 * Centralized model picker function for all presentation generation routes
 * Supports OpenAI, Ollama, and LM Studio models
 */
export function modelPicker(
  modelProvider: string,
  modelId?: string,
): LanguageModelV1 {
  if (modelProvider === "ollama" && modelId) {
    // Use Ollama AI provider
    return ollama(modelId) as unknown as LanguageModelV1;
  }

  if (modelProvider === "lmstudio" && modelId) {
    // Use LM Studio with OpenAI compatible provider
    const lmstudio = createOpenAICompatible({
      name: "lmstudio",
      baseURL: "http://localhost:1234/v1",
    });
    return lmstudio(modelId) as unknown as LanguageModelV1;
  }

  // Default to OpenAI
  const openai = createOpenAI();
  return openai("gpt-4o-mini") as unknown as LanguageModelV1;
}
