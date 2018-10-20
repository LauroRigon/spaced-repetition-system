import React, { Component } from 'react'
import { reduxForm, Field } from 'redux-form'
import LabelAndInput from '../UI/Inputs/LabelAndInput'
import LabelAndSelect from '../UI/Inputs/LabelAndSelect'
import { Form, Grid, Button } from 'semantic-ui-react'

class FilterForm extends Component {
  render () {
    const { handleSubmit, decks, isFetchingDecks, isFetchingCards } = this.props

    return (
      <React.Fragment>
        <Form onSubmit={handleSubmit}>
          <Grid stackable>
            <Grid.Column>
              <Field
                name='deck_id'
                label='Deck:'
                component={LabelAndSelect}
                options={this.renderDecksOptions(decks)}
                isLoading={isFetchingDecks}
                width={10}
              />
            </Grid.Column>
            <Grid.Row columns={2}>
              <Grid.Column>
                <Field
                  name='front_text'
                  label='Frente:'
                  component={LabelAndInput}
                  width={15}
                />
              </Grid.Column>
              <Grid.Column>
                <Field
                  name='back_text'
                  label='Verso:'
                  component={LabelAndInput}
                  width={15}
                />
              </Grid.Column>
            </Grid.Row>
            <Form.Button primary loading={isFetchingCards} disabled={isFetchingCards}>
              Buscar
            </Form.Button>
          </Grid>

        </Form>
      </React.Fragment>
    )
  }

  renderDecksOptions (decks) {
    var options = []
    options = decks.map((deck, index) => {
      return { text: deck.name, value: deck.id }
    })
    options.unshift({ text: 'Todos', value: 0 })
    return options
  }
}

export default reduxForm({
  form: 'cards-filter',
  destroyOnUnmount: false,
  initialValues: {
    deck_id: 0
  }
})(FilterForm)
