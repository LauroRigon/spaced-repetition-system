import React from 'react'
import CKEditor from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

import { FormField, Segment, Label } from 'semantic-ui-react'
import { labeledErrors } from 'app/services/helpers'

const CardEditor = props => {
  const { width, required, label, meta: { touched, error } } = props

  // const renderLabel = label
  //     ? <Label attached='top left' color='teal'>{label}</Label>
  //     : null

  return (
    // <Segment padded>
    //   {renderLabel}
      <FormField width={width} required={required}>
        <CKEditor
            data={props.input.value}
            {...props.input}
            editor={ClassicEditor}
            onChange={(event, editor) => {
              const data = editor.getData()
              props.input.onChange(data)
            }}
            onInit={(editor => {
              // console.log(editor.setData(props.initialValue))
            })}
          />
        {touched && error && <span>{labeledErrors(error)}</span>}
      </FormField>
    // </Segment>
  )
}

export default CardEditor