import React, { Component } from 'react';
import Profile from './Profile';
import { apiRoot, storageKey } from '../Auth';

class ProfileContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {}
        }
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
            <Profile {...this.state}/>
        )
    }
}

export default ProfileContainer