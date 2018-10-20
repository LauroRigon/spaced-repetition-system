import React from 'react'
import { FormField, Dropdown } from 'semantic-ui-react'

const LabelAndSelect = props => {
  const { width, required, label, options, readOnly, disabled, inline, isLoading } = props

  return (
    <FormField width={width} required={required} inline={true}>
      <label htmlFor={props.name}>{label}</label>
      <Dropdown
        {...props.input}
        selection
        onChange={(param,data) => props.input.onChange(data.value)}
        // placeholder={props.label}
        options={options}
        loading={isLoading}
        readOnly={readOnly}
        disabled={disabled}
      />
    </FormField>
  )
}

export default LabelAndSelect
