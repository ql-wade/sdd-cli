# sdd-ql-workflow

> **Three Principles for AI-Driven Development**

SDD (Skill-Driven Development) CLI Tool - One-click initialization for Trinity Workflow v2 configuration.

---

## Core Philosophy

### Three Principles for AI-Driven Development

```
┌─────────────────────────────────────────────────────────────────────────┐
│                AI-Driven Development Three Principles                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  1. Attention is All You Need                                           │
│     ─────────────────────────                                           │
│     Focus AI on the right information, not淹没 in irrelevant code        │
│     → Skills system precisely controls AI's attention scope              │
│     → Load only necessary context, avoid token waste                    │
│                                                                          │
│  2. Context is All You Need                                             │
│     ────────────────────────                                            │
│     Persistent context = Agent's "working memory"                        │
│     → planning-with-files as context anchor                             │
│     → task_plan.md / findings.md / progress.md / delta-log.md           │
│     → Agent always knows: Where? What done? Why? Next?                  │
│                                                                          │
│  3. System Agent Flow is All You Need                                   │
│     ────────────────────────────────                                    │
│     Structured agent collaboration flow, not random interactions         │
│     → Three-phase: planning-with-files → OpenSpec CLI → planning-with-files│
│     → 3-Strike Protocol: Auto error handling, reduce manual intervention │
│     → Profile Mode: Quick / Core / Expanded adaptive complexity         │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Why This Architecture Works?

| Problem | Traditional Approach | Trinity Approach |
|---------|---------------------|------------------|
| AI doesn't know current state | Re-explain every time | Read task_plan.md |
| AI forgets previous decisions | Repeat discussions | Read findings.md |
| AI doesn't know next step | Manual user guidance | Schema-driven flow |
| Error handling chaos | Random retries | 3-Strike Protocol |
| Context loss | Lost when session ends | File persistence |

---

## Platform Compatibility

Trinity Skills supports multiple AI coding assistants:

| Platform | Skills Directory | Status |
|----------|-----------------|--------|
| **Claude Code** | `.claude/skills/` | ✅ Supported |
| **OpenCode** | `.opencode/skills/` | ✅ Supported |
| **Cursor** | `.cursor/skills/` | 🚧 Planned |

---

## Installation

### Prerequisites

Trinity Workflow depends on the following skills, please install first:

#### 1. planning-with-files

**Implementation of "Context is All You Need"** - Tracking file management as Agent context anchor.

```bash
# Claude Code
git clone https://github.com/OthmanAdi/planning-with-files ~/.claude/skills/planning-with-files

# OpenCode
git clone https://github.com/OthmanAdi/planning-with-files ~/.opencode/skills/planning-with-files
```

#### 2. superpowers

**Implementation of "Attention is All You Need"** - Professional development skill set, precise control of AI attention scope.

```bash
# Claude Code
git clone https://github.com/obra/superpowers ~/.claude/skills/superpowers

# OpenCode
git clone https://github.com/obra/superpowers ~/.opencode/skills/superpowers
```

### Install sdd-cli

```bash
# Using npx (recommended)
npx sdd-ql-workflow init

# Or install globally
npm install -g sdd-ql-workflow
sdd init
```

---

## Quick Start

```bash
# Execute in project root (auto-detect platform)
npx sdd-ql-workflow init

# Specify platform
npx sdd-ql-workflow init --platform claude
npx sdd-ql-workflow init --platform opencode

# Use v2 schema (recommended)
npx sdd-ql-workflow init --schema trinity-workflow-v2

# After initialization, available commands:
# /trinity:new "description"    - Create new change (with tracking)
# /trinity:continue             - Continue next artifact
# /trinity:apply                - Execute tasks
# /trinity:verify               - Verify implementation
# /trinity:archive              - Archive change
# /trinity:ff "description"     - Fast-forward flow
```

---

## System Agent Flow Architecture

### Three-Phase Invocation

**Implementation of "System Agent Flow is All You Need"** - Structured agent collaboration flow:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    Trinity Three-Phase Architecture                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  User calls: /trinity:new "feature-x"                                    │
│           │                                                              │
│           ▼                                                              │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Phase 1: Call planning-with-files skill                        │   │
│  │         - Read/initialize tracking files (Context)              │   │
│  │         - task_plan.md, findings.md, progress.md                │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│           │                                                              │
│           ▼                                                              │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Phase 2: Execute OpenSpec CLI                                   │   │
│  │         - openspec new change --schema trinity-workflow-v2      │   │
│  │         - openspec status --json                                │   │
│  │         - openspec instructions --json                          │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│           │                                                              │
│           ▼                                                              │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Phase 3: Call planning-with-files skill                        │   │
│  │         - Update tracking files (based on CLI response)         │   │
│  │         - Log operations, progress, decisions                   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Context Persistence

```
┌─────────────────────────────────────────────────────────────────────────┐
│           planning-with-files = Agent Context Anchor                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Tracking files location: openspec/changes/{change-id}/                 │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │  task_plan.md  ←── Current phase, goals, task list                │ │
│  │  findings.md   ←── Technical findings, ADR                        │ │
│  │  progress.md   ←── Session progress log                           │ │
│  │  delta-log.md  ←── Delta Specs change records                     │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  Agent always knows:                                                    │
│  • Which phase am I in?                                                  │
│  • Which files have been modified?                                       │
│  • Why were they modified?                                               │
│  • What's next?                                                          │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Profile Mode (Adaptive Complexity)

