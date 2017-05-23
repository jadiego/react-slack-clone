import React, { Component } from 'react'
import { Segment, Modal } from 'semantic-ui-react'

class PopUpModal extends Component {
    state = {
        visible: false
    }

    hideModal = (e) => this.setState({ visible: false })

    showModal = (e) => this.setState({ visible: true })


    render() {
        const { visible } = this.state
        const { trigger } = this.props
        return (
            <Modal
                trigger={trigger}
                dimmer="inverted"
                open={visible}
                onClose={this.hideModal}
                closeOnEscape={true}
                closeOnRootNodeClick={false}
                closeIcon='close'
            >
                <Segment basic padded>
                    modal popup
                </Segment>
            </Modal>
        )
    }
}

export default PopUpModal