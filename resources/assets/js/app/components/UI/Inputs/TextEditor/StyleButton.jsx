import React, { Component } from 'react'

    class StyleButton extends React.Component {
      constructor() {
        super();
        this.onToggle = (e) => {
          e.preventDefault();
          this.props.onToggle(this.props.style);
        };
      }
      render() {
        let className = 'ui button mini';
        if (this.props.active) {
          className += ' secondary';
        }
        if(this.props.icon != undefined) {
          className += ' icon'
        }
        return (
          <span className={className} onMouseDown={this.onToggle}>
            {(this.props.label) ? this.props.label : null}
            {(this.props.icon) ? <i className={this.props.icon + ' icon'}/> : null}
          </span>
        );
      }
    }
    export default StyleButton;