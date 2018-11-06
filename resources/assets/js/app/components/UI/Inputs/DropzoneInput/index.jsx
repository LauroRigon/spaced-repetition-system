import React from 'react'
import './index.css'
import Dropzone from 'react-dropzone'

import { limitString } from 'app/services/helpers'
import { Button, Grid } from 'semantic-ui-react'
import uniqBy from 'lodash/uniqBy'

const DropzoneInput = field => {
  const files = field.input.value
  let dropzoneRef;
  return (
    <Grid columns={2}>
      <Grid.Column largeScreen={8} computer={8} tablet={16} mobile={16}>
      <Dropzone
        disableClick
        disablePreview
        className='dropbox midia-drop'
        acceptClassName='accept'
        rejectClassName='reject'
        name={field.name}
        {...field.dropzone_props}
        ref={node => {
          dropzoneRef = node
        }}
        onDrop={(filesToUpload) => {
          if(!canAddMoreFile(files, filesToUpload)) {
            return null
          }
          field.input.onChange(uniqBy(filesToUpload.concat(...files), 'name'))
        }}
      >
        <div className='dropzone-content'>
          <div className='ui horizontal list'>
            {files &&
              Array.isArray(files) &&
              <React.Fragment>
                {files.map((file, i) => {
                  const type = file.type.split('/')[0]

                  return (
                    <div className='item' key={i}>
                      <div className='ui blue label'>
                        <i className={`file ${type} icon`} />
                        {limitString(file.name, 8)}
                        <div className='detail'>
                          {type}
                        </div>
                        {
                          <i
                            className='delete icon'
                            onClick={e => {
                              e.preventDefault()
                              field.onRemove(file, i)
                            }}
                          />
                        }
                      </div>
                    </div>
                  )
                })}
              </React.Fragment>}

            <div className='item'>
              <Button
                primary
                size='mini'
                icon='plus'
                onClick={(e) => {e.preventDefault(); dropzoneRef.open()}}
              />
            </div>
          </div>
        </div>

        <div className='drop-label'>Arraste suas mídias aqui</div>

        
      </Dropzone>
      </Grid.Column>
      <Grid.Column>
        <ul className='ui list'>
          <li className='item'>
            No máximo 1 item de cada tipo
          </li>
          <li className='item'>
            Apenas arquivos .jpg, .png, .jpeg e .mp3
          </li>
        </ul>
      </Grid.Column>
    </Grid>
  )
}

const canAddMoreFile = (files, fileToAdd) => {
  const audioTypes = ['audio/mp3']
  const imgTypes = ['image/jpg', 'image/jpeg', 'image/png']

  if(!files) {
    return true
  }
  //é uma img
  if(imgTypes.includes(fileToAdd[0].type)) {
    return !files.find((file) => imgTypes.includes(file.type))
  }

  //é um audio
  if(audioTypes.includes(fileToAdd[0].type)) {
    return !files.find((file) => audioTypes.includes(file.type))
  }
  
}

export default DropzoneInput
