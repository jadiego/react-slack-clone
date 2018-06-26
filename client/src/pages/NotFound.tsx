import * as React from "react";
import { Link } from "react-router-dom";
import { Button } from "semantic-ui-react";
import "../styles/notfound.css";

const NotFound: React.SFC = () => (
  <div className="w-100 h-100 bg-blue white container-middle">
    <div className="ph4">
      <h1 className="tc" id="error-title"> 404 </h1>
      <h2>Well this is awkward...</h2>
      <p>
        Either something went wrong or the page you are looking for doesn't
        exist anymore.
      </p>
      <Link to="/">
        <Button className="bg-white">
          Take me home
        </Button>
      </Link>
    </div>
  </div>
);

export default NotFound;
