import 'whatwg-fetch';
import React, { Component } from 'react';
import Profile from './Profile';
import { apiRoot, storageKey } from '../actions';

class ProfileContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user:{},
            firstname: "",
            lastname: "",
            loading: false,
            resp: "",
            showresp: false
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
                console.log(this.state)
            })
            .catch(err => {
                console.log(err)
            })
    }
    

    handleFirstNameChange = (event) => this.setState({ firstname: event.target.value })
    handleLastNameChange = (event) => this.setState({ lastname: event.target.value })
    handleSubmitUpdate = (event) => {
        event.preventDefault();
        this.setState({ loading: true, showresp: false })

        fetch(`${apiRoot}users/me`,{
            method: 'PATCH',  
            headers: {  
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem(storageKey)
            },  
            body: JSON.stringify({
                firstName: this.state.firstname,
                lastName: this.state.lastname
            }) 
        })
            .then(resp => {
                this.setState({ loading: false, showresp: true })
                return resp.text()
            })
            .then(data => {
                this.setState({ ...this.state, resp: data})
            })
            .catch(err => {
                this.setState({ resp: "Internal server error" })
                console.log(err)
            })
    }

    render() {
        return (
            <Profile 
            handleFirstNameChange={this.handleFirstNameChange}
            handleLastNameChange={this.handleLastNameChange}
            handleSubmitUpdate={this.handleSubmitUpdate}
            {...this.state}
            />
        )
    }
}

export default ProfileContainer