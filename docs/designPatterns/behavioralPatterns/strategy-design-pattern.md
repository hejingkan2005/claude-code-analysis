---
layout: default
title: Strategy Pattern
parent: Behavioral Patterns
nav_order: 1
---
# Strategy设计模式

- Tool execution strategies (parallel vs sequential)
- Model provider strategies (firstParty, custom, etc.)
- Permission strategies (interactive dialog, speculative classifier, auto-approve)

## 使用场景：Tool execution strategies (parallel vs sequential)

```js
// src/tools/BashTool/BashTool.tsx
isConcurrencySafe(input) {
  // 策略决策：是否只读？
  return this.isReadOnly?.(input) ?? false
}

// 实现：检查命令是否修改系统
isReadOnly(input) {
  const compoundCommandHasCd = commandHasAnyCd(input.command)
  const result = checkReadOnlyConstraints(input, compoundCommandHasCd)
  return result.behavior === 'allow'  // 只读 = 可并行
}
```

为了提升读操作的执行效率，同时保证写操作的一致性，对工具的执行采取了分别采取了灵活的执行策略，决策树如下：

```
工具请求来临
  ↓
isConcurrencySafe(input)?
  ├─ YES (只读) → 并行策略
  │  ├─ 与其他只读工具批量并行执行
  │  └─ 最多并行 10 个（getMaxToolUseConcurrency）
  │
  └─ NO (写操作) → 顺序策略
     ├─ 单独执行，独占系统资源
     └─ 等待完成后才执行下一个
```

工具的分批处理:
```js
// src/services/tools/toolOrchestration.ts

/**
 * 将工具调用分成批次：
 * - 单个非并发安全工具 = 1批
 * - 多个连续的并发安全工具 = 1批
 */
function partitionToolCalls(
  toolUseMessages: ToolUseBlock[],
  toolUseContext: ToolUseContext,
): Batch[] {
  return toolUseMessages.reduce((acc: Batch[], toolUse) => {
    const tool = findToolByName(toolUseContext.options.tools, toolUse.name)
    const parsedInput = tool?.inputSchema.safeParse(toolUse.input)
    
    // 决定并发安全性
    const isConcurrencySafe = parsedInput?.success
      ? (() => {
          try {
            return Boolean(tool?.isConcurrencySafe(parsedInput.data))
          } catch {
            return false  // 错误时保守处理：当作不安全
          }
        })()
      : false
    
    // 批处理逻辑
    if (isConcurrencySafe && acc[acc.length - 1]?.isConcurrencySafe) {
      // 加入前一批（都是并发安全）
      acc[acc.length - 1]!.blocks.push(toolUse)
    } else {
      // 新建一批
      acc.push({ isConcurrencySafe, blocks: [toolUse] })
    }
    
    return acc
  }, [])
}
```

## 使用场景: Model provider strategies

```js
// src/utils/model/providers.ts
export type APIProvider = 'firstParty' | 'bedrock' | 'vertex' | 'foundry'

export function getAPIProvider(): APIProvider {
  return isEnvTruthy(process.env.CLAUDE_CODE_USE_BEDROCK)
    ? 'bedrock'
    : isEnvTruthy(process.env.CLAUDE_CODE_USE_VERTEX)
      ? 'vertex'
      : isEnvTruthy(process.env.CLAUDE_CODE_USE_FOUNDRY)
        ? 'foundry'
        : 'firstParty'
}
```

### 延迟加载

```js
// src/services/api/client.ts

// 只在选中该策略时才动态导入 SDK，减少打包体积和启动时间
const { AnthropicFoundry } = await import('@anthropic-ai/foundry-sdk')
```
