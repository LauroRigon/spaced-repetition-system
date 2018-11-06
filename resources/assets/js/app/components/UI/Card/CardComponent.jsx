import React from 'react'
import PropTypes from 'prop-types'

import './index.css'
import MiniPlayer from '../MiniPlayer/MiniPlayer';
import { Grid, Modal, Image } from 'semantic-ui-react';

const CardComponent = ({textContent, audioSrc, imageSrc, autoPlayMedia}) => {

  return (
    <React.Fragment>
      <Grid padded='vertically' stackable>
        <Grid.Row columns={2} className='c-card'>
          <Grid.Column width={14} className='c-content'>
            <p dangerouslySetInnerHTML={{__html: textContent}} className='ck-content'>
              {/* {textContent} */}
            </p>
          </Grid.Column>
          <Grid.Column width={2}  className='c-medias'>
            {imageSrc ? (
                <Grid.Row>
                  <Grid.Column>
                  <Modal closeIcon basic trigger={<img className='ui small image' src={imageSrc} />}>
                    <Modal.Content>
                      <Image centered src={imageSrc} />
                    </Modal.Content>
                  </Modal>
                    
                  </Grid.Column>
                </Grid.Row>
              ) : ''
            }

            {audioSrc ? (
              <Grid.Row textAlign='center'>
                <Grid.Column stretched >
                  <MiniPlayer src={audioSrc} autoPlay={autoPlayMedia}/>
                </Grid.Column>
              </Grid.Row>
              ) : ''
            }
          </Grid.Column>
        </Grid.Row>
        
      </Grid>
      
    </React.Fragment>
  )
}

CardComponent.propTypes = {
  textContent: PropTypes.string,
  audioSrc: PropTypes.string,
  imageSrc: PropTypes.string,
  autoPlayMedia: PropTypes.bool
}

export default CardComponent

/*

<div className='c-card'>
      <div className='c-content'>
        huehehueeheheu br
        huehehueeheheu br
        huehehueeheheu br
      </div>
      <div className='c-medias'>
        <Grid divided padded='horizontally'>
          <Grid.Row columns={1}>
            <img className='ui small image' style={{height: '100%'}} src="http://www.amor.blog.br/imagens/imagens-de-amor-imagem-1.jpg" />
          </Grid.Row>
          <Grid.Row columns={1}>
            <MiniPlayer />
          </Grid.Row>
        </Grid>
      </div>
    </div>

*/