---
name: trinity-verify
description: 验证变更（带追踪）- 三段式调用 planning-with-files + OpenSpec 验证。使用场景：用户想要验证实现是否完成和正确。
license: MIT
compatibility: 需要 openspec CLI 和 planning-with-files skill
metadata:
  author: trinity
  version: "2.2"
  generatedBy: "trinity-workflow-v2"
---

# trinity:verify - 验证变更

> **Trinity Workflow v2** - 三段式调用：planning-with-files → OpenSpec 验证 → planning-with-files

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

用户调用: `/trinity:verify`

---

## 执行流程

### Phase 0: 加载项目上下文

```
[MUST] 在执行任何操作前，读取项目上下文作为验证标准
```

#### 0.1 读取 config.yaml

```yaml
# 解析 config.yaml
contextFiles:  # Trinity 扩展配置
  - path: openspec/project.md
    description: 项目架构、子项目、设计文档引用
    required: false
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

#### 0.3 用于验证

- Completeness: 检查是否覆盖所有子项目
- Correctness: 验证技术栈一致性
- Coherence: 验证架构设计一致性

---

### Phase 1: 调用 planning-with-files（前置）

```
[MUST] 首先调用 planning-with-files skill 进行追踪完整性检查
```

Use the Skill tool with skill: "planning-with-files"

**目的**:
1. 读取 `openspec/.active` 获取当前 change-id
2. 验证追踪文件完整性:
   - [ ] `task_plan.md` 存在且包含所有阶段记录
   - [ ] `findings.md` 存在
   - [ ] `progress.md` 存在且包含完整日志
   - [ ] `delta-log.md` 存在（如有 specs）

3. 读取上下文文件:
   - `tasks.md` - 获取任务列表和完成状态
   - `specs/**/*.md` - 获取规格要求
   - `design.md` - 获取设计决策

4. 传递 Phase 0 组装的完整项目上下文作为验证标准

---

### Phase 2: 执行三维度验证

验证三维度:

#### 2.1 Completeness（完整性）

```
检查:
- tasks.md 所有 checkbox 是否已勾选 [x]
- specs/ 所有规格是否有对应实现
- 功能覆盖是否完整
```

#### 2.2 Correctness（正确性）

```
检查:
- 实现是否符合 specs/ 中定义的规格
- 测试是否通过 (npm test / pytest 等)
- 类型检查是否通过 (tsc / mypy 等)
```

#### 2.3 Coherence（一致性）

```
检查:
- findings.md 中的 ADR 是否在代码中体现
- design.md 的架构设计是否已实现
- 代码风格是否一致
```

---

### Phase 3: 调用 planning-with-files（后置）

```
[MUST] 最后调用 planning-with-files skill 更新追踪文件
```

Use the Skill tool with skill: "planning-with-files"

**传递验证结果**:

#### 如果通过
```
- 更新 task_plan.md 状态为 VERIFIED
- 记录验证通过到 progress.md
- 提取验证过程中的发现到 findings.md
```

#### 如果失败
```
- 记录失败维度到 progress.md
- 更新 task_plan.md 状态为 FAILED
- 触发 3-Strike 协议
```

---

## 输出格式

### 验证通过

```
🎉 验证通过!

📊 验证结果:
┌─────────────────────────────────────────┐
│  维度            │ 状态    │ 详情        │
├─────────────────────────────────────────┤
│  Completeness   │ ✓ 通过  │ 5/5 任务完成 │
│  Correctness    │ ✓ 通过  │ 测试全部通过  │
│  Coherence      │ ✓ 通过  │ ADR 已遵循    │
└─────────────────────────────────────────┘

📝 追踪文件已更新:
   ✓ task_plan.md - 状态: VERIFIED
   ✓ progress.md - 验证日志

🚀 下一步: 运行 /trinity:archive 归档变更
```

### 验证失败

```
❌ 验证失败

📊 验证结果:
┌─────────────────────────────────────────┐
│  维度            │ 状态    │ 详情        │
├─────────────────────────────────────────┤
│  Completeness   │ ✓ 通过  │ 5/5 任务完成 │
│  Correctness    │ ✗ 失败  │ 2 个测试失败  │
│  Coherence      │ ⚠ 警告  │ 部分 ADR 未遵循│
└─────────────────────────────────────────┘

🔧 触发 3-Strike 协议
📝 失败详情已记录到 progress.md

下一步: 检查失败测试，修复后重新运行 /trinity:verify
```

---

## 错误处理（3-Strike 协议）

验证失败时:

| 尝试 | 动作 | 调用 planning-with-files 记录到 |
|------|------|-------------------------------|
| Attempt 1 | 诊断并修复验证问题 | progress.md |
| Attempt 2 | 尝试替代方案 | findings.md |
| Attempt 3 | 重新思考问题 | findings.md |
| 3次失败 | 升级给用户 | task_plan.md [BLOCKED] |

---

## 使用示例

```bash
/trinity:verify           # 验证当前变更
/trinity:verify --force   # 强制验证（跳过追踪完整性检查）
/trinity:verify --fix     # 验证并自动修复问题
```

---

## 架构说明

```
┌─────────────────────────────────────────────────────────────────┐
│  trinity:verify 三段式架构                                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Phase 1: planning-with-files (前置)                            │
│  → 追踪完整性检查                                                │
│  → 读取任务、规格、设计文档                                       │
│                                                                  │
│  Phase 2: 三维度验证                                             │
│  → Completeness: 任务完成度                                      │
│  → Correctness: 实现正确性                                       │
│  → Coherence: 设计一致性                                         │
│                                                                  │
│  Phase 3: planning-with-files (后置)                            │
│  → 更新 task_plan.md (VERIFIED/FAILED)                          │
│  → 记录验证结果到 progress.md                                    │
│                                                                  │
│  失败时: 触发 3-Strike 协议                                       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**关键原则**:
- 不侵入修改 planning-with-files skill
- 不侵入修改 OpenSpec 官方 skills
- 通过调用实现集成，而非内联逻辑
