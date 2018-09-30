import React from 'react'
import StyleButton from './StyleButton'

// define our inline styles
let INLINE_STYLES = [
  { icon: 'bold', style: 'BOLD' },
  { icon: 'italic', style: 'ITALIC' },
  { icon: 'underline', style: 'UNDERLINE' },
  { label: 'Monospace', style: 'CODE' }
]

const InlineStyleControls = props => {
  const currentStyle = props.editorState.getCurrentInlineStyle()

  return (
    <div style={{marginTop:'5px'}}>
      {INLINE_STYLES.map(type => (
        <StyleButton
          key={type.style}
          active={currentStyle.has(type.style)}
          label={type.label}
          icon={type.icon}
          onToggle={props.onToggle}
          style={type.style}
        />
      ))}
    </div>
  )
}

export default InlineStyleControls
