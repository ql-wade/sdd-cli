---
name: trinity-new
description: 创建新变更（带追踪）- 三段式调用 planning-with-files + OpenSpec CLI。使用场景：用户想要创建新功能、修复或修改时。
license: MIT
compatibility: 需要 openspec CLI 和 planning-with-files skill
metadata:
  author: trinity
  version: "2.2"
  generatedBy: "trinity-workflow-v2"
---

# trinity:new - 创建新变更

> **Trinity Workflow v2** - 三段式调用：planning-with-files → OpenSpec CLI → planning-with-files

---

## 核心原则：追踪文件位置

```
⚠️ 重要：追踪文件必须放在变更目录内，而非项目根目录

正确位置: openspec/changes/{change-id}/
  ├── task_plan.md      # 阶段进度
  ├── findings.md       # 技术发现/ADR
  ├── progress.md       # 操作日志
  ├── delta-log.md      # Specs 变更记录
  ├── proposal.md       # 需求提案
  ├── specs/            # 功能规格
  ├── design.md         # 技术设计
  └── tasks.md          # 任务清单

错误位置: {project-root}/
  ├── task_plan.md      # ❌ 不要放这里
  ├── findings.md       # ❌ 不要放这里
  └── progress.md       # ❌ 不要放这里
```

---

## 触发

用户调用: `/trinity:new "变更描述"`
或直接使用: `/trinity:new`（引导式输入）

---

## 执行流程

### Phase 0: 加载项目上下文

```
[MUST] 在执行任何操作前，读取并组装完整的项目上下文
```

#### 0.1 读取 config.yaml

```yaml
# 解析 config.yaml
contextFiles:  # Trinity 扩展配置
  - path: openspec/project.md
    description: 项目架构、子项目、设计文档引用
    required: false

context: |     # OpenSpec 标准配置
  语言：中文（简体）
  ...
```

#### 0.2 读取 contextFiles 中的文件

```
遍历 contextFiles 数组:
  for each file in contextFiles:
    if file.required and not exists(file.path):
      ERROR: "缺少必需的上下文文件: {file.path}"
    else if exists(file.path):
      content = read(file.path)
      context_sections.append(file.description, content)
    else:
      WARN: "上下文文件不存在: {file.path}"
```

#### 0.3 组装完整上下文

```
<project_context>
<!-- ═══════════════════════════════════════════════════════════ -->
<!-- 来自 contextFiles -->
<!-- ═══════════════════════════════════════════════════════════ -->

{project.md 内容}

<!-- ═══════════════════════════════════════════════════════════ -->
<!-- 来自 config.yaml context -->
<!-- ═══════════════════════════════════════════════════════════ -->

{工作流规则}

</project_context>
```

#### 0.4 用于后续决策

- 生成合适的 change-id（基于项目命名规范）
- 选择 Profile 模式（基于影响范围判断）
- 分析变更影响范围（基于架构图）

---

### Phase 1: 调用 planning-with-files（前置）

```
[MUST] 首先调用 planning-with-files skill 进行上下文加载
```

Use the Skill tool with skill: "planning-with-files"

**目的**:
1. 检查是否存在活跃变更（读取 `openspec/.active`）
2. 如有活跃变更，询问用户是否继续或归档
3. 传递 Phase 0 组装的完整项目上下文

---

### Phase 2: 执行 OpenSpec CLI

#### 2.1 分析变更描述

```
如果用户提供了描述:
  解析描述内容，提取:
  - 变更类型: [feature/fix/refactor/docs/other]
  - 影响范围: [单文件/多文件/跨模块]
  - 复杂度: [简单/中等/复杂]

如果没有提供描述:
  进入引导式对话:
  1. "请描述你想要实现的变更:"
  2. "这个变更的类型是什么?" (feature/fix/refactor)
  3. "预期影响哪些文件或模块?"
```

#### 2.2 选择 Profile 模式

根据变更特征自动选择:

| 特征 | 推荐模式 | Artifacts |
|------|---------|-----------|
| 单文件修改、Bug Fix | Quick | proposal → tasks → apply |
| 新功能(简单)、多文件变更 | Core | proposal → specs → design → tasks → apply |
| 复杂功能、跨模块、架构重构 | Expanded | 全流程 + verify |

