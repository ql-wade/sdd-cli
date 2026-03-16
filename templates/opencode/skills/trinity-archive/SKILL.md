---
name: trinity-archive
description: 归档变更（带追踪）- 三段式调用 planning-with-files + OpenSpec CLI。使用场景：用户想要完成并归档变更。
license: MIT
compatibility: 需要 openspec CLI 和 planning-with-files skill
metadata:
  author: trinity
  version: "2.3"
  generatedBy: "trinity-workflow-v2"
---

# trinity:archive - 归档变更

> **Trinity Workflow v2** - 三段式调用：planning-with-files → OpenSpec CLI → planning-with-files

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

用户调用: `/trinity:archive`

---

## 执行流程

### Phase 1: 调用 planning-with-files（前置）

```
[MUST] 首先调用 planning-with-files skill 进行最终验证
```

Use the Skill tool with skill: "planning-with-files"

**目的**:
1. 确认 verify 阶段已通过
2. 确认追踪文件完整:
   - [ ] task_plan.md 状态为 VERIFIED
   - [ ] findings.md 包含所有决策
   - [ ] progress.md 包含完整日志
   - [ ] delta-log.md 包含所有变更记录
3. 读取追踪文件准备生成总结

---

### Phase 2: 执行 OpenSpec CLI 归档命令

```
⚠️ CRITICAL: 必须使用 OpenSpec CLI 进行归档，不要直接使用 bash 命令
```

**正确做法 - 调用 OpenSpec CLI**:

```bash
# 1. 获取当前活跃变更
cat openspec/.active

# 2. 执行归档（使用 OpenSpec CLI）
openspec archive --yes

# 或指定变更名称
openspec archive <change-id> --yes
```

**OpenSpec CLI archive 命令会自动**:
- 验证 specs 和 change
- 检查任务完成状态
- 合并 Delta Specs 到 Main Specs
- 移动变更到 `openspec/changes/archive/{YYYY-MM-DD}-{change-id}/`
- 清理 .active 文件

**错误做法 - 不要直接使用 bash**:

```bash
# ❌ 错误：不要直接使用 mv 命令
mv openspec/changes/{change-id}/ openspec/changes/archive/{change-id}/

# ❌ 错误：不要手动清理
echo "" > openspec/.active
```

---

### Phase 3: 调用 planning-with-files（后置）

```
[MUST] 最后调用 planning-with-files skill 生成总结报告
```

Use the Skill tool with skill: "planning-with-files"

**传递归档信息**:
- change-id
- 归档位置: `openspec/changes/archive/{YYYY-MM-DD}-{change-id}/`
- 从追踪文件提取的总结信息

**生成总结报告**:

```markdown
# 变更总结报告

## 基本信息
| 字段 | 值 |
|------|-----|
| **Change ID** | {change-id} |
| **类型** | {feature/fix/refactor} |
| **Profile** | {Quick/Core/Expanded} |
| **总耗时** | {duration} |
| **归档时间** | {timestamp} |

## 阶段进度
- [✓] 初始化
- [✓] proposal
- [✓] specs
- [✓] design
- [✓] tasks
- [✓] apply
- [✓] verify
- [✓] archive

## 关键决策 (from findings.md)
- 决策 1: ...
- 决策 2: ...

## 规格变更 (from delta-log.md)
- ADDED: {specs 列表}
- MODIFIED: {specs 列表}
- REMOVED: {specs 列表}

## 操作历史 (from progress.md)
- 会话 1: ...
- 会话 2: ...
```

---

## 输出格式

```
🎉 变更归档完成!

┌─────────────────────────────────────────┐
│  变更概览                               │
├─────────────────────────────────────────┤
│  Change ID: {change-id}                │
│  类型: {feature/fix/refactor}           │
│  Profile: {Quick/Core/Expanded}         │
│  总耗时: {duration}                     │
└─────────────────────────────────────────┘

📁 归档位置: openspec/changes/archive/{YYYY-MM-DD}-{change-id}/
📝 总结报告: 已更新到 progress.md

🚀 可以开始新的变更: /trinity:new "描述"
```

---

## 使用示例

```bash
/trinity:archive                    # 归档当前变更（使用 OpenSpec CLI）
/trinity:archive <change-id>        # 归档指定变更
```

---

## ⚠️ 重要提示：Git 提交

**在执行 `wt merge` 合并 worktree 之前，必须先提交所有变更！**

```bash
# 1. 检查是否有未提交的变更
git status

# 2. 如果有未提交的变更，必须先提交
git add .
git commit -m "chore: archive change {change-id}"

# 3. 然后才能执行归档
/trinity:archive

# 4. 归档后再次提交
git add .
git commit -m "chore: archived {change-id}"
```

**原因**:
- `openspec/changes/archive/` 是新创建的目录
- 未提交的变更在使用 `wt merge` 时会被丢弃
- 结果：归档目录会完全丢失

---

## 架构说明

```
┌─────────────────────────────────────────────────────────────────┐
│  trinity:archive 三段式架构                                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Phase 1: planning-with-files (前置)                            │
│  → 确认 verify 已通过                                            │
│  → 确认追踪文件完整                                              │
│  → 读取追踪文件准备生成总结                                       │
│                                                                  │
│  Phase 2: 执行 OpenSpec CLI                                      │
│  → openspec archive [change-id] --yes                           │
│  → CLI 自动处理: 验证、合并 specs、移动目录、清理 .active         │
│                                                                  │
│  Phase 3: planning-with-files (后置)                            │
│  → 生成变更总结报告                                              │
│  → 更新 progress.md 归档日志                                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## OpenSpec CLI Archive 行为

OpenSpec CLI 的 `openspec archive` 命令会：

1. **验证变更** - 检查 specs 和 proposal 的有效性
2. **检查任务** - 显示任务完成状态，警告未完成任务
3. **合并 Specs** - 将 Delta Specs 合并到 Main Specs
4. **移动目录** - 从 `openspec/changes/{id}/` 移动到 `openspec/changes/archive/{YYYY-MM-DD}-{id}/`
5. **清理状态** - 清空 `.active` 文件

**归档路径格式**: `openspec/changes/archive/{YYYY-MM-DD}-{change-id}/`

**关键原则**:
- 不侵入修改 planning-with-files skill
- 不侵入修改 OpenSpec 官方 skills
- **必须使用 OpenSpec CLI 进行归档操作**
- 通过调用实现集成，而非内联 bash 命令
