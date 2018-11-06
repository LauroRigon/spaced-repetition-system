import React from 'react'
import PropTypes from 'prop-types'

import { Icon } from 'semantic-ui-react';
import './index.css'
import { setInterval } from 'timers';


class MiniPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      duration: 0,
      currentTime: 0,
      progress: 0,
      isPlaying: false,
      playStatus: 'play'
    }

    this.tooglePlay = this.tooglePlay.bind(this)
    this.interval_id = setInterval(this.onUpdate.bind(this), 400);
  }  

  componentDidMount () {
    if(this.props.autoPlay && !!this.playerRef.buffered){
      this.tooglePlay()
    }
  }
  

  tooglePlay () {
    this.setState({
      ...this.state,
      isPlaying: !this.state.isPlaying
    })
  }

  onUpdate() {
    
    if (this.playerRef) {
      this.setState({
        ...this.state,
        progress: this.playerRef.currentTime / this.playerRef.duration
      })
      
      if (this.playerRef.ended) {
        this.onDone()
      }
    }
  }

  onDone() {
    this.resetState()
  }

  resetState() {
    this.setState({
      duration: 0,
      currentTime: 0,
      progress: 0,
      isPlaying: false,
      playStatus: 'play'
    })
  }

  render() {
    const {
      src,
      autoPlay
    } = this.props

    var currentTime = 0;
    var totalTime = 0;

    if (!!this.playerRef) {
      if (this.playerRef.paused && !this.playerRef.ended) {
        if(this.state.isPlaying) {
          this.playerRef.play()
        }
      } else if (!this.state.isPlaying) {
        this.playerRef.pause()
        this.playerRef.currentTime = 0
      }      

      currentTime = this.playerRef.currentTime
      totalTime = this.playerRef.duration
    }

    const icon = (this.state.isPlaying ? 'stop' : 'play')

    return (
      <React.Fragment>
        <audio className='c-audio' ref={(ref) => this.playerRef = ref} type='audio/*' src={src}/>
        
        <div className='player'>
          <div className='controls'>
            <a onClick={this.tooglePlay}>
              <Icon name={`${icon} circle outline`} style={{fontSize: '3.5em'}}/>
            </a>

            <div className='progress'>
              <div className='bar' style={{ width: (this.state.progress * 100) + '%' }}/>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

MiniPlayer.propTypes = {
  src: PropTypes.string,
  autoPlay: PropTypes.bool
}

export default MiniPlayer
