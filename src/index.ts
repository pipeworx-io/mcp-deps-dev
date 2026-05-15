interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * deps.dev MCP — Google's package metadata + dependency graph API.
 *
 * Auth: none. Docs: https://docs.deps.dev/api/
 */


const BASE = 'https://api.deps.dev/v3';
const UA = 'pipeworx-mcp-deps-dev/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  {
    name: 'project',
    description: 'Project metadata (github | gitlab | bitbucket).',
    inputSchema: {
      type: 'object',
      properties: {
        project_type: { type: 'string', description: 'github | gitlab | bitbucket' },
        project_key: { type: 'string', description: 'e.g. "facebook/react"' },
      },
      required: ['project_type', 'project_key'],
    },
  },
  {
    name: 'package',
    description: 'Package metadata.',
    inputSchema: {
      type: 'object',
      properties: {
        system_: { type: 'string', description: 'NPM | PYPI | GO | MAVEN | NUGET | CARGO | RUBYGEMS' },
        name: { type: 'string' },
      },
      required: ['system_', 'name'],
    },
  },
  {
    name: 'version',
    description: 'Single version of a package (deps, advisories, license).',
    inputSchema: {
      type: 'object',
      properties: {
        system_: { type: 'string' },
        name: { type: 'string' },
        version: { type: 'string' },
      },
      required: ['system_', 'name', 'version'],
    },
  },
  {
    name: 'dependencies',
    description: 'Resolved dependency graph for a (system, name, version).',
    inputSchema: {
      type: 'object',
      properties: {
        system_: { type: 'string' },
        name: { type: 'string' },
        version: { type: 'string' },
      },
      required: ['system_', 'name', 'version'],
    },
  },
  {
    name: 'query',
    description: 'Query packages/versions (by hash, repo URL, etc).',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'object', description: 'Query body — see https://docs.deps.dev/api/v3/#query' },
      },
      required: ['query'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'project': {
      const t = String(args.project_type).toLowerCase();
      if (!['github', 'gitlab', 'bitbucket'].includes(t)) throw new Error('project_type must be github|gitlab|bitbucket.');
      return ddGet(`/projects/${t}%2F${encodeURIComponent(reqStr(args, 'project_key', '"facebook/react"'))}`);
    }
    case 'package': {
      const sys = sysName(args);
      const n = encodeURIComponent(reqStr(args, 'name', '"react"'));
      return ddGet(`/systems/${sys}/packages/${n}`);
    }
    case 'version': {
      const sys = sysName(args);
      const n = encodeURIComponent(reqStr(args, 'name', '"react"'));
      const v = encodeURIComponent(reqStr(args, 'version', '"18.3.1"'));
      return ddGet(`/systems/${sys}/packages/${n}/versions/${v}`);
    }
    case 'dependencies': {
      const sys = sysName(args);
      const n = encodeURIComponent(reqStr(args, 'name', '"react"'));
      const v = encodeURIComponent(reqStr(args, 'version', '"18.3.1"'));
      return ddGet(`/systems/${sys}/packages/${n}/versions/${v}:dependencies`);
    }
    case 'query': {
      const q = args.query;
      if (typeof q !== 'object' || q == null) throw new Error('query must be an object.');
      const res = await fetch(`${BASE}/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'User-Agent': UA },
        body: JSON.stringify(q),
      });
      if (!res.ok) throw new Error(`deps.dev query: ${res.status} ${await res.text().then((t) => t.slice(0, 200))}`);
      return res.json();
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

function sysName(args: Record<string, unknown>): string {
  const s = reqStr(args, 'system_', '"npm"').toUpperCase();
  if (!['NPM', 'PYPI', 'GO', 'MAVEN', 'NUGET', 'CARGO', 'RUBYGEMS'].includes(s)) {
    throw new Error('system_ must be NPM | PYPI | GO | MAVEN | NUGET | CARGO | RUBYGEMS.');
  }
  return s;
}

async function ddGet(path: string): Promise<unknown> {
  const res = await fetch(`${BASE}${path}`, { headers: { Accept: 'application/json', 'User-Agent': UA } });
  if (res.status === 404) throw new Error('deps.dev: not found');
  if (!res.ok) throw new Error(`deps.dev: ${res.status} ${await res.text().then((t) => t.slice(0, 200))}`);
  return res.json();
}

function reqStr(args: Record<string, unknown>, key: string, example: string): string {
  const v = args[key];
  if (typeof v !== 'string' || !v.trim()) {
    throw new Error(`Required argument "${key}" is missing. Pass a string like ${example}.`);
  }
  return v;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
