import * as React from 'react';
import { Layout, Button, Row, Col } from 'antd';
import { Link } from 'react-router-dom';

import '../styles/landing.css';
const logo = require('../assets/logo.png');

function landing() {
    return (
        <Layout className="a-fh">
            <div className="top">
                <div className="a-tc">
                    <img src={logo} alt="logo" />
                </div>
                {/* TODO:
                make the h1 below centered
                and change the width of the img above.
            */}
                <h1>Howl</h1>
            </div>
            <div className="a-bg-w bottom">
                <div className="a-tc">
                    <h3 className="a-c-d">Welcome to Howl</h3>
                    <p>Login or Register to get started</p>
                </div>
                <Row>
                    <Col xs={{ span: 22, offset: 1 }} sm={{ span: 12, offset: 6 }}>
                        <Link to="/login">
                            <Button className="a-w-100 a-upper" type="primary">Login</Button>
                        </Link>
                    </Col>
                    <Col xs={{ span: 22, offset: 1 }} sm={{ span: 12, offset: 6 }}>
                        <Link to="/signup">
                            <Button className="a-w-100 a-upper" type="primary" ghost={true}>Sign Up</Button>
                        </Link>
                    </Col>
                </Row>
            </div>
        </Layout>
    );
}

export default landing;
