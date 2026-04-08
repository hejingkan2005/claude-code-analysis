# REPL Screen

## speculationAccept

这是"推测执行"（speculation）机制的接受信号。当 Claude 预测用户会接受某个操作（比如 bash 命令的执行结果），系统会提前执行并缓存结果。当用户确实接受时，speculationAccept 被传入，跳过正常的输入处理流程，直接调用 handleSpeculationAccept 应用已缓存的结果。

