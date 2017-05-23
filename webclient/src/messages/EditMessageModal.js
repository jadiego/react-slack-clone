import React, { Component } from 'react'
import { Segment, Modal, Popup, Icon } from 'semantic-ui-react'

class EditMessageModal extends Component {
    state = {
        visible: false
    }

    hideModal = (e) => this.setState({ visible: false })

    showModal = (e) => this.setState({ visible: true })


    render() {
        const { visible } = this.state
        return (
            <Modal
                trigger={
                    <Popup
                        inverted
                        basic
                        trigger={<Icon name='pencil' link color='blue' onClick={this.showModal}/>}
                        content='Edit Message'
                    />
                }
                dimmer="inverted"
                open={visible}
                onClose={this.hideModal}
                closeIcon='close'
            >
                <Segment basic padded>
                    edit message modal
                </Segment>
            </Modal>
        )
    }
}

export default EditMessageModal