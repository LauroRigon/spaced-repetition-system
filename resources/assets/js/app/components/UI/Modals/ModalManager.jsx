import React, {Component} from "react";
import {connect} from "react-redux";
import { hideModal } from 'app/actions/ui/modals'
import CardsFormModal from "../../Cards/FormModal";
import SubscribeModal from '../../Decks/SubscribeModal'
import { bindActionCreators } from "redux";

const modalComponentLookupTable = {
  CardsFormModal,
  SubscribeModal
};

class ModalManager extends Component {
    render() {
        const {currentModal} = this.props;

        let renderedModal;

        if(currentModal) {
            const {modalType, modalProps = {}} = currentModal;
            
            const ModalComponent = modalComponentLookupTable[modalType];

            if(ModalComponent == undefined) return null

            renderedModal = <ModalComponent {...modalProps} hideModal={this.props.hideModal}/>;
        }

        return <span>{renderedModal}</span>
    }
}

const mapStateToProps = (state) => ({currentModal : state.ui.modals});

const mapDispatchToProps = dispatch => bindActionCreators({
  hideModal
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ModalManager);