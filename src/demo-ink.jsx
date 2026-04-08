// 使用 Ink 库在终端中渲染 React 组件
import React from 'react'
import { render, Box, Text } from 'ink'
import { MessageBox } from './MessageBox.jsx'

// 使用 Ink 在终端中渲染
render(
  <Box borderStyle="round" paddingX={1}>
    <Text>Hello</Text>
  </Box>
)
