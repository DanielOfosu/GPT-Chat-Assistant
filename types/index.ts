 
export const OpenAIModel = {
  value: 'gpt-3.5-turbo'
};
  
  export interface Message {
    role: Role;
    content: string;
  }
  export type Role = "assistant" | "user";

  export function setModelGPT4() {
    OpenAIModel.value = "gpt-4";
  }