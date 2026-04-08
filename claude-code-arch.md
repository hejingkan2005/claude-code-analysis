# Claude Code 源码

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      ENTRYPOINTS                            │
│  cli.tsx  │  mcp.ts  │  sdk/  │  init.ts                   │
└─────┬─────┴────┬─────┴───┬────┴────┬────────────────────────┘
      │          │         │         │
      ▼          ▼         ▼         ▼
┌─────────────────────────────────────────────────────────────┐
│                    MAIN LOOP (main.tsx)                      │
│  Bootstrap → Auth → REPL Screen → Agent Message Loop        │
│  Handles: streaming, tool dispatch, conversation state      │
└────────┬──────────────┬─────────────┬───────────────────────┘
         │              │             │
   ┌─────▼─────┐ ┌─────▼──────┐ ┌───▼────────────┐
   │   STATE    │ │   TOOLS    │ │   SERVICES     │
   │ AppState   │ │ 40+ tools  │ │ api, mcp,      │
   │ Store      │ │ BashTool   │ │ plugins, lsp,  │
   │ Selectors  │ │ FileEdit   │ │ oauth, analytics│
   └────────────┘ │ Agent      │ └────────────────┘
                  │ WebSearch  │
                  │ MCP, REPL  │
                  │ Skills...  │
                  └─────┬──────┘
                        │
              ┌─────────▼─────────┐
              │  TASK SYSTEM       │
              │  local_bash        │
              │  local_agent       │
              │  remote_agent      │
              │  in_process_teammate│
              │  local_workflow    │
              │  dream             │
              └────────────────────┘
```

## React + Ink


### 核心技术架构

```
React 组件
    ↓
Virtual DOM
    ↓
Ink 渲染引擎
    ↓
Virtual Screen (虚拟屏幕)
    ↓
ANSI Escape Codes
    ↓
Terminal 输出
```

Claude Code并没有引用开源库https://github.com/vadimdemedes/ink, 而是自己实现了定制化的Ink, 主要文件是ink.tsx.

### 渲染流程对比
#### 传统浏览器应用
```
React 组件代码
    ↓
React Virtual DOM（内存中）
    ↓ React diff 算法
变化列表（哪些节点变了）
    ↓ ReactDOM 渲染器
真实 DOM 操作
    ↓
浏览器渲染
    ↓
用户看到的网页
```

#### Claude Code (Terminal 应用)
```
React 组件代码
    ↓
React Virtual DOM（内存中）— 相同！
    ↓ React diff 算法
变化列表（哪些节点变了）
    ↓ Ink 渲染器（自定义）
虚拟屏幕差异
    ↓ ANSI 编码
Terminal 输出
    ↓
用户看到的 Terminal UI
```

- ANSI 编码是 Terminal 和应用之间的唯一通讯语言。它允许应用控制光标、颜色和样式，使复杂的 Terminal UI 成为可能。
