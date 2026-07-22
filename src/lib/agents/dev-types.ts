export type AgentStatus = "active" | "idle" | "error" | "paused" | "initializing";
export type AgentModel = "claude-opus-4-6" | "claude-sonnet-4-6" | "claude-haiku-4-5" | "gpt-4o" | "gemini-1.5-pro";
export type TaskStatus = "running" | "queued" | "completed" | "failed" | "cancelled";
export type LogLevel = "info" | "warn" | "error" | "debug" | "success";
export type KeyStatus = "active" | "revoked" | "expired";

export interface Agent {
  id: string;
  name: string;
  description: string;
  model: AgentModel;
  status: AgentStatus;
  systemPrompt: string;
  tools: string[];
  mcpConnections: string[];
  createdAt: string;
  lastActiveAt: string;
  taskCount: number;
  errorRate: number;
  avgLatencyMs: number;
  uptimePercent: number;
  tokenUsage: { input: number; output: number };
}

export interface AgentTask {
  id: string;
  agentId: string;
  agentName: string;
  description: string;
  status: TaskStatus;
  progress: number;
  startedAt: string;
  completedAt?: string;
  tokensUsed: number;
  model: AgentModel;
  error?: string;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  level: LogLevel;
  source: "web" | "llm" | "mcp" | "mission-control" | "agent";
  agentId?: string;
  message: string;
  metadata?: Record<string, unknown>;
}

export interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  maskedKey: string;
  status: KeyStatus;
  createdAt: string;
  lastUsedAt?: string;
  expiresAt?: string;
  permissions: string[];
  totalRequests: number;
}

export interface UsageMetric {
  date: string;
  inputTokens: number;
  outputTokens: number;
  requests: number;
  costUsd: number;
}

export interface McpConnection {
  id: string;
  name: string;
  endpoint: string;
  status: "connected" | "disconnected" | "error";
  latencyMs: number;
  lastPingAt: string;
}

// ── Mock data ─────────────────────────────────────────────────────────────────

export const MOCK_AGENTS: Agent[] = [
  {
    id: "agt_01jx4k2mnp",
    name: "DocBot Alpha",
    description: "Documentation ingestion and Q&A agent. Reads codebases and answers developer questions.",
    model: "claude-sonnet-4-6",
    status: "active",
    systemPrompt: "You are a documentation expert…",
    tools: ["read_file", "search_code", "web_search"],
    mcpConnections: ["mcp-filesystem", "mcp-github"],
    createdAt: "2026-05-12T09:00:00Z",
    lastActiveAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    taskCount: 847,
    errorRate: 0.8,
    avgLatencyMs: 1240,
    uptimePercent: 99.2,
    tokenUsage: { input: 2_840_000, output: 920_000 },
  },
  {
    id: "agt_02jx5m3nqr",
    name: "CodeReview Pro",
    description: "Automated PR review agent with security scanning and best-practice enforcement.",
    model: "claude-opus-4-6",
    status: "active",
    systemPrompt: "You are a senior code reviewer…",
    tools: ["read_file", "create_pr_comment", "run_tests", "search_code"],
    mcpConnections: ["mcp-github", "mcp-jira"],
    createdAt: "2026-05-18T14:30:00Z",
    lastActiveAt: new Date(Date.now() - 12 * 1000).toISOString(),
    taskCount: 412,
    errorRate: 1.2,
    avgLatencyMs: 2100,
    uptimePercent: 98.7,
    tokenUsage: { input: 5_120_000, output: 1_440_000 },
  },
  {
    id: "agt_03jx6n4ost",
    name: "DataPipeline Agent",
    description: "ETL orchestrator that transforms raw data sources and loads to warehouse.",
    model: "claude-haiku-4-5",
    status: "idle",
    systemPrompt: "You manage data pipelines…",
    tools: ["run_sql", "read_file", "write_file", "send_notification"],
    mcpConnections: ["mcp-postgres", "mcp-filesystem"],
    createdAt: "2026-05-20T08:15:00Z",
    lastActiveAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    taskCount: 2_103,
    errorRate: 0.4,
    avgLatencyMs: 480,
    uptimePercent: 99.8,
    tokenUsage: { input: 1_200_000, output: 380_000 },
  },
  {
    id: "agt_04jx7p5puv",
    name: "SupportBot v2",
    description: "Customer support triage and resolution agent with CRM integration.",
    model: "claude-sonnet-4-6",
    status: "error",
    systemPrompt: "You are a helpful support agent…",
    tools: ["search_kb", "update_ticket", "send_email", "web_search"],
    mcpConnections: ["mcp-zendesk", "mcp-salesforce"],
    createdAt: "2026-05-22T11:00:00Z",
    lastActiveAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    taskCount: 5_882,
    errorRate: 8.1,
    avgLatencyMs: 1680,
    uptimePercent: 94.3,
    tokenUsage: { input: 9_400_000, output: 3_100_000 },
  },
  {
    id: "agt_05jx8q6qvw",
    name: "ResearchAssist",
    description: "Deep research agent that synthesizes web sources into structured reports.",
    model: "claude-opus-4-6",
    status: "paused",
    systemPrompt: "You are a research specialist…",
    tools: ["web_search", "web_fetch", "write_file", "create_report"],
    mcpConnections: ["mcp-brave-search", "mcp-filesystem"],
    createdAt: "2026-06-01T16:00:00Z",
    lastActiveAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    taskCount: 198,
    errorRate: 2.5,
    avgLatencyMs: 3200,
    uptimePercent: 97.1,
    tokenUsage: { input: 4_800_000, output: 2_200_000 },
  },
];

