import * as React from 'react';
import { Layout, Button } from 'antd';
import { Link } from 'react-router-dom';

import '../styles/notFound.css';

function notFound() {
    return (
        <Layout className="a-fh a-middle">
            <div className="a-tc">
                <h1 className="a-c-b heading">404</h1>
                <h2 className="a-c-d">Well this is awkward...</h2>
                <p>Either something went wrong or the page you are looking for doesn't exist anymore.</p>
                <Link to="/"><Button className="a-upper" type="primary" ghost={true}>Take me home</Button></Link>
            </div>
        </Layout>
    );
}

export default notFound;
