import React, { Component } from 'react'
import { Segment, Modal, Icon, Button, Checkbox, Form, Label, Header, Message } from 'semantic-ui-react'

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchCreateChannel } from '../actions'


class AddChannelPopUpModal extends Component {
    state = {
        visible: false,
        checked: false,
        name: "",
        description: "",
        members: [],
    }

    hideModal = (e) => this.setState({ visible: false })

    showModal = (e) => this.setState({ visible: true })

    togglePrivacy = (e) => this.setState({ checked: !this.state.checked })

    changedescription = (e) => this.setState({ description: e.target.value })

    changetitle = (e) => this.setState({ name: e.target.value })

    submit = (event, name, checked, description, members) => {
        event.preventDefault()
        this.props.fetchCreateChannel(name, checked, description, members)
        .then(data => {
            if (data === undefined) {
                //if were here then the channel was succesfully created
                this.setState({ visible: false })
            }
        })
    }

    render() {
        const { visible, checked, name, description, members } = this.state
        const { trigger, fetching, fetchError, fetchCreateChannel } = this.props
        return (
            <Modal
                trigger={<Icon link name='plus' onClick={this.showModal} />}
                dimmer="inverted"
                open={visible}
                onClose={this.hideModal}
                closeOnEscape={true}
                closeOnRootNodeClick={false}
                closeIcon='close'
            >
                <Modal.Header as='h2'> Create Channel</Modal.Header>
                <Modal.Content>
                    <Segment basic padded>
                        <Form loading={fetching !== 0} warning={fetchError.length > 0} onSubmit={(event) => this.submit(event, name, checked, description, members)}>
                            <Form.Field>
                                <label>
                                    Channel Privacy Type: {checked ? ("Private") : ("Public")}
                                </label>
                                <Checkbox toggle checked={checked} onChange={this.togglePrivacy} />
                                <Header.Subheader style={{ color: 'grey', fontSize: '12px' }}>Public Channels can be joined by anyone.</Header.Subheader>
                            </Form.Field>
                            <Form.Input type='text' placeholder='# e.g. announcements' label='Name' value={name} onChange={event => this.changetitle(event)}/>
                            <Form.Input type='text' placeholder='What is this channel about?' value={description} label='Description (optional)' onChange={event => this.changedescription(event)}/>
                            <Message warning>{fetchError}</Message>
                        </Form>
                    </Segment>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={this.hideModal} inverted>
                        Cancel
                    </Button>
                    <Button onClick={(event) => this.submit(event, name, checked, description, members)} >
                        Create
                    </Button>
                </Modal.Actions>
            </Modal>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        fetching: state.fetching,
        fetchError: state.fetchError,
        users: state.users
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        fetchCreateChannel
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(AddChannelPopUpModal)