import React from 'react'
import './index.css'
import Dropzone from 'react-dropzone'

import { limitString } from 'app/services/helpers'
import { Button } from 'semantic-ui-react'
import uniqBy from 'lodash/uniqBy'

const DropzoneInput = field => {
  const files = field.input.value
  let dropzoneRef;
  return (
    <div>
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
        onDrop={filesToUpload => {
          console.log(files, filesToUpload)
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

    </div>
  )
}

export default DropzoneInput
