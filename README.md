# sdd-ql-workflow

> **Three Principles for AI-Driven Development**

SDD (Skill-Driven Development) CLI Tool - 一键初始化 Trinity Workflow v2 配置。

---

## 核心理念

### Three Principles for AI-Driven Development

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    AI-Driven Development 三原则                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  1. Attention is All You Need                                           │
│     ─────────────────────────                                           │
│     让 AI 聚焦于正确的信息，而非淹没在无关代码中                           │
│     → 通过 Skills 系统精确控制 AI 的注意力范围                            │
│     → 只加载必要的上下文，避免 token 浪费                                 │
│                                                                          │
│  2. Context is All You Need                                             │
│     ────────────────────────                                            │
│     持久化上下文 = Agent 的"工作记忆"                                     │
│     → planning-with-files 作为上下文锚点                                 │
│     → task_plan.md / findings.md / progress.md / delta-log.md           │
│     → Agent 随时知道：在哪？做过什么？为什么？下一步？                      │
│                                                                          │
│  3. System Agent Flow is All You Need                                   │
│     ────────────────────────────────                                    │
│     结构化的 Agent 协作流程，而非随机的交互                               │
│     → 三段式架构：planning-with-files → OpenSpec CLI → planning-with-files│
│     → 3-Strike 协议：自动错误处理，减少人工干预                           │
│     → Profile 模式：Quick / Core / Expanded 自适应复杂度                 │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 为什么这个架构有效？

| 问题 | 传统方式 | Trinity 方式 |
|------|---------|-------------|
| AI 不知道当前状态 | 每次重新解释 | 读取 task_plan.md |
| AI 忘记之前的决策 | 重复讨论 | 读取 findings.md |
| AI 不知道下一步 | 用户手动引导 | Schema 驱动流程 |
| 错误处理混乱 | 随机重试 | 3-Strike 协议 |
| 上下文丢失 | 会话结束即丢失 | 文件持久化 |

---

## 平台兼容性

Trinity Skills 支持多个 AI 编程助手：

| 平台 | Skills 目录 | 状态 |
|------|------------|------|
| **Claude Code** | `.claude/skills/` | ✅ 支持 |
| **OpenCode** | `.opencode/skills/` | ✅ 支持 |
| **Cursor** | `.cursor/skills/` | 🚧 计划中 |

---

## 安装

### 前置依赖

Trinity Workflow 依赖以下技能，请先安装：

#### 1. planning-with-files

**Context is All You Need** 的实现 - 追踪文件管理，作为 Agent 上下文锚点。

```bash
# Claude Code
git clone https://github.com/OthmanAdi/planning-with-files ~/.claude/skills/planning-with-files

# OpenCode
git clone https://github.com/OthmanAdi/planning-with-files ~/.opencode/skills/planning-with-files
```

#### 2. superpowers

**Attention is All You Need** 的实现 - 专业开发技能集，精确控制 AI 的注意力范围。

```bash
# Claude Code
git clone https://github.com/obra/superpowers ~/.claude/skills/superpowers

# OpenCode
git clone https://github.com/obra/superpowers ~/.opencode/skills/superpowers
```

### 安装 sdd-cli

```bash
# 使用 npx（推荐）
npx sdd-ql-workflow init

# 或全局安装
npm install -g sdd-ql-workflow
sdd init
```

---

## 快速开始

```bash
# 在项目根目录执行（自动检测平台）
npx sdd-ql-workflow init

# 指定平台
npx sdd-ql-workflow init --platform claude
npx sdd-ql-workflow init --platform opencode

# 使用 v2 schema（推荐）
npx sdd-ql-workflow init --schema trinity-workflow-v2

# 初始化成功后，可用的命令：
# /trinity:new "描述"    - 创建新变更（带追踪）
# /trinity:continue      - 继续下一个 artifact
# /trinity:apply         - 执行任务
# /trinity:verify        - 验证实现
# /trinity:archive       - 归档变更
# /trinity:ff "描述"     - 快速流程
```

---

## System Agent Flow 架构

### 三段式调用

**System Agent Flow is All You Need** 的实现 - 结构化的 Agent 协作流程：

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    Trinity 三段式架构                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  用户调用: /trinity:new "feature-x"                                      │
│           │                                                              │
│           ▼                                                              │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Phase 1: 调用 planning-with-files skill                         │   │
│  │         - 读取/初始化追踪文件 (Context)                          │   │
│  │         - task_plan.md, findings.md, progress.md                │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│           │                                                              │
│           ▼                                                              │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Phase 2: 执行 OpenSpec CLI                                      │   │
│  │         - openspec new change --schema trinity-workflow-v2       │   │
│  │         - openspec status --json                                  │   │
│  │         - openspec instructions --json                             │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│           │                                                              │
│           ▼                                                              │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Phase 3: 调用 planning-with-files skill                         │   │
│  │         - 更新追踪文件（基于 CLI 返回的信息）                   │   │
│  │         - 记录操作日志、进度、决策                             │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Context 持久化

