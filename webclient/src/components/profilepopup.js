import React, { Component } from 'react';
import { Popup, Segment, Card, Icon, Image, List, Header } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

import { bindActionCreators } from 'redux';
import { signout, setCurrentChannel } from '../redux/actions';
import { connect } from 'react-redux';

class ProfilePopup extends Component {
  signout = (e) => {
    e.preventDefault();
    this.props.signout()
      .then(resp => {
        this.props.setCurrentChannel();
        this.props.history.push('/messages');
      })
  }

  render() {
    const { currentUser } = this.props

    const popoverstyle = {
      borderRadius: 0,
      padding: '0px',
      width: '300px'
    }

    return (
      <Popup
        trigger={
          <Card as='div' id='profile'>
            <Card.Content>
              <Image spaced='right' size='mini' src={currentUser.photoURL} />
              <Card.Header>
                {currentUser.userName}
              </Card.Header>
              <Card.Meta>
                {`${currentUser.firstName} ${currentUser.lastName}`}
              </Card.Meta>
            </Card.Content>
          </Card>
        }
        on='click'
        position='bottom center'
        wide={true}
        style={popoverstyle}>
        <Popup.Content>
          <Segment.Group as={List} selection verticalAlign='middle' divided id='popup-menu'>
            <List.Item disabled>
              <Header as='h5'>Profile Settings</Header>
            </List.Item>
            <List.Item disabled>
              <Image floated='left' size='mini' src={currentUser.photoURL} />
              <List.Content>
                <List.Header>@{currentUser.userName}</List.Header>
                <List.Description>{currentUser.firstName} {currentUser.lastName}</List.Description>
              </List.Content>
              <Icon name='pencil' className='profile-menu-icon' style={{float:'right'}}/>
            </List.Item>
            <List.Item onClick={this.signout}>
              <List.Header>Sign out</List.Header>
              <List.Content>{currentUser.email}</List.Content>
            </List.Item>
          </Segment.Group>
        </Popup.Content>
      </Popup>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.currentUser
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    signout,
    setCurrentChannel
  }, dispatch)
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProfilePopup));
