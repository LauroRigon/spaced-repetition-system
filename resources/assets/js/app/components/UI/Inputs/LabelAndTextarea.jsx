import React from 'react'
import { FormField, Input, TextArea } from 'semantic-ui-react'
import { labeledErrors } from 'app/services/helpers';

const LabelAndTextarea = props => {
  const { width, required, label, placeholder, rows, meta: { touched, error } } = props
  
  return (
    <FormField width={width} required={required}>
      <label htmlFor={props.name}>{label}</label>
      <TextArea {...props.input} placeholder={placeholder} rows={rows}/>
      {touched && error && <span>{labeledErrors(error)}</span>}
    </FormField>
  )
}

export default LabelAndTextarea