```
┌─────────────────────────────────────────────────────────────────────────┐
│              planning-with-files = Agent 上下文锚点                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  追踪文件位置: openspec/changes/{change-id}/                            │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │  task_plan.md  ←── 当前阶段、目标、任务清单                        │ │
│  │  findings.md   ←── 技术发现、架构决策 (ADR)                        │ │
│  │  progress.md   ←── 会话进度日志、操作记录                          │ │
│  │  delta-log.md  ←── Delta Specs 变更记录                           │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  Agent 随时可以知道:                                                     │
│  • 当前在哪个阶段？                                                      │
│  • 哪些文件已修改？                                                      │
│  • 为什么修改？                                                          │
│  • 下一步是什么？                                                        │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Profile 模式（自适应复杂度）

| 模式 | 适用场景 | Artifacts | 说明 |
|------|---------|-----------|------|
| Quick | 单文件修改、Bug Fix | proposal → tasks → apply | 跳过 specs/design |
| Core | 新功能、多文件变更 | proposal → specs → design → tasks → apply | 标准流程 |
| Expanded | 复杂功能、跨模块、架构重构 | 全流程 + verify | 包含验证 |

### 3-Strike 协议（自动错误处理）

```
┌─────────────────────────────────────────────────────────────────────────┐
│                       3-Strike 协议                                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Attempt 1: 诊断并修复 → 记录到 progress.md                              │
│      ↓ 失败                                                              │
│  Attempt 2: 尝试替代方案 → 记录到 findings.md                            │
│      ↓ 失败                                                              │
│  Attempt 3: 重新思考问题 → 记录到 findings.md                            │
│      ↓ 失败                                                              │
│  升级给用户 → 更新 task_plan.md [BLOCKED]                                │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 命令

### `init`

初始化 SDD workflow 配置：

```bash
npx sdd-ql-workflow init [options]

Options:
  -f, --force           覆盖已存在的文件
  --skip-commands       跳过命令文件复制
  --skip-schema         跳过 schema 文件复制
  --skip-skills         跳过 skill 文件复制
  --platform <name>     目标平台: claude | opencode (默认自动检测)
  --schema <name>       Schema 名称: trinity-workflow-v2 | trinity-workflow | hybrid-workflow
```

### `list`

列出可用的命令和 schema：

```bash
npx sdd-ql-workflow list
```

---

## Trinity 命令说明

| 命令 | 说明 |
|------|------|
| `/trinity:new "描述"` | 创建新变更（带追踪） |
| `/trinity:continue` | 继续下一个 artifact |
| `/trinity:apply` | 执行任务（带 3-Strike） |
| `/trinity:verify` | 验证实现（三维度） |
| `/trinity:archive` | 归档变更（生成总结） |
| `/trinity:ff "描述"` | 快速流程（一键创建） |

---

## 生成的文件结构

### Claude Code 项目

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
│           ├── task_plan.md      # 阶段进度
│           ├── findings.md       # 技术发现
│           ├── progress.md       # 操作日志
│           ├── delta-log.md      # 规格变更
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

### OpenCode 项目

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

## 可用 Schema

| Schema | 说明 |
|--------|------|
| `trinity-workflow-v2` | 三位一体架构工作流 v2 (推荐) |
| `trinity-workflow` | 三位一体架构工作流 v1 |
| `hybrid-workflow` | 融合工作流 |

---

## 平台差异说明

### Claude Code
- Skills 存放于 `.claude/skills/` 目录
- 使用 `SKILL.md` 文件格式
- 支持原生 slash 命令

### OpenCode
- Skills 存放于 `.opencode/skills/` 目录
- Commands 存放于 `.opencode/commands/` 目录
- 需要配合 oh-my-opencode 插件使用

---

## 开发

```bash
# 安装依赖
cd packages/sdd-cli
npm install

# 本地测试
node bin/cli.js init
node bin/cli.js list
```

---

## 版本历史

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
- Update README with core philosophy description

### v2.2.0
- 明确追踪文件位置（openspec/changes/{change-id}/）
- 删除 .trinity 目录创建逻辑

### v2.1.0
- 三段式架构：planning-with-files → OpenSpec CLI → planning-with-files
- 每个操作都通过 planning-with-files 更新追踪文件

### v2.0.0
- 添加 Trinity Workflow v2 schema
- 集成 Planning-with-Files 作为上下文锚点
- 支持 Delta Specs 机制
- Profile 模式自动选择
- 3-Strike 协议集成
- **多平台支持**: Claude Code + OpenCode

### v0.4.1
- 初始版本
- Trinity Workflow v1
- Hybrid Workflow 支持

---

## License

MIT
