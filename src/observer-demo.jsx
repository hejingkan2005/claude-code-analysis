import { createRoot } from 'react-dom/client'
import MyComponent from '../designPatterns/behavioralPatterns/observer-react-hooks-demo.tsx'

const root = createRoot(document.getElementById('app'))
root.render(<MyComponent />)