export const MOCK_TASKS: AgentTask[] = [
  {
    id: "task_a1b2c3",
    agentId: "agt_02jx5m3nqr",
    agentName: "CodeReview Pro",
    description: "Review PR #481: Add OAuth2 PKCE flow",
    status: "running",
    progress: 68,
    startedAt: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
    tokensUsed: 24_800,
    model: "claude-opus-4-6",
  },
  {
    id: "task_d4e5f6",
    agentId: "agt_01jx4k2mnp",
    agentName: "DocBot Alpha",
    description: "Index repository: weblabs/platform-api v2.4",
    status: "running",
    progress: 42,
    startedAt: new Date(Date.now() - 9 * 60 * 1000).toISOString(),
    tokensUsed: 18_200,
    model: "claude-sonnet-4-6",
  },
  {
    id: "task_g7h8i9",
    agentId: "agt_03jx6n4ost",
    agentName: "DataPipeline Agent",
    description: "Transform events table → analytics_events",
    status: "queued",
    progress: 0,
    startedAt: new Date(Date.now() - 30 * 1000).toISOString(),
    tokensUsed: 0,
    model: "claude-haiku-4-5",
  },
  {
    id: "task_j1k2l3",
    agentId: "agt_01jx4k2mnp",
    agentName: "DocBot Alpha",
    description: "Answer: How does the auth middleware work?",
    status: "completed",
    progress: 100,
    startedAt: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 16 * 60 * 1000).toISOString(),
    tokensUsed: 3_400,
    model: "claude-sonnet-4-6",
  },
  {
    id: "task_m4n5o6",
    agentId: "agt_04jx7p5puv",
    agentName: "SupportBot v2",
    description: "Resolve ticket #12443: Login loop on Safari",
    status: "failed",
    progress: 31,
    startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 119 * 60 * 1000).toISOString(),
    tokensUsed: 5_100,
    model: "claude-sonnet-4-6",
    error: "MCP connection timeout: mcp-zendesk unreachable",
  },
];

export const MOCK_LOGS: SystemLog[] = [
  { id: "log_001", timestamp: new Date(Date.now() - 5 * 1000).toISOString(), level: "info", source: "agent", agentId: "agt_02jx5m3nqr", message: "CodeReview Pro: Fetched diff for PR #481 (412 lines)" },
  { id: "log_002", timestamp: new Date(Date.now() - 12 * 1000).toISOString(), level: "debug", source: "mcp", message: "mcp-github: tool_call read_file → src/auth/pkce.ts (1.2KB)" },
  { id: "log_003", timestamp: new Date(Date.now() - 28 * 1000).toISOString(), level: "success", source: "mission-control", message: "Task task_j1k2l3 completed successfully in 2m 04s" },
  { id: "log_004", timestamp: new Date(Date.now() - 45 * 1000).toISOString(), level: "warn", source: "llm", message: "Rate limit warning: 80% of claude-opus-4-6 quota consumed (this hour)" },
  { id: "log_005", timestamp: new Date(Date.now() - 62 * 1000).toISOString(), level: "error", source: "mcp", message: "mcp-zendesk: Connection timeout after 30s — retrying in 60s" },
  { id: "log_006", timestamp: new Date(Date.now() - 90 * 1000).toISOString(), level: "info", source: "web", message: "API request: POST /api/agents/agt_01jx4k2mnp/tasks (user: dev@weblabs.studio)" },
  { id: "log_007", timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(), level: "info", source: "agent", agentId: "agt_01jx4k2mnp", message: "DocBot Alpha: Indexing 1,842 files in platform-api repository" },
  { id: "log_008", timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString(), level: "debug", source: "mcp", message: "mcp-filesystem: Opened 24 file handles (pool utilization: 48%)" },
  { id: "log_009", timestamp: new Date(Date.now() - 4 * 60 * 1000).toISOString(), level: "info", source: "mission-control", message: "Agent health check passed: 4/5 agents nominal" },
  { id: "log_010", timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), level: "error", source: "agent", agentId: "agt_04jx7p5puv", message: "SupportBot v2: Task failed — upstream MCP unreachable" },
  { id: "log_011", timestamp: new Date(Date.now() - 7 * 60 * 1000).toISOString(), level: "info", source: "llm", message: "Model handoff: claude-sonnet-4-6 → claude-opus-4-6 for task_a1b2c3" },
  { id: "log_012", timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(), level: "success", source: "web", message: "API key JaPa_live_...4a2b authenticated successfully" },
];

