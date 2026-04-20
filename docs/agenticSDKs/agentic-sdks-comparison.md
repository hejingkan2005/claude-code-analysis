

# Agentic SDK Comparison (April 2026)

**Reference:** [Composio - Agent SDKs Comparison](https://composio.dev/content/claude-agents-sdk-vs-openai-agents-sdk-vs-google-adk)

Many agentic SDKs are emerging in 2026. While most handle the fundamentals well: defining agents, connecting tools, running tool‑calling conversations, streaming responses, producing structured outputs, and supporting async execution. They begin to diverge significantly beyond the quick‑start experience. These differences can have a real impact in practice, which is why I put together a comparison of the most widely used frameworks.

## Comparison Table

| Feature | Claude Agent SDK | OpenAI Agents SDK | Google ADK | GitHub Copilot SDK | Microsoft Agent Framework |
|--------|------------------|------------------|------------|-------------------|---------------------------|
| **Primary language support** | Python, TypeScript (first‑class, parity) | Python (primary), TypeScript/JS (separate repo, ~6 minor versions behind) | Python, Java, Go (GA); TypeScript (preview, v0.2) | TypeScript/Node, Python, Go, .NET/C#, Java — all in Public Preview (v0.2.x) | Python (agent‑framework v1.0.x, GA) and .NET (Microsoft.Agents.AI v1.1.x, GA); no first‑party TypeScript or Java SDK |
| **Model support** | ⚠️ Claude‑only models; Bedrock / Vertex AI / Azure AI Foundry are delivery channels, not alternative model vendors | ✅ OpenAI Responses & Chat Completions APIs; Azure OpenAI (incl. Entra ID via `azure-identity`) and any OpenAI‑compatible endpoint (Ollama, vLLM, local servers) via injected `AsyncOpenAI` / `AsyncAzureOpenAI`; 100+ additional LLMs via LiteLLM / any‑llm extensions | ✅ Gemini‑optimized; 100+ via LiteLLM; native Claude, Gemma, Vertex AI, Apigee | ✅ Copilot‑routed models (GPT‑4.1, GPT‑5, GPT‑5.2‑Codex, Claude Sonnet 4 / 4.5) + BYOK (OpenAI, Azure OpenAI, Azure AI Foundry, Anthropic, Ollama, Microsoft Foundry Local). BYOK uses static API keys only | ✅ Azure OpenAI, OpenAI (Chat + Responses), Microsoft Foundry (any vendor incl. Anthropic), Anthropic direct, Ollama, GitHub Copilot, Copilot Studio; custom via `IChatClient` / `ChatClientProtocol` |
| **Multi‑agent orchestration** | ✅ Subagents (parallel, flat) | ✅ Handoffs (declarative delegation) | ✅ Workflow Agents (Sequential / Parallel / Loop) + Sub‑agents (GA); Graph workflows in 2.0 Alpha | ✅ Custom agents with intent‑based auto‑selection; sub‑agent lifecycle events; per‑agent tool & MCP scoping. No graph/workflow engine | ✅ Graph‑based workflow engine (typed edges, fan‑out/fan‑in, supersteps); Sequential, Concurrent, Magentic (manager‑coordinated), Handoffs (A2A), Group Chat, Agent‑as‑Tool |
| **Tool integration** | In‑process SDK MCP tools; first‑party MCP servers (Slack, GitHub, Sentry, Notion, Asana, Postgres) | Function tools; hosted OpenAI tools (WebSearch, FileSearch, CodeInterpreter, ImageGen, HostedMCP, ComputerTool, ShellTool, ApplyPatch); MCP (hosted + self‑managed) | ~60 first‑party integrations (Google Search, Vertex AI Search, Code Exec, BigQuery, Stripe, GitHub…); native McpToolset; A2A delegation | Built‑in CLI tools (file ops, Git, bash, web — `--allow-all` by default); custom tools registrable on session; full native MCP client | Function tools (`@tool` / `AIFunctionFactory`); hosted Code Interpreter / Web Search / File Search via OpenAI/Azure OpenAI/Foundry; local + hosted MCP; Agent‑as‑Tool; tool approval middleware |
| **OS / system access** | ✅ Direct Bash, FS read/write/edit, glob (sandboxing on macOS/Linux) | ⚠️ ComputerTool / ShellTool / ApplyPatchTool exist but require user‑provided harness | ❌ Sandboxed only (Vertex AI Sandbox / Code Interpreter Extension / Computer Use vision tool) | ✅ File system, shell/bash, Git, web requests via the embedded CLI; gated by `onPermissionRequest` + per‑agent tool scoping | ❌ No native local OS execution; sandboxed Code Interpreter via hosted services only |
| **Voice / realtime** | ❌ Not in Agent SDK | ✅ VoicePipeline (TTS/STT) + Realtime Agents (`gpt‑realtime`) over WebRTC/WebSocket | ✅ Native Gemini Live API: bidi audio/video/text, VAD, interruption, audio transcription, session resumption | ❌ Not supported | ❌ Not built‑in (no Realtime API integration as of Apr 2026) |
| **State management** | Auto context compaction (~95% threshold); session persistence via SessionStore protocol (Redis, Postgres, S3, custom backends) | Serializable `RunState` + Sessions: SQLite, AsyncSQLite, Redis, SQLAlchemy, Dapr, OpenAIConversations, Encrypted, AdvancedSQLite | Sessions + State + Memory services; rewind to prior turn; persistent backends | ✅ Resumable sessions via `sessionId` persisted to `~/.copilot/session-state/`; auto‑checkpoints; auto‑compaction (80%/95%) | `AgentSession` with chat‑history providers; workflow checkpointing; Foundry persistent agents; Memory / RAG / GraphRAG providers |
| **Observability / tracing** | Implicit tool traces via message stream; Monitor tool | OpenAI Traces dashboard; AgentOps, Logfire, Langfuse, Phoenix, MLflow, Braintrust, W&B | ADK Web Dev UI; Cloud Trace, AgentOps, Phoenix, MLflow, Monocle, LangWatch, W&B Weave | ✅ Built‑in OpenTelemetry; W3C trace context SDK ↔ CLI | ✅ Built‑in OpenTelemetry (GenAI semantic conventions); Azure Monitor / App Insights / Aspire |
| **Guardrails / safety** | `allowed_tools` allowlist; `permission_mode` variants | Input / output / tool guardrails; first‑turn semantics | Callbacks, Plugins, Tool Confirmation (HITL), A2A isolation, Gemini safety filters | `onPermissionRequest`; per‑agent allow/deny; pre/post hooks | Middleware pipeline; tool approval; Azure Content Safety; HITL gates |
| **MCP support** | ✅ Stdio / SSE / HTTP; first‑party MCP servers | ✅ Hosted MCP + self‑managed (HTTP, SSE, stdio) | ✅ Native McpToolset (consume + expose) | ✅ Native MCP client; stdio + HTTP/SSE | ✅ Native MCP client + Foundry‑hosted MCP (preview) |
| **Best suited for** | OS‑level automation, dev assistants, “agent‑as‑computer” | Rapid prototyping, voice/realtime, heterogeneous fleets | Enterprise, Google Cloud‑centric, governance‑heavy | Embedding agentic code workflows into services and pipelines | Enterprise Azure workflows, .NET shops, complex orchestration, SK / AutoGen migration |
| **Key limitations** | Claude‑only models; flat subagents; no voice | No bundled OS harness; TS lags Python | TS still preview; Graph workflows Alpha; no local OS | Public Preview; Copilot subscription unless BYOK; static keys only; no voice; no sandbox | No first‑party TS/Java; no voice; no local OS; many Foundry features still

## Multi-agent Orchestration


### Handoffs (OpenAI)

Handoffs allow an agent to delegate tasks to another agent. This is particularly useful in scenarios where different agents specialize in distinct areas. For example, a customer support app might have agents that each specifically handle tasks like order status, refunds, FAQs, etc.

Source: https://openai.github.io/openai-agents-python/handoffs/

#### Basic usage

```py
from agents import Agent, handoff

billing_agent = Agent(name="Billing agent")
refund_agent = Agent(name="Refund agent")

triage_agent = Agent(name="Triage agent", handoffs=[billing_agent, handoff(refund_agent)])
```

#### Customizing handoffs via the `handoff()` function

```py
from agents import Agent, handoff, RunContextWrapper

def on_handoff(ctx: RunContextWrapper[None]):
    print("Handoff called")

agent = Agent(name="My agent")

handoff_obj = handoff(
    agent=agent,
    on_handoff=on_handoff,
    tool_name_override="custom_handoff_tool",
    tool_description_override="Custom description",
)
```

### A2A (Microsoft) 

The Agent-to-Agent (A2A) protocol enables standardized communication between agents, allowing agents built with different frameworks and technologies to communicate seamlessly.

Source: https://learn.microsoft.com/en-us/agent-framework/integrations/a2a?tabs=dotnet-cli%2Cuser-secrets&pivots=programming-language-python

#### Agent discovery through agent cards

```py
import asyncio
import httpx
from a2a.client import A2ACardResolver
from agent_framework.a2a import A2AAgent

async def main():
    a2a_host = "https://your-a2a-agent.example.com"

    # 1. Discover the remote agent's capabilities
    async with httpx.AsyncClient(timeout=60.0) as http_client:
        resolver = A2ACardResolver(httpx_client=http_client, base_url=a2a_host)
        agent_card = await resolver.get_agent_card()
        print(f"Found agent: {agent_card.name}")

    # 2. Create an A2AAgent and send a message
    async with A2AAgent(
        name=agent_card.name,
        agent_card=agent_card,
        url=a2a_host,
    ) as agent:
        response = await agent.run("What are your capabilities?")
        for message in response.messages:
            print(message.text)

asyncio.run(main())
```

### Microsoft Agent Framework - Agent-as-tools pattern

Agent-as-tools involves a primary agent that delegates sub tasks to other agents and once the agent completes the sub task, control returns to the primary agent.

Source: https://github.com/microsoft/agent-framework/blob/main/python/samples/02-agents/providers/openai/client_with_agent_as_tool.py

```py
import asyncio
from agent_framework import Agent, FunctionInvocationContext
from agent_framework.openai import OpenAIChatClient
from collections.abc import Awaitable, Callable

async def logging_middleware(
    context: FunctionInvocationContext,
    call_next: Callable[[], Awaitable[None]],
) -> None:
    """Middleware that logs tool invocations to show the delegation flow."""
    print(f"[Calling tool: {context.function.name}]")
    print(f"[Request: {context.arguments}]")
    await call_next()
    print(f"[Response: {context.result}]")

async def main() -> None:
    client = OpenAIChatClient()

    # Create a specialized writer agent
    writer = Agent(
        client=client,
        name="WriterAgent",
        instructions="You are a creative writer. Write short, engaging content.",
    )

    # Convert writer agent to a tool using as_tool()
    writer_tool = writer.as_tool(
        name="creative_writer",
        description="Generate creative content like taglines, slogans, or short copy",
        arg_name="request",
        arg_description="What to write",
    )

    # Create coordinator agent with writer as a tool
    coordinator = Agent(
        client=client,
        name="CoordinatorAgent",
        instructions="You coordinate with specialized agents. Delegate writing tasks to the creative_writer tool.",
        tools=[writer_tool],
        middleware=[logging_middleware],
    )

    query = "Create a tagline for a coffee shop"
    print(f"User: {query}")
    result = await coordinator.run(query)
    print(f"Coordinator: {result}")

asyncio.run(main())
```

#### Tool Function Limitations vs Agent-as-Tool Benefits

| Tool Function Limitations | Agent-as-Tool Benefits |
| --- | --- |
| ❌ No intelligence or reasoning | ✅ Full LLM reasoning & intelligent analysis |
| ❌ Single, fixed behavior | ✅ Context-aware, adaptive responses |
| ❌ Cannot use its own tools | ✅ Can invoke its own tools and capabilities |
| ❌ Cannot make decisions or break down complex tasks | ✅ Autonomous task decomposition & decision-making |
| ❌ No independent state management | ✅ Independent state & shared session memory |

## State Management

### Session Store (Claude Agent SDK)

The Claude Agent SDK provides session persistence through a SessionStore protocol that allows you to persist conversation state and resume sessions from external storage backends (Redis, Postgres, S3, etc.).

Source: https://github.com/anthropics/claude-agent-sdk-python/tree/main/examples/session_stores

```py
import asyncio
import redis.asyncio as redis
from claude_agent_sdk import ClaudeSDKClient, ClaudeAgentOptions
from redis_session_store import RedisSessionStore  # Reference adapter from examples

async def main():
    # 1. Initialize Redis session store
    redis_client = redis.Redis(
        host="localhost",
        port=6379,
        decode_responses=True
    )
    session_store = RedisSessionStore(client=redis_client)

    # 2. Create agent options with session persistence
    options = ClaudeAgentOptions(
        session_store=session_store,
        session_id="my-project-session-123",  # Optional: explicit session ID
        resume="my-project-session-123",       # Resume from this session ID
        # fork_session=True                    # Uncomment to fork instead of continue
    )

    # 3. Create client and resume conversation
    async with ClaudeSDKClient(options=options) as client:
        # Check current context usage and autocompact status
        usage = await client.get_context_usage()
        print(f"Context used: {usage.context_used_tokens}/{usage.context_budget_tokens}")
        print(f"Autocompact enabled: {usage.is_auto_compact_enabled}")
        
        # Continue the conversation from previous session
        response = await client.query(
            prompt="Continue from where we left off. What was the last task?"
        )
        print(f"Agent response: {response}")

        # Save new state back to Redis (automatic)
        print("Session persisted to Redis")

# Run the example
asyncio.run(main())
```

### AI Foundry Persistent Agents with Semantic Memory

Foundry persistent agents specifically refer to agents deployed in Azure AI Foundry that leverage semantic memory capabilities through the `FoundryMemoryProvider`. Unlike generic file or database persistence, this provides:

Key Azure Foundry Features:

1. FoundryMemoryProvider — Semantic memory stored in Azure Memory Stores

1. User Scoped Memories — Memories tied to specific users or sessions

1. Automatic Memory Management:
    - User profiles automatically extracted from conversations
    - Chat summaries for long conversations (optional)
    - Semantic search across memory store

1. Azure Resources Required:
   - Azure OpenAI embedding model for semantic search
   - Azure OpenAI chat model
   - Azure Memory Store service

Source: https://github.com/microsoft/agent-framework/blob/main/python/samples/02-agents/context_providers/azure_ai_foundry_memory.py

```py
async def main() -> None:
    # Azure AI Foundry endpoint from environment
    endpoint = os.environ["FOUNDRY_PROJECT_ENDPOINT"]
    
    async with (
        AzureCliCredential() as credential,
        AIProjectClient(endpoint=endpoint, credential=credential) as project_client,
    ):
        # 1. Create Azure Memory Store with semantic capabilities
        memory_store_name = f"agent_framework_memory_{datetime.now(timezone.utc).strftime('%Y%m%d_%H%M%S')}"
        
        # Configure memory store options
        options = MemoryStoreDefaultOptions(
            chat_summary_enabled=False,      # Optional: summarize chat history
            user_profile_enabled=True,       # Extract user preferences/profile
            user_profile_details="Avoid sensitive data like age, financials, precise location"
        )
        
        memory_store_definition = MemoryStoreDefaultDefinition(
            chat_model=os.environ["FOUNDRY_MODEL"],                    # e.g., gpt-4
            embedding_model=os.environ["AZURE_OPENAI_EMBEDDING_MODEL"],  # e.g., text-embedding-3-small
            options=options,
        )
        
        print(f"Creating Azure Memory Store: {memory_store_name}...")
        
        # Create memory store in Azure
        memory_store = await project_client.beta.memory_stores.create(
            name=memory_store_name,
            description="Semantic memory store for persistent agent",
            definition=memory_store_definition,
        )
        
        print(f"✓ Created Memory Store: {memory_store.name}")
        print(f"  ID: {memory_store.id}\n")
        
        # 2. Create Azure-specific chat client
        client = FoundryChatClient(project_client=project_client)
        
        # 3. Create FoundryMemoryProvider for semantic memory
        memory_provider = FoundryMemoryProvider(
            project_client=project_client,
            memory_store_name=memory_store.name,
            scope="user_123",                    # Scope memories to specific user
            update_delay=0,                      # Immediately store memories (set > 0 in production)
        )
        
        # 4. Create agent with Azure memory persistence
        async with Agent(
            name="AzureFoundryAgent",
            client=client,
            instructions="""You are a helpful assistant. You have access to semantic memories
            from previous conversations. Use these memories to provide personalized responses.""",
            context_providers=[memory_provider, InMemoryHistoryProvider(load_messages=False)],
            default_options={"store": False},
        ) as agent:
            
            session = agent.create_session()
            
            # --- Turn 1: Store user preferences as memories ---
            print("=== Turn 1: Learning User Preferences ===")
            query1 = "I prefer dark roast coffee and I'm allergic to nuts. I live in Seattle."
            print(f"User: {query1}")
            result1 = await agent.run(query1, session=session)
            print(f"Agent: {result1}\n")
            
            # Wait for Azure to process memory embeddings
            print("⏳ Storing semantic memories to Azure Memory Store...")
            await asyncio.sleep(5)
            
            # --- Turn 2: Recall memories in new context ---
            print("=== Turn 2: Using Stored Memories ===")
            query2 = "What coffee and snack would you recommend for me?"
            print(f"User: {query2}")
            result2 = await agent.run(query2, session=session)
            print(f"Agent: {result2}\n")
            
            # --- Turn 3: Verify memory recall ---
            print("=== Turn 3: Confirm Stored Memories ===")
            query3 = "What do you remember about my preferences?"
            print(f"User: {query3}")
            result3 = await agent.run(query3, session=session)
            print(f"Agent: {result3}\n")
            
            # 5. Retrieve and display stored memories from Azure
            print("📋 Stored Memories in Azure:")
            memories = await project_client.beta.memory_stores.search_memories(
                name=memory_store.name,
                scope="user_123"
            )
            for memory in memories.memories:
                print(f"  • {memory.memory_item.content}")
            
            # 6. Cleanup: Delete memory store
            await project_client.beta.memory_stores.delete(memory_store_name)
            print("\n✓ Memory store cleaned up")

if __name__ == "__main__":
    asyncio.run(main())
```

## Guardrails / Safety

### "default" Permission_mode vs. HITL (Human-in-the-loop) Pattern

**"default" permission_mode - Simple Approval:**
```python
Agent: "I want to delete file 'data.txt'"
User: "Yes" or "No"
→ Action executes or stops
```

**HITL Pattern - Active Involvement:**
```python
Agent: "I want to delete file 'data.txt' to clean up workspace"
User: "No, don't delete. Instead, archive it in the /backup folder"
Agent: "Understood. Revised plan: Archive file instead"
→ Agent re-plans with human guidance
```

"default" mode = reactive binary approval (yes/no), HITL = active human-agent collaboration where humans can modify agent plans and provide feedback.

## Which One to Choose?

- OpenAI Agents SDK: Choose if you want a lightweight framework with strong voice support and the ability to swap LLMs freely.

- Claude Agent SDK: Choose if your agents need deep OS access (developer assistants) or follow a "give the agent a computer" paradigm.

- Google ADK: Choose if you are building enterprise-grade systems on Google Cloud or need multi-language support (Python/Java/Go). Requires a lot of manual plumbing and security.

- GitHub Copilot SDK: Choose if you want to embed a code-centric agent runtime into your app across many languages (Python/Node/Go/.NET/Java) with GitHub-native auth and BYOK. Still in Public Preview.

- Microsoft Agent Framework: Choose if you need graph-based multi-agent workflows on Azure AI Foundry, work in a .NET or Python enterprise stack, or are migrating from Semantic Kernel / AutoGen.
