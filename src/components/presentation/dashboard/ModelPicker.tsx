"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useLocalModels } from "@/hooks/presentation/useLocalModels";
import { usePresentationState } from "@/states/presentation-state";
import { Bot, Cpu, Monitor } from "lucide-react";
import { ModelPickerSkeleton } from "./ModelPickerSkeleton";

export function ModelPicker({
  shouldShowLabel = true,
}: {
  shouldShowLabel?: boolean;
}) {
  const { modelProvider, setModelProvider, modelId, setModelId } =
    usePresentationState();

  const { data: availableModels, isLoading, error } = useLocalModels();

  // Show loading skeleton while fetching models
  if (isLoading) {
    return <ModelPickerSkeleton />;
  }

  // If there's an error or no models, show fallback
  if (error || !availableModels) {
    return <ModelPickerSkeleton />;
  }

  // Model options with their configurations
  const modelOptions = [
    {
      id: "openai",
      label: "GPT-4o-mini",
      displayLabel: "GPT-4o-mini",
      icon: Bot,
      description: "Cloud-based AI model",
    },
    ...availableModels.map((model) => ({
      id: model.id,
      label: model.name, // For display when selected (no prefix)
      displayLabel:
        model.provider === "ollama"
          ? `ollama ${model.name}`
          : `lm-studio ${model.name}`, // For dropdown display (with prefix)
      icon: model.provider === "ollama" ? Cpu : Monitor,
      description:
        model.provider === "ollama"
          ? "Local Ollama model"
          : "Local LM Studio model",
    })),
  ];

  // Get current model value
  const getCurrentModelValue = () => {
    if (modelProvider === "ollama") {
      return `ollama-${modelId}`;
    } else if (modelProvider === "lmstudio") {
      return `lmstudio-${modelId}`;
    }
    return modelProvider;
  };

  // Handle model change
  const handleModelChange = (value: string) => {
    if (value === "openai") {
      setModelProvider("openai");
    } else if (value.startsWith("ollama-")) {
      const model = value.replace("ollama-", "");
      setModelProvider("ollama");
      setModelId(model);
    } else if (value.startsWith("lmstudio-")) {
      const model = value.replace("lmstudio-", "");
      setModelProvider("lmstudio");
      setModelId(model);
    }
  };

  return (
    <div>
      {shouldShowLabel && (
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Text Model
        </label>
      )}
      <Select value={getCurrentModelValue()} onValueChange={handleModelChange}>
        <SelectTrigger className="overflow-hidden">
          <div className="flex items-center gap-2 min-w-0">
            {(() => {
              const currentOption = modelOptions.find(
                (opt) => opt.id === getCurrentModelValue(),
              );
              const Icon = currentOption?.icon || Bot;
              return <Icon className="h-4 w-4 flex-shrink-0" />;
            })()}
            <span className="truncate text-sm">
              {(() => {
                const currentOption = modelOptions.find(
                  (opt) => opt.id === getCurrentModelValue(),
                );
                return currentOption?.label || "Select model";
              })()}
            </span>
          </div>
        </SelectTrigger>
        <SelectContent>
          {modelOptions.map((option) => {
            const Icon = option.icon;
            return (
              <SelectItem key={option.id} value={option.id}>
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className="truncate text-sm">
                      {option.displayLabel}
                    </span>
                    <span className="text-xs text-muted-foreground truncate">
                      {option.description}
                    </span>
                  </div>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