export const MOCK_API_KEYS: ApiKey[] = [
  {
    id: "key_01jx",
    name: "Production",
    prefix: "JaPa_live_",
    maskedKey: "JaPa_live_••••••••••••••4a2b",
    status: "active",
    createdAt: "2026-04-10T09:00:00Z",
    lastUsedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    permissions: ["agents:read", "agents:write", "tasks:read", "tasks:write"],
    totalRequests: 48_291,
  },
  {
    id: "key_02jx",
    name: "Staging",
    prefix: "JaPa_test_",
    maskedKey: "JaPa_test_••••••••••••••9f1c",
    status: "active",
    createdAt: "2026-05-01T11:30:00Z",
    lastUsedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    permissions: ["agents:read", "tasks:read"],
    totalRequests: 12_004,
  },
  {
    id: "key_03jx",
    name: "CI/CD Pipeline",
    prefix: "JaPa_live_",
    maskedKey: "JaPa_live_••••••••••••••e7d3",
    status: "active",
    createdAt: "2026-05-15T08:00:00Z",
    lastUsedAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    permissions: ["agents:read", "tasks:read", "tasks:write"],
    totalRequests: 8_819,
  },
  {
    id: "key_04jx",
    name: "Legacy Integration",
    prefix: "JaPa_live_",
    maskedKey: "JaPa_live_••••••••••••••b2a0",
    status: "revoked",
    createdAt: "2026-01-20T15:00:00Z",
    lastUsedAt: "2026-04-01T12:00:00Z",
    permissions: ["agents:read"],
    totalRequests: 3_201,
  },
];

export const MOCK_USAGE: UsageMetric[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000);
  const base = 200_000 + Math.sin(i / 3) * 80_000;
  const input = Math.round(base + Math.random() * 60_000);
  const output = Math.round(input * 0.35 + Math.random() * 20_000);
  return {
    date: date.toISOString().split("T")[0],
    inputTokens: input,
    outputTokens: output,
    requests: Math.round((input + output) / 1200),
    costUsd: parseFloat(((input * 0.000003 + output * 0.000015) / 1).toFixed(4)),
  };
});

export const MOCK_MCP_CONNECTIONS: McpConnection[] = [
  { id: "mcp-github", name: "GitHub MCP", endpoint: "mcp://github.internal:3001", status: "connected", latencyMs: 28, lastPingAt: new Date(Date.now() - 10 * 1000).toISOString() },
  { id: "mcp-filesystem", name: "Filesystem MCP", endpoint: "mcp://fs.internal:3002", status: "connected", latencyMs: 4, lastPingAt: new Date(Date.now() - 10 * 1000).toISOString() },
  { id: "mcp-postgres", name: "PostgreSQL MCP", endpoint: "mcp://postgres.internal:3003", status: "connected", latencyMs: 12, lastPingAt: new Date(Date.now() - 10 * 1000).toISOString() },
  { id: "mcp-zendesk", name: "Zendesk MCP", endpoint: "mcp://zendesk.internal:3004", status: "error", latencyMs: 0, lastPingAt: new Date(Date.now() - 130 * 1000).toISOString() },
  { id: "mcp-brave-search", name: "Brave Search MCP", endpoint: "mcp://search.internal:3005", status: "disconnected", latencyMs: 0, lastPingAt: new Date(Date.now() - 5 * 60 * 1000).toISOString() },
];