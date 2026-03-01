export interface AIModel {
  name: string;
  provider: string;
  type: 'open' | 'closed';
  params: string;
  context: string;
  releaseDate: string;
  mmlu: number;
  humaneval: number;
  gpqa: number;
  math: number;
  arc: number;
  hellaswag: number;
}

export const aiModels: AIModel[] = [
  { name: 'GPT-4o', provider: 'OpenAI', type: 'closed', params: '~200B', context: '128K', releaseDate: '2024-05', mmlu: 88.7, humaneval: 90.2, gpqa: 53.6, math: 76.6, arc: 96.3, hellaswag: 98.4 },
  { name: 'Claude 3.5 Sonnet', provider: 'Anthropic', type: 'closed', params: 'Unknown', context: '200K', releaseDate: '2024-06', mmlu: 88.3, humaneval: 92.0, gpqa: 59.4, math: 71.1, arc: 95.0, hellaswag: 95.4 },
  { name: 'Gemini 1.5 Pro', provider: 'Google', type: 'closed', params: '~340B', context: '1M', releaseDate: '2024-02', mmlu: 85.9, humaneval: 84.1, gpqa: 46.2, math: 67.7, arc: 94.4, hellaswag: 92.3 },
  { name: 'Llama 3.1 405B', provider: 'Meta', type: 'open', params: '405B', context: '128K', releaseDate: '2024-07', mmlu: 88.6, humaneval: 89.0, gpqa: 50.7, math: 73.8, arc: 96.9, hellaswag: 97.1 },
  { name: 'Mixtral 8x22B', provider: 'Mistral', type: 'open', params: '141B', context: '64K', releaseDate: '2024-04', mmlu: 77.8, humaneval: 75.0, gpqa: 36.8, math: 41.8, arc: 91.3, hellaswag: 88.6 },
  { name: 'Qwen 2.5 72B', provider: 'Alibaba', type: 'open', params: '72B', context: '128K', releaseDate: '2024-09', mmlu: 86.7, humaneval: 86.6, gpqa: 49.0, math: 83.1, arc: 95.1, hellaswag: 93.2 },
  { name: 'DeepSeek V3', provider: 'DeepSeek', type: 'open', params: '671B', context: '128K', releaseDate: '2024-12', mmlu: 88.5, humaneval: 89.9, gpqa: 59.1, math: 90.2, arc: 96.2, hellaswag: 97.3 },
  { name: 'Phi-3 Medium', provider: 'Microsoft', type: 'open', params: '14B', context: '128K', releaseDate: '2024-05', mmlu: 78.0, humaneval: 70.6, gpqa: 35.1, math: 53.6, arc: 91.5, hellaswag: 90.4 },
  { name: 'Command R+', provider: 'Cohere', type: 'closed', params: '104B', context: '128K', releaseDate: '2024-04', mmlu: 75.7, humaneval: 64.1, gpqa: 28.1, math: 50.9, arc: 90.0, hellaswag: 88.2 },
  { name: 'Grok-2', provider: 'xAI', type: 'closed', params: 'Unknown', context: '128K', releaseDate: '2024-08', mmlu: 87.5, humaneval: 88.4, gpqa: 56.0, math: 76.1, arc: 95.8, hellaswag: 97.0 },
];

export interface BenchmarkDefinition {
  key: string;
  name: string;
  fullName: string;
  description: string;
  tests: string;
  whyItMatters: string;
  maxScore: number;
}

export const benchmarkDefinitions: BenchmarkDefinition[] = [
  {
    key: 'mmlu',
    name: 'MMLU',
    fullName: 'Massive Multitask Language Understanding',
    description: 'A benchmark testing knowledge across 57 subjects from elementary mathematics to professional law.',
    tests: 'Multiple-choice questions across STEM, humanities, social sciences, and more.',
    whyItMatters: 'Comprehensive knowledge breadth indicator; correlates well with real-world usefulness.',
    maxScore: 100,
  },
  {
    key: 'humaneval',
    name: 'HumanEval',
    fullName: 'HumanEval Code Generation',
    description: 'OpenAI\'s benchmark of 164 hand-crafted Python programming challenges.',
    tests: 'Functional code generation with unit test verification.',
    whyItMatters: 'Industry standard for coding capability; critical for developer tools.',
    maxScore: 100,
  },
  {
    key: 'gpqa',
    name: 'GPQA',
    fullName: 'Graduate-Level Google-Proof Q&A',
    description: 'Expert-level PhD questions in biology, physics, and chemistry that stump Google search.',
    tests: 'Multiple choice questions requiring deep expert domain knowledge.',
    whyItMatters: 'Tests genuine scientific reasoning beyond pattern matching.',
    maxScore: 100,
  },
  {
    key: 'math',
    name: 'MATH',
    fullName: 'MATH Dataset',
    description: 'Competition mathematics problems requiring multi-step reasoning.',
    tests: 'Algebra, geometry, number theory, counting, probability, calculus problems.',
    whyItMatters: 'Strong indicator of mathematical reasoning and problem-solving depth.',
    maxScore: 100,
  },
  {
    key: 'arc',
    name: 'ARC',
    fullName: 'AI2 Reasoning Challenge (Challenge Set)',
    description: 'Science questions from grade 3-9 exams requiring genuine reasoning.',
    tests: 'Multiple choice science questions that retrieval-based systems fail at.',
    whyItMatters: 'Separates true reasoning from simple information retrieval.',
    maxScore: 100,
  },
  {
    key: 'hellaswag',
    name: 'HellaSwag',
    fullName: 'Harder Endings, Longer contexts, and Low-shot Activities for Situations With Adversarial Generations',
    description: 'Commonsense NLI — pick the most plausible continuation of a situation.',
    tests: 'Adversarially filtered commonsense reasoning scenarios.',
    whyItMatters: 'Tests grounded real-world commonsense; high ceiling for large models.',
    maxScore: 100,
  },
];
