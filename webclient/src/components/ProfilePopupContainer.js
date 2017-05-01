import React, { Component } from 'react';
import ProfilePopup from './ProfilePopup';
import { Auth, apiRoot, storageKey } from '../Auth';
import { withRouter } from 'react-router-dom';

class ProfilePopupContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {}
        }
    }

    handleSignOut = () => {
		Auth.signout(this)
	}

    componentDidMount() {
        let r = new Request(`${apiRoot}users/me`, {
            method: "GET",
            mode: "cors",
            headers: new Headers({
                "Authorization": localStorage.getItem(storageKey)
            })
        })

        fetch(r)
            .then(resp => {
                if (resp.status === 200) {
                    return resp.json()
                } else {
                    return resp.text()
                }
            })
            .then(data => {
                this.setState({ ...this.state, user: data })
            })
            .catch(err => {
                console.log(err)
            })
    }

    render() {
        return (
            <ProfilePopup
                {...this.state}
                handleSignOut={this.handleSignOut}
            />
        )
    }
}

export default withRouter(ProfilePopupContainer)