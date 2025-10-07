import { useQuery } from "@tanstack/react-query";

interface ModelInfo {
  id: string;
  name: string;
  provider: "ollama" | "lmstudio";
}

interface OllamaResponse {
  models?: Array<{ name: string }>;
}

interface LMStudioResponse {
  data?: Array<{ id: string }>;
}

// Fetch models from Ollama
async function fetchOllamaModels(): Promise<ModelInfo[]> {
  try {
    const response = await fetch("http://localhost:11434/api/tags");
    if (!response.ok) {
      throw new Error("Ollama not available");
    }

    const data = (await response.json()) as OllamaResponse;
    if (!data.models || !Array.isArray(data.models)) {
      return [];
    }

    return data.models.map((model) => ({
      id: `ollama-${model.name}`,
      name: model.name,
      provider: "ollama" as const,
    }));
  } catch (error) {
    console.log("Ollama not available:", error);
    return [];
  }
}

// Fetch models from LM Studio
async function fetchLMStudioModels(): Promise<ModelInfo[]> {
  try {
    const response = await fetch("http://127.0.0.1:1234/v1/models");
    if (!response.ok) {
      throw new Error("LM Studio not available");
    }

    const data = (await response.json()) as LMStudioResponse;
    if (!data.data || !Array.isArray(data.data)) {
      return [];
    }

    return data.data.map((model) => ({
      id: `lmstudio-${model.id}`,
      name: model.id,
      provider: "lmstudio" as const,
    }));
  } catch (error) {
    console.log("LM Studio not available:", error);
    return [];
  }
}

// Fetch all local models
async function fetchLocalModels(): Promise<ModelInfo[]> {
  const [ollamaModels, lmStudioModels] = await Promise.all([
    fetchOllamaModels(),
    fetchLMStudioModels(),
  ]);

  return [...ollamaModels, ...lmStudioModels];
}

// Fallback models when no local models are available
export const fallbackModels: ModelInfo[] = [
  {
    id: "ollama-llama3.1:8b",
    name: "llama3.1:8b",
    provider: "ollama",
  },
  {
    id: "ollama-llama3.1:70b",
    name: "llama3.1:70b",
    provider: "ollama",
  },
  {
    id: "ollama-llama3.2:3b",
    name: "llama3.2:3b",
    provider: "ollama",
  },
  {
    id: "ollama-llama3.2:8b",
    name: "llama3.2:8b",
    provider: "ollama",
  },
  {
    id: "ollama-mistral:7b",
    name: "mistral:7b",
    provider: "ollama",
  },
  {
    id: "ollama-codellama:7b",
    name: "codellama:7b",
    provider: "ollama",
  },
];

export function useLocalModels() {
  return useQuery({
    queryKey: ["local-models"],
    queryFn: fetchLocalModels,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    retryDelay: 1000,
    select: (data) => {
      // Return fallback models if no local models are found
      return data.length > 0 ? data : fallbackModels;
    },
  });
}
