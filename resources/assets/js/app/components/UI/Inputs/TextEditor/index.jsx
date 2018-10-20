import React, { Component } from 'react'
import {
  Editor,
  EditorState,
  RichUtils,
  getDefaultKeyBinding,
  convertToRaw,
  convertFromHTML,
  ContentState
} from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import {stateFromHtml} from 'draft-js-import-html'
import './index.css'
import BlockStyleControls from './BlockStyleControls'
import InlineStyleControls from './InlineStyleControls'
import { Label, Segment } from 'semantic-ui-react'

const styleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2
  }
}

class TextEditor extends Component {
  constructor (props) {
    super(props)
    var editorState = ''

    if(props.initialValue) {
      const blocksFromHtml = convertFromHTML(props.initialValue)
      const contentState = ContentState.createFromBlockArray(blocksFromHtml.contentBlocks, blocksFromHtml.entityMap)
      editorState = EditorState.createWithContent(contentState)
    } else {
      editorState = EditorState.createEmpty()
    }

    // const editorState = props.initialValue ? EditorState.createWithContent(convertFromHTML(props.initialValue)) : EditorState.createEmpty()
    this.state = {
      editorState: editorState
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleKeyCommand = this.handleKeyCommand.bind(this)
    this.mapKeyToEditorCommand = this._mapKeyToEditorCommand.bind(this)
    this.toggleBlockType = this._toggleBlockType.bind(this)
    this.toggleInlineStyle = this._toggleInlineStyle.bind(this)
    this.getBlockStyle = this._getBlockStyle.bind(this)
  }

componentDidMount () {
  // if(this.props.initialValue){
  //   initialized
  //   this.changeValue(this.state.editorState)  
  // }
  this.changeValue(this.state.editorState)
}


  handleKeyCommand (command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command)
    if (newState) {
      this.handleChange(newState)
      return 'handled'
    }
    return 'not-handled'
  }

  handleChange (editorState) {
    if (!this.props.input.value) {
      return this.resetEditor()
    }

    this.setState({ ...this.state, editorState: editorState })
    this.changeValue(editorState)
  }

  resetEditor () {
    const empty = EditorState.createEmpty();
    // const newState = EditorState.createWithContent(ContentState.createFromText(''))
    const newState = EditorState.moveFocusToEnd(empty)
    this.setState({ ...this.state, editorState: newState })
    this.changeValue(newState)
    return null
  }

  changeValue (editorState) {
    const value = draftToHtml(convertToRaw(editorState.getCurrentContent()))
    this.props.input.onChange(value)
  }

  // handle blockquote
  _getBlockStyle (block) {
    switch (block.getType()) {
      case 'blockquote':
        return 'RichEditor-blockquote'
      default:
        return null
    }
  }

  // map the TAB key to the editor
  _mapKeyToEditorCommand (e) {
    if (e.keyCode === 9 /* TAB */) {
      const newEditorState = RichUtils.onTab(
        e,
        this.state.editorState,
        4 /* maxDepth */
      )
      if (newEditorState !== this.state.editorState) {
        this.handleChange(newEditorState)
      }
      return
    }
    return getDefaultKeyBinding(e)
  }
  // toggle block styles
  _toggleBlockType (blockType) {
    this.handleChange(
      RichUtils.toggleBlockType(this.state.editorState, blockType)
    )
  }
  // toggle inline styles
  _toggleInlineStyle (inlineStyle) {
    this.handleChange(
      RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle)
    )
  }

  render () {
    const { editorState } = this.state
    const { meta: { active }, label } = this.props
    const renderLabel = label
      ? <Label attached='top left' color='teal'>{label}</Label>
      : null
    return (
      <React.Fragment>
        <Segment padded>
          {renderLabel}
          {/* <If test={active}> */}
          <div className='editor-utils'>
            <BlockStyleControls
              editorState={editorState}
              onToggle={this.toggleBlockType}
            />
            <br />
            <InlineStyleControls
              editorState={editorState}
              onToggle={this.toggleInlineStyle}
            />
          </div>
          {/* </If> */}

          <div className='ui divider' />
          <Editor
            ref={editor => (this.editorRef = editor)}
            {...this.props.input}
            blockStyleFn={this.getBlockStyle}
            customStyleMap={styleMap}
            editorState={editorState}
            handleKeyCommand={this.handleKeyCommand}
            keyBindingFn={this.mapKeyToEditorCommand}
            onChange={editorState => this.handleChange(editorState)}
          />

        </Segment>
      </React.Fragment>
    )
  }
}

export default TextEditor
