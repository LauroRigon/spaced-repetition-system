import React from 'react'
import { FormField, Input, Checkbox } from 'semantic-ui-react'

const LabelAndCheckbox = props => {
  const { label, toggle } = props

  return (
    <FormField>
      <Checkbox
        label={label}
        toggle={toggle}
        //{...restOfInput}
        onChange={(param, data) => props.input.onChange(data.checked)}
        checked={props.input.value ? true : false}
      />
    </FormField>
  )
}

export default LabelAndCheckbox
