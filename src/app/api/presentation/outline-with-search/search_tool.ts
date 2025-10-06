import { DynamicStructuredTool } from "@langchain/core/tools";
import { TavilySearch } from "@langchain/tavily";
import { z } from "zod";

const tavily_search = new TavilySearch({ maxResults: 5 });
const schema = z.object({
  query: z
    .string()
    .describe("The query based on user's request to search in the internet"),
});

export const search_tool = new DynamicStructuredTool({
  name: tavily_search.name,
  description:
    "A search engine optimized for comprehensive, accurate, and trusted results. Useful for when you need to answer questions about current events like news, weather, stock price etc. Input should be a search query.",
  schema: schema,
  func: async (input) => {
    const result = await tavily_search.invoke({ query: input.query });
    return result as string;
  },
});
