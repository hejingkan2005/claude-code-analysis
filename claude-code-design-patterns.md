## ✅ Patterns Actively Used

### **Creational Patterns** (3/5)
1. **Singleton** 
   - Global state management in state.ts
   - Single instance of application state (session ID, model settings, telemetry)
   - `getSessionId()`, `getOriginalCwd()` provide single access point

2. **Factory** 
   - Tool creation system in tools (BashTool, FileEditTool, GrepTool)
   - `createTool()` pattern for instantiating different tool types
   - Hook factory: `useCanUseTool()` creates permission decisions

3. **Builder** 
   - Message/prompt construction in API request building
   - Query builder for Claude API calls in `src/services/query.ts`
   - Tool parameter gathering and validation

### **Structural Patterns** (5/7)
4. **Adapter** 
   - Terminal UI adapters: ink custom Ink renderer adapts React to Terminal
   - OAuth adapter: bridges OAuth providers to local auth system
   - File system adapters for different environments

5. **Facade** 
   - bootstrap.ts — simplifies complex API calls
   - Tool UI components provide simplified interfaces
   - `interactiveHelpers.ts` — wraps complex Terminal rendering

6. **Decorator** 
   - React hooks wrap functionality: `useCanUseTool()`, `useDeferredValue()`
   - Tool execution wrappers add progress tracking, permission checks
   - withOAuth401Retry() wraps API calls with retry logic

7. **Proxy** 
   - `StreamingToolExecutor.ts` — proxies tool execution with progress tracking
   - Permission dialog acts as proxy to actual tool execution
   - Speculative classifier proxies permission decisions

8. **Composite** 
   - Tool system as composite tree (Tools contain sub-tools)
   - Message tree structure (message → tool_use → tool_result)
   - REPL screen hierarchy (components nest within components)

### **Behavioral Patterns** (8/11)
9. **Observer/Pub-Sub** 
   - React hooks system (useState listeners)
   - Event subscriptions: `createSignal()` in `src/utils/signal.js`
   - `onSessionSwitch.subscribe()` in bootstrap/state.ts
   - Telemetry event listeners

10. **State** 
    - Complex state machine in REPL.tsx (4745 lines)
    - Screen states: "prompt" vs "transcript"
    - Tool execution states: pending → streaming → complete
    - Permission states: ask → allow → deny

11. **Strategy** 
    - Tool execution strategies (parallel vs sequential)
    - Model provider strategies (firstParty, custom, etc.)
    - Permission strategies (interactive dialog, speculative classifier, auto-approve)
    - Rendering strategies (Ink, Terminal output)

12. **Command** 
    - Commands system in commands 
    - Each command encapsulates action (help, settings, install)
    - Command queue in REPL for user actions

13. **Iterator** 
    - Message history iteration in REPL
    - Tool results iteration
    - File search results pagination (GrepTool)

14. **Chain of Responsibility** 
    - Tool execution chain (permission check → execution → result processing)
    - API retry mechanism with OAuth refresh chain
    - Error handling chains with fallbacks

15. **Mediator** 
    - REPL acts as mediator between user input, API, and UI rendering
    - Bootstrap/state.ts mediates between components accessing global state
    - StreamingToolExecutor mediates between API and UI updates

16. **Template Method** 
    - Tool execution template: validate → execute → format result
    - API request template with common headers/auth
    - Screen rendering template in Ink components

## ❌ Patterns NOT Used (or Rarely)
- **Abstract Factory** — Not strongly present
- **Prototype** — Not typical for TypeScript classes
- **Flyweight** — No aggressive memory pooling
- **Interpreter** — Not a domain-specific language
- **Memento** — Limited undo/snapshot capability
- **Visitor** — Not used for tree traversal operations

## **Summary Table**

| Category | Used | Pattern |
|----------|------|---------|
| Creational | 3/5 | ✅ Singleton, Factory, Builder |
| Structural | 5/7 | ✅ Adapter, Facade, Decorator, Proxy, Composite |
| Behavioral | 8/11 | ✅ Observer, State, Strategy, Command, Iterator, Chain of Resp., Mediator, Template Method |
| **Total** | **16/23** | **~70% of GoF patterns** |

The codebase is particularly heavy on **behavioral patterns** (React state management, tool execution flows) and **structural patterns** (adapting React to Terminal, wrapping tool execution). This makes sense for a complex interactive CLI application.