---
layout: default
title: Observer / Pub-Sub Pattern
parent: Behavioral Patterns
nav_order: 1
---
# Observer/Pub-Sub设计模式

- Signal
- React hooks system (useState listeners)
- Telemetry event listeners

## Observer/Pub-Sub原型

![observer-design-pattern](../image/observer-design-pattern.png)

*Image source: [Observer Pattern | Set 1 (Introduction) - GeeksforGeeks](https://www.geeksforgeeks.org/system-design/observer-pattern-set-1-introduction/)*

## Signal使用场景

与存储模式(AppState, createStore)不同，订阅者只需要知道“某件事发生了”，而不需要知道“当前状态值是什么”。

例如

```js
// Example usage:
function handler(source: string): void {
  console.log(`Setting changed: ${source}`)
}

// 注册回调的函数`changed`
const changed = createSignal<[string]>()
// 实际的回调函数`handler`
const unsubscribe = changed.subscribe(handler)
changed.emit('foo')
changed.emit('bar')

// Unsubscribe the handler
unsubscribe()
changed.emit('baz')
```

输出

```
Setting changed: foo
Setting changed: bar
```

## useState使用场景

React Hooks是内置的Observer模型

```js
export function MyComponent() {
  const [count, setCount] = useState(0)
  // ✅ React internally subscribes to 'count'
  // ✅ When setCount() is called, all listeners are notified
  // ✅ Component re-renders (observer pattern)
  
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

## useEffect在CC的使用场景

```js
// src/components/SessionManager.tsx
export function SessionManager() {
  const [sessionId, setSessionId] = useState<SessionId>()
  
  useEffect(() => {
    // 第1步：订阅
    const unsubscribe = onSessionSwitch((newId) => {
      setSessionId(newId)
      logEvent('session_switched', { id: newId })
    })
  
    // 第2步：返回清理函数
    return () => {
      console.log('Unsubscribing from session changes')
      unsubscribe()
    }
  }, [])  // 仅一次
}

// 生命周期：
// 挂载:   onSessionSwitch 订阅器被添加
// 卸载:   unsubscribe() 被调用，订阅取消
```

## Telemetry使用场景

Claude Code的telemetry采用了多层的观察者模式：

```
┌─────────────────────────────────────────────────────────────┐
│  Event Source (调用 logEvent)                               │
└────────────────────┬────────────────────────────────────────┘
                     │ logEvent(eventName, metadata)
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  Analytics Sink (index.ts)                                  │
│  - Event Queue (在 sink 初始化前缓冲事件)                      │
│  - attachAnalyticsSink() 注册观察者                           │
└────────────────────┬────────────────────────────────────────┘
                     │ emit logEvent
                     ▼
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
┌──────────────────┐    ┌──────────────────────┐
│  Datadog Sink    │    │  1P Event Logger     │
│  (track event)   │    │  (OpenTelemetry)     │
└──────────────────┘    └──────────────────────┘
```

AnalyticsSink 接口（观察者）

```js
export type AnalyticsSink = {
  logEvent: (eventName: string, metadata: LogEventMetadata) => void
  logEventAsync: (eventName: string, metadata: LogEventMetadata) => Promise<void>
}
```

`logEventImpl`, `logEventAsyncImpl`是对 `logEvent`, `logEventAsync`的具体实现。`logEventImpl`可以控制对事件的采样，决定哪些情况下需要删去敏感信息，哪些情况下可以包含敏感信息。

Event Publisher（发布者）

```js
// src/services/analytics/index.ts

// 全局 sink 实例（单一观察者）
let sink: AnalyticsSink | null = null

// 事件队列（缓冲未发送的事件）
const eventQueue: QueuedEvent[] = []

// 发布事件
export function logEvent(
  eventName: string,
  metadata: LogEventMetadata,
): void {
  if (sink === null) {
    // 缓冲事件直到 sink 初始化
    eventQueue.push({ eventName, metadata, async: false })
    return
  }
  // 发送给已注册的观察者
  sink.logEvent(eventName, metadata)
}

// 注册观察者
export function attachAnalyticsSink(newSink: AnalyticsSink): void {
  if (sink !== null) return  // 已注册，忽略
  
  sink = newSink
  
  // 处理缓冲的事件（观察者模式的关键：异步驱动）
  if (eventQueue.length > 0) {
    const queuedEvents = [...eventQueue]
    eventQueue.length = 0
  
    queueMicrotask(() => {
      for (const event of queuedEvents) {
        sink!.logEvent(event.eventName, event.metadata)
      }
    })
  }
}
```

这里当 `sink`还没有被初始化时，`logEvent`事件会被暂时先记录到 `eventQueue`。 当 `attachAnalyticsSink`被调用之后，就会以异步的方式处理缓冲的事件,这也是这段代码的一个巧妙之处。

比如 `main.tsx` 启动后：

1. 导入模块（很多 logEvent）  ← sink = null
2. 初始化认证                   ← sink = null
3. initializeAnalyticsSink()  ← sink 才被附加
4. 进入 REPL                    ← sink != null
