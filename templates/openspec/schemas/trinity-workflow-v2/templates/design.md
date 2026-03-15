# Design: {{change-name}}

> Created: {{date}}
> Based on: proposal.md

## Architecture Overview

<!-- 高层架构图和说明 -->

```
┌─────────────────────────────────────────────────────┐
│                   Architecture Diagram               │
│                                                     │
│   ┌─────────┐     ┌─────────┐     ┌─────────┐      │
│   │  Layer  │────▶│  Layer  │────▶│  Layer  │      │
│   └─────────┘     └─────────┘     └─────────┘      │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## Data Models

### Entity: [EntityName]

```typescript
interface EntityName {
  id: string;
  // ... properties
}
```

### Relationships

```
EntityA ──1:N──▶ EntityB
EntityB ──N:M──▶ EntityC
```

## API Design

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/resource | 获取列表 |
| POST | /api/resource | 创建资源 |
| PUT | /api/resource/:id | 更新资源 |
| DELETE | /api/resource/:id | 删除资源 |

### Request/Response Examples

```typescript
// POST /api/resource
interface CreateRequest {
  name: string;
}

interface CreateResponse {
  id: string;
  name: string;
  createdAt: Date;
}
```

## Component Design

### New Components

| 组件 | 位置 | 职责 |
|------|------|------|
| ComponentA | src/components/ | 描述 |

### Modified Components

| 组件 | 变更类型 | 说明 |
|------|----------|------|
| ComponentB | 扩展 | 新增 props |

## State Management

<!-- 状态管理方案 -->

```typescript
// Store structure
interface Store {
  feature: {
    data: Entity[];
    loading: boolean;
    error: Error | null;
  };
}
```

## Error Handling

| 错误场景 | 处理方式 | 用户提示 |
|----------|----------|----------|
| 网络错误 | 重试3次 | "网络不稳定，请稍后" |
| 验证失败 | 显示详情 | "请检查输入" |

## Security Considerations

- [ ] 输入验证
- [ ] 权限检查
- [ ] 数据脱敏
- [ ] 审计日志

## Risks & Mitigations

| 风险 | 概率 | 影响 | 缓解措施 |
|------|------|------|----------|
| | | | |

## Dependencies

### New Dependencies

| Package | Version | 用途 |
|---------|---------|------|
| | | |

### Breaking Changes

- None / List breaking changes

## Testing Strategy

| 测试类型 | 覆盖目标 |
|----------|----------|
| 单元测试 | 80%+ |
| 集成测试 | 核心流程 |
| E2E 测试 | 用户场景 |

---

*Next: `openspec continue` to create specs*
