# @pipeworx/deps-dev

[deps.dev](https://deps.dev) MCP — Google's package metadata API: versions, dependencies, dependents, security advisories, project signals. Keyless.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

- `project(project_type, project_key)` — project metadata (github | gitlab | bitbucket)
- `system(system_)` — package metadata across all systems (npm, PyPI, Go, Maven, NuGet, crates.io, RubyGems, Cargo)
- `package(system_, name)` — package metadata
- `version(system_, name, version)` — single version (deps, advisories, license)
- `dependencies(system_, name, version)` — resolved dependency graph
- `query(query)` — query packages/versions by hash, repo url, etc.

## Data source

`https://api.deps.dev/v3/`

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

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

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

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
