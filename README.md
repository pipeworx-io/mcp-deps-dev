# mcp-deps-dev

deps.dev MCP — Google's package metadata + dependency graph API.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 673+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `project` | Project metadata (github | gitlab | bitbucket). |
| `package` | Package metadata. |
| `version` | Single version of a package (deps, advisories, license). |
| `dependencies` | Resolved dependency graph for a (system, name, version). |
| `query` | Query packages/versions (by hash, repo URL, etc). |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "deps-dev": {
      "url": "https://gateway.pipeworx.io/deps-dev/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 673+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Deps Dev data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
