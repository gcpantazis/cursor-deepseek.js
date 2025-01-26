/** Represents a message in a chat conversation */
export interface Message {
  /** The role of the message sender (e.g., 'user', 'assistant') */
  role: string;
  /** The content of the message */
  content: string;
  /** Optional array of tool calls associated with the message */
  tool_calls?: ToolCall[];
  /** Optional ID for a specific tool call */
  tool_call_id?: string;
  /** Optional name associated with the message */
  name?: string;
}

/** Represents a function that can be called by the system */
export interface Function {
  /** The name of the function */
  name: string;
  /** A description of what the function does */
  description: string;
  /** The parameters the function accepts */
  parameters: any;
}

/** Represents a tool that can be used by the system */
export interface Tool {
  /** The type of the tool */
  type: string;
  /** The function associated with the tool */
  function: Function;
}

/** Represents a call to a tool */
export interface ToolCall {
  /** The unique ID of the tool call */
  id: string;
  /** The type of the tool call */
  type: string;
  function: {
    /** The name of the function to call */
    name: string;
    /** The arguments to pass to the function */
    arguments: string;
  };
}

/** Represents a request to the chat API */
export interface ChatRequest {
  /** The model to use for the chat */
  model: string;
  /** The list of messages in the conversation */
  messages: Message[];
  /** Whether to stream the response */
  stream: boolean;
  /** Optional list of functions available for the model to call */
  functions?: Function[];
  /** Optional list of tools available for the model to use */
  tools?: Tool[];
  /** Optional specification of which tool to use */
  tool_choice?: any;
  /** Optional parameter to control the randomness of the output */
  temperature?: number;
  /** Optional parameter to limit the length of the response */
  max_tokens?: number;
}

/** Represents a request to the DeepSeek API */
export interface DeepSeekRequest {
  /** The model to use for the request */
  model: string;
  /** The list of messages in the conversation */
  messages: Message[];
  /** Whether to stream the response */
  stream: boolean;
  /** Optional parameter to control the randomness of the output */
  temperature?: number;
  /** Optional parameter to limit the length of the response */
  max_tokens?: number;
  /** Optional list of tools available for the model to use */
  tools?: Tool[];
  /** Specifies whether to use tools and how */
  tool_choice: "none" | "auto";
}

/** Represents a model available in the system */
export interface Model {
  /** The unique ID of the model */
  id: string;
  /** The type of object (e.g., 'model') */
  object: string;
  /** The timestamp when the model was created */
  created: number;
  /** The owner of the model */
  owned_by: string;
}

/** Represents a response containing a list of models */
export interface ModelsResponse {
  /** The type of object (e.g., 'list') */
  object: string;
  /** The list of models */
  data: Model[];
}
