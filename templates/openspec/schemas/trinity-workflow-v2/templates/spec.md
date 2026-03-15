# Spec: {{feature-name}}

> Created: {{date}}
> Based on: design.md

## Feature: {{feature-name}}

**Description:**
<!-- 功能描述 -->

---

## Scenario 1: [场景名称]

### Happy Path

```gherkin
Feature: {{feature-name}}

  Scenario: [成功场景]
    Given [前置条件]
    When [触发动作]
    Then [期望结果]

  Scenario: [另一个成功场景]
    Given [前置条件]
    And [额外条件]
    When [触发动作]
    Then [期望结果]
    And [额外验证]
```

### Edge Cases

```gherkin
  Scenario: [边界情况]
    Given [边界条件]
    When [触发动作]
    Then [期望处理]
```

### Error Cases

```gherkin
  Scenario: [错误情况]
    Given [错误前置条件]
    When [触发动作]
    Then [错误提示]
```

---

## Acceptance Criteria

- [ ] Given 条件 A，执行操作 B，结果 C
- [ ] 错误情况正确处理
- [ ] 边界情况正确处理
- [ ] 性能符合预期

## Test Data

```json
{
  "testInput": "value",
  "expectedOutput": "expected"
}
```

## Notes

<!-- 补充说明 -->

---

*Part of change: {{change-name}}*
