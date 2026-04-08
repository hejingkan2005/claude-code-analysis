// 使用 Ink 库在终端中渲染 React 组件
import React from 'react'
import { render, Box, Text } from 'ink'

// 使用 Ink 在终端中渲染
render(
  React.createElement(
    Box,
    { borderStyle: 'round', paddingX: 1 },
    React.createElement(Text, null, 'Hello')
  )
)
