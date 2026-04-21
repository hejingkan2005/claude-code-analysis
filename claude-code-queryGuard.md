# queryGuard.ts

## 状态转移

- idle → dispatching (reserve)
- dispatching → running (tryStart)
- idle → running (tryStart, for direct user submissions)
- running → idle (end / forceEnd)
- dispatching → idle (cancelReservation, when processQueueIfReady fails)


## 具体场景

```
  queryA 开始 → tryStart() 返回 generation=1
  用户按 Esc → forceEnd() 将 generation 递增到 2
  queryB 开始 → tryStart() 返回 generation=2
  queryA 的 promise reject → finally 调用 end(1)
                             1 !== 2 → 返回 false → 跳过清理 ✓
  queryB 正常完成 → finally 调用 end(2)
                    2 === 2 → 返回 true → 执行清理 ✓
```

### generation作用
如果没有 _generation，queryA 被取消后其 finally 块仍会异步执行，调用 end() 把状态设回 idle 并执行清理（重置 spinner、发送 bridge result 等），破坏正在运行的 queryB 的状态。

## useSyncExternalStore的桥接作用

```
QueryGuard（同步世界）          React（异步批处理世界）
━━━━━━━━━━━━━━━━━━━━          ━━━━━━━━━━━━━━━━━━━━━━
tryStart()                     
  _status = 'running'          
  _notify() ─── emit() ──────→ useSyncExternalStore 感知到变化
                                → 调用 getSnapshot() → true
                                → 触发重渲染
                                → isQueryActive = true
                                → showSpinner 变 true
                                → UI 显示 spinner

end(gen)
  _status = 'idle'
  _notify() ─── emit() ──────→ useSyncExternalStore 感知到变化
                                → 调用 getSnapshot() → false
                                → 触发重渲染
                                → isQueryActive = false
                                → spinner 消失
```

### 代码
```
 Usage with React:
    const queryGuard = useRef(new QueryGuard()).current
    const isQueryActive = useSyncExternalStore(
      queryGuard.subscribe,
      queryGuard.getSnapshot,
    )
```