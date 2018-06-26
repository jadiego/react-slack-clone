import * as React from "react";
import ContentLoader from "react-content-loader"

const UserProfileLoader: React.SFC  = props => (
  <ContentLoader
    height={52.156}
    width={225.5}
    speed={4}
    primaryColor="#f3f3f3"
    secondaryColor="#ebebeb"
    {...props}
  >
    <rect x="15" y="11" rx="4" ry="4" width="87" height="6.4" /> 
    <rect x="17" y="31" rx="3" ry="3" width="117" height="6.4" /> 
    <rect x="175" y="6.44" rx="6" ry="1" width="40.5" height="38.7" />
  </ContentLoader>
)

export default UserProfileLoader;