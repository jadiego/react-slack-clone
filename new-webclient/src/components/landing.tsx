import * as React from 'react';
import { Layout, Button, Row, Col } from 'antd';
import { Link } from 'react-router-dom';

import '../styles/landing.css';
const logo = require('../assets/logo.png');

function landing() {
    return (
        <Layout className="vh-100">
            <Row className="row">
                <Col lg={{ span: 12 }} className="col">
                    <div className="tc mv6">
                        <img src={logo} alt="logo" className="pa1 ma1" />
                        <h1 className="title f-6-ns ma1">Howl</h1>
                        <p className="f6">A simple web chat application</p>
                    </div>
                </Col>
                <Col lg={{ span: 12 }} className="col a-bg-w">
                    <div className="pv5 a-bg-w">
                        <div className="bottom-container">
                            <div className="tc">
                                <h3 className="a-c-d">Welcome to Howl</h3>
                                <p>Login or Sign Up to get started.</p>
                            </div>
                            <Row>
                                <Col xs={{ span: 22, offset: 1 }} sm={{ span: 12, offset: 6 }}>
                                    <Link to="/login">
                                        <Button className="w-100 ttu" type="primary">Login</Button>
                                    </Link>
                                </Col>
                                <Col xs={{ span: 22, offset: 1 }} sm={{ span: 12, offset: 6 }}>
                                    <Link to="/signup">
                                        <Button className="w-100 ttu" type="primary" ghost={true}>Sign Up</Button>
                                    </Link>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </Col>
            </Row>
        </Layout>
    );
}

export default landing;
