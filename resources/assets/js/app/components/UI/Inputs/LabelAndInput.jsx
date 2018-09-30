import React from 'react'
import { FormField, Input } from 'semantic-ui-react'
import { labeledErrors } from 'app/services/helpers';

const LabelAndInput = props => {
  const { width, required, label, icon, loading, type, placeholder, meta: { touched, error } } = props
  
  return (
    <FormField width={width} required={required}>
      <label htmlFor={props.name}>{label}</label>
      <Input {...props.input} type={type} icon={icon} loading={loading} placeholder={placeholder}/>
      {touched && error && <span>{labeledErrors(error)}</span>}
    </FormField>
  )
}

export default LabelAndInput
