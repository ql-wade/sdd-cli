---
name: trinity-ff
description: 快速流程（带追踪）- 三段式调用 planning-with-files + OpenSpec FF。一键完成 proposal → specs → design → tasks。
license: MIT
compatibility: 需要 openspec CLI 和 planning-with-files skill
metadata:
  author: trinity
  version: "2.2"
  generatedBy: "trinity-workflow-v2"
---

# trinity:ff - 快速流程

> **Trinity Workflow v2** - 三段式调用：planning-with-files → OpenSpec FF → planning-with-files

---

## 追踪文件位置

```
⚠️ 重要：追踪文件必须放在变更目录内，而非项目根目录

正确位置: openspec/changes/{change-id}/
  ├── task_plan.md      # 阶段进度
  ├── findings.md       # 技术发现
  ├── progress.md       # 操作日志
  └── delta-log.md      # 规格变更记录

错误位置: {project-root}/
  ├── task_plan.md      # ❌ 不要放这里
  ├── findings.md       # ❌ 不要放这里
  └── progress.md       # ❌ 不要放这里
```

---

## 触发

用户调用: `/trinity:ff "变更描述"`

---

## 功能说明

快速流程（Fast-Forward）一次性创建所有 artifacts：
- proposal.md
- specs/**/*.md
- design.md
- tasks.md

适用于:
- 简单变更，不需要逐步确认
- 用户已明确需求，无需引导
- 快速原型开发

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
```

#### 0.3 组装完整上下文

```
<project_context>
<!-- 来自 contextFiles: project.md -->
{项目架构、子项目、设计文档引用}

<!-- 来自 config.yaml context + OpenSpec context -->
{工作流规则}
</project_context>
```

#### 0.4 用于创建所有 artifacts

- proposal.md - 项目定位、架构约束
- specs/ - 子项目边界、技术栈
- design.md - 架构图、设计文档引用
- tasks.md - 项目结构、开发工作流

---

### Phase 1: 调用 planning-with-files（前置）

```
[MUST] 首先调用 planning-with-files skill 进行上下文加载
```

Use the Skill tool with skill: "planning-with-files"

**目的**:
1. 检查是否存在活跃变更
2. 如有活跃变更，询问用户是否继续或归档
3. 传递 Phase 0 组装的完整项目上下文

---

### Phase 2: 执行 OpenSpec FF

1. 分析变更描述，选择 Profile 模式
2. 创建变更目录
3. 一次性创建所有 artifacts

**FF 创建的 artifacts**:
1. proposal.md - 需求提案
2. specs/**/*.md - 功能规格
3. design.md - 技术设计
4. tasks.md - 任务清单

---

### Phase 3: 调用 planning-with-files（后置）

Use the Skill tool with skill: "planning-with-files"

**传递信息**:
- change-id
- Profile 模式
- 所有 artifacts 列表

**更新追踪文件**:
- task_plan.md: 进度 80%
- progress.md: 记录 FF 操作

---

## 输出格式

```
✅ Trinity 快速流程完成

📁 变更目录: openspec/changes/{change-id}/
📋 Profile: {Quick/Core/Expanded}
📊 当前进度: 80%

📝 已创建 Artifacts:
   ✓ proposal.md
   ✓ specs/
   ✓ design.md
   ✓ tasks.md

🚀 下一步: 运行 /trinity:apply 执行任务
```

---

## 架构说明

```
Phase 1: planning-with-files (前置)
→ 检查活跃变更、读取上下文

Phase 2: OpenSpec FF
→ 一次性创建所有 artifacts

Phase 3: planning-with-files (后置)
→ 更新追踪文件
```

**关键原则**:
- 不侵入修改 planning-with-files skill
- 不侵入修改 OpenSpec 官方 skills
- 通过调用实现集成
