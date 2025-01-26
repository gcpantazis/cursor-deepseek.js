import { Message, ToolCall } from "./types";

export function convertToolChoice(choice: any): "none" | "auto" {
  if (!choice) {
    return "none"; // Default to "none"
  }

  // If string "auto" or "none"
  if (typeof choice === "string") {
    if (choice === "auto" || choice === "none") {
      return choice;
    }
  }

  // Try to parse as map for function call
  if (typeof choice === "object" && choice.type === "function") {
    return "auto"; // DeepSeek doesn't support specific function selection
  }

  return "none"; // Default to "none" for any other value
}

export function convertMessages(messages: Message[]): Message[] {
  return messages.map((msg) => {
    const converted: Message = { ...msg };

    // Handle assistant messages with tool calls
    if (msg.role === "assistant" && msg.tool_calls?.length) {
      const toolCalls: ToolCall[] = msg.tool_calls.map((tc) => ({
        id: tc.id,
        type: "function",
        function: {
          name: tc.function.name,
          arguments: tc.function.arguments,
        },
      }));
      converted.tool_calls = toolCalls;
    }

    // Handle function response messages
    if (msg.role === "function") {
      converted.role = "tool";
    }

    return converted;
  });
}

export function truncateString(s: string, maxLen: number): string {
  if (s.length <= maxLen) {
    return s;
  }
  return s.slice(0, maxLen) + "...";
}
