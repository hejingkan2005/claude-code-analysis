import { useState } from 'react'

/**
 * Observer Pattern Demo with React Hooks
 * 
 * How it works:
 * ✅ React internally subscribes to state change events
 * ✅ When setCount() is called, React's internal listeners are notified
 * ✅ Component re-renders automatically (observer pattern in action)
 */
export function MyComponent() {
  const [count, setCount] = useState(0)
  
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>React Observer Pattern Demo</h1>
      <p>Current count: {count}</p>
      <button 
        onClick={() => setCount(count + 1)}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px'
        }}
      >
        Increment Count
      </button>
    </div>
  )
}

export default MyComponent
