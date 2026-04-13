---
layout: default
title: Command Pattern
parent: Behavioral Patterns
nav_order: 1
---
# Command设计模式

- Commands system in commands
- Each command encapsulates action (help, settings, install)
- Command queue in REPL for user actions

## 使用场景：Slash Commands System

```js
// src/types/command.ts

// 一个有效的 Command 必须：
// 包含 CommandBase 的所有属性（公共部分）
// 同时包含以下三者之一的属性（特定部分）
export type Command = CommandBase & 
  (PromptCommand | LocalCommand | LocalJSXCommand)
```

- LocalCommand - 同步本地命令，如/clear, /compact, /cost
- LocalJSXCommand -  用户交互的UI命令, 如/model, /config, /permission
- PromptCommand - 需要AI处理的技能`/SKILLS`

完整的调用流程:

```
用户输入 /command
    ↓
processSlashCommand()
    ↓
getCommand(commandName)  ← 获取命令对象（包含 type 字段）
    ↓
getMessagesForSlashCommand(command)
    ↓
switch (command.type) {
  ├─ 'local-jsx'
  │   ├─ command.load()  ← 延迟加载模块
  │   └─ mod.call(onDone, context, args)
  │       └─ 返回 React.ReactNode
  │       └─ 通过 setToolJSX() 渲染 UI
  │
  ├─ 'local'
  │   ├─ command.load()  ← 延迟加载模块
  │   └─ mod.call(args, context)
  │       └─ 同步返回 LocalCommandResult
  │       └─ 转换为消息并返回
  │
  └─ 'prompt'
      ├─ 检查 command.context === 'fork'
      │   ├─ YES → executeForkedSlashCommand()
      │   │        └─ 启动子代理执行
      │   └─ NO → getMessagesForPromptSlashCommand()
      │           └─ 内联 prompt 发送给 AI
}
```
