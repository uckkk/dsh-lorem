// dsh-lorem — 占位文本生成（DeepSeek Harness）。纯 Node。
import { defineTool } from "@deepseek-ai/dsh-tools";

const name = "占位文本";
const inject = ["tools"];

const WORDS = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum".split(" ");

function words(n) {
  const out = [];
  for (let i = 0; i < n; i++) out.push(WORDS[i % WORDS.length]);
  return out.join(" ");
}

function sentence() {
  const n = 6 + Math.floor(Math.random() * 8);
  return words(n).charAt(0).toUpperCase() + words(n).slice(1) + ".";
}

async function apply(ctx, _config) {
  ctx.tools.register(defineTool({
    name: "lorem_words",
    description: "生成指定数量的占位单词（lorem ipsum）。`count` 传单词数（默认 50）。",
    parameters: { count: { type: "integer", description: "单词数，默认 50。" } },
    output: { schema: { type: "object", additionalProperties: false, properties: { text: { type: "string", required: true } } }, render: (_a, v) => [{ type: "text", text: v.text }] },
    execute: async (args) => ({ text: words(Math.min(1000, Math.max(1, args.count || 50))) }),
  }));

  ctx.tools.register(defineTool({
    name: "lorem_paragraphs",
    description: "生成指定段落的占位文本。`paragraphs` 传段落数（默认 3）；`sentences` 传每段句数（默认 4）。",
    parameters: {
      paragraphs: { type: "integer", description: "段落数，默认 3。" },
      sentences: { type: "integer", description: "每段句数，默认 4。" },
    },
    output: { schema: { type: "object", additionalProperties: false, properties: { text: { type: "string", required: true } } }, render: (_a, v) => [{ type: "text", text: v.text.slice(0, 3000) }] },
    execute: async (args) => {
      const p = Math.min(20, Math.max(1, args.paragraphs || 3));
      const s = Math.min(10, Math.max(1, args.sentences || 4));
      const paras = [];
      for (let i = 0; i < p; i++) {
        const sent = [];
        for (let j = 0; j < s; j++) sent.push(sentence());
        paras.push(sent.join(" "));
      }
      return { text: paras.join("\n\n") };
    },
  }));
}

export { apply, inject, name };