#### 2.3 调用 OpenSpec CLI 创建变更

```bash
# 创建变更目录和结构
openspec new change "<change-id>" --schema trinity-workflow-v2

# 获取创建后的状态
openspec status --change "<change-id>" --json
```

**生成 change-id**:
- 格式: `{type}-{short-description}-{YYYYMMDD}`
- 示例: `feature-user-auth-20240115`

#### 2.4 解析 CLI 返回信息

从 `openspec status --json` 获取:
- `schemaName`: trinity-workflow-v2
- `artifacts`: 需要创建的 artifacts 列表
- `profile`: 使用的 Profile 模式

---

### Phase 3: 调用 planning-with-files（后置）

```
[MUST] 最后调用 planning-with-files skill 更新追踪文件
```

Use the Skill tool with skill: "planning-with-files"

**传递以下信息用于更新追踪**:
- change-id
- Profile 模式选择 (Quick/Core/Expanded)
- 变更描述
- CLI 返回的状态信息 (artifacts 列表, schema 信息)

**追踪文件位置**:
```
openspec/changes/{change-id}/
├── task_plan.md      # 阶段进度
├── findings.md       # 技术发现
├── progress.md       # 操作日志
└── delta-log.md      # 规格变更记录
```

**追踪文件更新内容**:

```markdown
# task_plan.md 更新

## 变更信息
| 字段 | 值 |
|------|-----|
| **Change ID** | {change-id} |
| **Profile** | {Quick/Core/Expanded} |
| **Schema** | trinity-workflow-v2 |
| **创建时间** | {timestamp} |
| **状态** | IN_PROGRESS |

## 当前进度
阶段进度: [██░░░░░░░░░░░░░░░░░░] 10%
- [✓] 初始化 - 创建变更目录
- [ ] proposal - 需求探索
...

# progress.md 更新

### 会话记录
[{timestamp}] ▶ /trinity:new "{变更描述}"
[{timestamp}] ✓ 变更目录创建: openspec/changes/{change-id}/
[{timestamp}] ✓ Profile 选择: {Quick/Core/Expanded}
[{timestamp}] ✓ OpenSpec CLI: openspec new change --schema trinity-workflow-v2
```

---

## 输出格式

```
✅ Trinity 变更已创建

📁 变更目录: openspec/changes/{change-id}/
📋 Profile: {Quick/Core/Expanded}
📊 当前进度: 10%

📝 追踪文件已更新:
   ✓ task_plan.md - 阶段进度
   ✓ progress.md - 操作日志

🚀 下一步: 运行 /trinity:continue 创建 proposal.md
```

---

## 错误处理

| 错误 | 处理 |
|------|------|
| OpenSpec CLI 未安装 | 提示用户安装 openspec CLI |
| 变更目录已存在 | 调用 planning-with-files 记录，建议继续现有变更 |
| 有未完成的活跃变更 | 询问用户是否要先归档现有变更 |

---

## 使用示例

```bash
# 创建新变更
/trinity:new "添加用户登录功能"

# 引导式创建
/trinity:new
> 请描述你想要实现的变更: 添加用户登录功能
> 变更类型 (feature/fix/refactor): feature
> 预期影响范围 (单文件/多文件/跨模块): 多文件
```

---

## 架构说明

```
┌─────────────────────────────────────────────────────────────────┐
│  trinity:new 三段式架构                                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Phase 1: planning-with-files (前置)                            │
│  → 读取上下文、检查活跃变更                                       │
│                                                                  │
│  Phase 2: OpenSpec CLI                                          │
│  → openspec new change --schema trinity-workflow-v2             │
│  → openspec status --json                                       │
│                                                                  │
│  Phase 3: planning-with-files (后置)                            │
│  → 更新 task_plan.md, progress.md                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**关键原则**:
- 不侵入修改 planning-with-files skill
- 不侵入修改 OpenSpec 官方 skills
- 通过调用实现集成，而非内联逻辑