| Mode | Use Case | Artifacts | Description |
|------|----------|-----------|-------------|
| Quick | Single file edit, Bug Fix | proposal → tasks → apply | Skip specs/design |
| Core | New features, Multi-file changes | proposal → specs → design → tasks → apply | Standard flow |
| Expanded | Complex features, Cross-module, Architecture refactor | Full flow + verify | Includes verification |

### 3-Strike Protocol (Auto Error Handling)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                       3-Strike Protocol                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Attempt 1: Diagnose & Fix → Log to progress.md                         │
│      ↓ Failed                                                           │
│  Attempt 2: Try Alternative → Log to findings.md                        │
│      ↓ Failed                                                           │
│  Attempt 3: Rethink Problem → Log to findings.md                        │
│      ↓ Failed                                                           │
│  Escalate to User → Update task_plan.md [BLOCKED]                       │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Commands

### `init`

Initialize SDD workflow configuration:

```bash
npx sdd-ql-workflow init [options]

Options:
  -f, --force           Overwrite existing files
  --skip-commands       Skip command file copying
  --skip-schema         Skip schema file copying
  --skip-skills         Skip skill file copying
  --platform <name>     Target platform: claude | opencode (default: auto-detect)
  --schema <name>       Schema name: trinity-workflow-v2 | trinity-workflow | hybrid-workflow
```

### `list`

List available commands and schemas:

```bash
npx sdd-ql-workflow list
```

---

## Trinity Commands

| Command | Description |
|---------|-------------|
| `/trinity:new "description"` | Create new change (with tracking) |
| `/trinity:continue` | Continue next artifact |
| `/trinity:apply` | Execute tasks (with 3-Strike) |
| `/trinity:verify` | Verify implementation (3 dimensions) |
| `/trinity:archive` | Archive change (generate summary) |
| `/trinity:ff "description"` | Fast-forward flow (one-click create) |

---

## Generated File Structure

### Claude Code Project

```
your-project/
├── openspec/
│   ├── config.yaml
│   ├── project.md
│   ├── .active
│   ├── schemas/trinity-workflow-v2/
│   ├── specs/
│   └── changes/
│       └── {change-id}/
│           ├── task_plan.md      # Phase progress
│           ├── findings.md       # Technical findings
│           ├── progress.md       # Operation log
│           ├── delta-log.md      # Spec changes
│           ├── proposal.md
│           ├── specs/
│           ├── design.md
│           └── tasks.md
└── .claude/
    └── skills/
        ├── trinity-new/SKILL.md
        ├── trinity-continue/SKILL.md
        ├── trinity-apply/SKILL.md
        ├── trinity-verify/SKILL.md
        ├── trinity-archive/SKILL.md
        ├── trinity-ff/SKILL.md
        └── trinity-workflow/templates/
```

### OpenCode Project

```
your-project/
├── openspec/
│   └── ...
└── .opencode/
    ├── commands/
    │   ├── sdd-*.md
    │   └── hybrid-*.md
    └── skills/
        └── trinity-*/
```

---

## Available Schemas

| Schema | Description |
|--------|-------------|
| `trinity-workflow-v2` | Trinity Architecture Workflow v2 (Recommended) |
| `trinity-workflow` | Trinity Architecture Workflow v1 |
| `hybrid-workflow` | Hybrid Workflow |

---

## Platform Differences

### Claude Code
- Skills stored in `.claude/skills/` directory
- Uses `SKILL.md` file format
- Supports native slash commands

### OpenCode
- Skills stored in `.opencode/skills/` directory
- Commands stored in `.opencode/commands/` directory
- Requires oh-my-opencode plugin

---

## Development

```bash
# Install dependencies
cd packages/sdd-cli
npm install

# Local testing
node bin/cli.js init
node bin/cli.js list
```

---

## Version History

### v2.2.5
- Fix: Correct archive path from `openspec/changes/archive/` to `openspec/archive/`

### v2.2.4
- Fix: Add missing artifact templates for trinity-workflow-v2 schema

### v2.2.3
- Publish to GitHub and npm

### v2.2.2
- Add Three Principles for AI-Driven Development
- Update README with core philosophy
- Add English documentation

### v2.2.1
- Fix brainstorming skill reference (superpowers/brainstorming)
- Add prerequisite skills installation guide

### v2.2.0
- Clarify tracking files location (openspec/changes/{change-id}/)
- Remove .trinity directory creation logic

### v2.1.0
- Three-phase architecture: planning-with-files → OpenSpec CLI → planning-with-files
- Every operation updates tracking files via planning-with-files

### v2.0.0
- Add Trinity Workflow v2 schema
- Integrate Planning-with-Files as context anchor
- Support Delta Specs mechanism
- Profile mode auto-selection
- 3-Strike Protocol integration
- **Multi-platform support**: Claude Code + OpenCode

### v0.4.1
- Initial version
- Trinity Workflow v1
- Hybrid Workflow support

---

## License

MIT
