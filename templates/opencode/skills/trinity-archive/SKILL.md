---
name: trinity-archive
description: 归档变更（带追踪）- 三段式调用 planning-with-files + OpenSpec 归档。使用场景：用户想要完成并归档变更。
license: MIT
compatibility: 需要 openspec CLI 和 planning-with-files skill
metadata:
  author: trinity
  version: "2.2"
  generatedBy: "trinity-workflow-v2"
---

# trinity:archive - 归档变更

> **Trinity Workflow v2** - 三段式调用：planning-with-files → OpenSpec 归档 → planning-with-files

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

### Phase 2: 执行归档

#### 2.1 合并 Delta Specs 到 Main Specs

```
根据 delta-log.md 的记录:
- ADDED: 复制 specs/ 到 main-specs/
- MODIFIED: 合并变更到 main-specs/
- REMOVED: 从 main-specs/ 删除
```

#### 2.2 移动变更目录到归档位置

```bash
# 移动到归档目录
mv openspec/changes/{change-id}/ openspec/changes/archive/{change-id}/
```

#### 2.3 清理活跃状态

```bash
# 清空活跃文件
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
- 归档位置
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

📁 归档位置: openspec/changes/archive/{change-id}/
📝 总结报告: openspec/archive/{change-id}/summary.md

🚀 可以开始新的变更: /trinity:new "描述"
```

---

## 使用示例

```bash
/trinity:archive           # 归档当前变更
/trinity:archive --force   # 强制归档（跳过验证检查）
/trinity:archive --list    # 查看归档列表
```

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
│  Phase 2: 执行归档                                               │
│  → 合并 Delta Specs 到 Main Specs                                │
│  → 移动变更目录到 archive/                                       │
│  → 清理 .active 文件                                             │
│                                                                  │
│  Phase 3: planning-with-files (后置)                            │
│  → 生成变更总结报告                                              │
│  → 更新 progress.md 归档日志                                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**关键原则**:
- 不侵入修改 planning-with-files skill
- 不侵入修改 OpenSpec 官方 skills
- 通过调用实现集成，而非内联逻辑
