# Tools

## Speculative Classifier 介绍

### 工作流程
```
T=0ms: 用户提交 Bash 命令
    ↓
T=0+: 立即启动 Speculative Classifier
    ├─ 消耗: <5ms
    └─ 不阻塞主流程
    ↓
T=0-2000ms: 后台分类执行
    ├─ 检查 Allow 规则
    ├─ 计算置信度
    └─ 返回结果
    ↓
权限对话构建并发行进
    ↓
T=2000ms: 最多等 2 秒
    ├─ 如果分类器返回高置信度 → ✅ 自动批准
    └─ 如果超时或低置信度 → ❓ 显示权限对话
    ↓
执行工具或等待用户确认
```

### 应用场景示例

场景 A: 快路径（无对话）
```
用户: $ claude run npm test

内部流程:
1. Bash 工具提交
2. startSpeculativeClassifierCheck 启动
3. 分类器在 500ms 内完成
4. 结果: 高置信度 match "npm test"
5. ✅ 自动批准，直接执行

用户体验: 立即看到命令执行，无任何对话
```

场景 B: 对话路径
```
用户: $ claude run sudo rm -rf /

内部流程:
1. Bash 工具提交
2. startSpeculativeClassifierCheck 启动
3. 分类器评估
4. 结果: 低置信度或不匹配
5. ❓ 显示权限对话给用户
6. 等待用户确认

用户体验: 看到警告对话，用户决定是否执行
```

场景 C: 超时路径
```
用户: $ claude run some-complex-command

内部流程:
1. Bash 工具提交
2. startSpeculativeClassifierCheck 启动
3. 分类器正在计算中...
4. 2000ms 超时，分类未完成
5. ❓ 显示权限对话（使用默认策略）
6. 同时后台分类继续...

用户体验: 显示对话，用户可以立即回应
            或者等待分类完成自动批准
```

从泄露的源码来看，`classifyBashCommand`这个功能目前还在内部测试阶段