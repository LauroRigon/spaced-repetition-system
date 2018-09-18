import React from 'react'
import { FormField, Dropdown } from 'semantic-ui-react'

const LabelAndSelect = props => {
  const { width, required, label, options, defaultValue } = props
  
  return (
    <FormField width={width} required={required}>
      <label htmlFor={props.name}>{label}</label>
      <Dropdown
        {...props.input}
        selection
        onChange={(param,data) => props.input.onChange(data.value)}
        // placeholder={props.label}
        options={options}
      />
    </FormField>
  )
}

export default LabelAndSelect
