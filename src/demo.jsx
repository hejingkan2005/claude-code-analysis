// 使用 react-dom
import { createRoot } from 'react-dom/client'
import { MessageBox } from './MessageBox'

const root = createRoot(document.getElementById('app'))
root.render(<MessageBox text="Hello" />)
