import React from 'react'
import { Label } from 'semantic-ui-react'

export function labeledErrors (errors) {
  if (!errors) {
    return null
  }

  const label = (
    <Label basic color='red' pointing>
      {errors.map(error => <li key={error}>{error}</li>)}
    </Label>
  )

  return label
}

export function limitString(string, limit) {
  if(string.length <= limit){
    return string
  }
  return string.substr(0, limit) + '...'
}
