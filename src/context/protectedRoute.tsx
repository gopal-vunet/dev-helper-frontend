import { createElement, FC, ReactNode, useContext } from 'react';
import { Navigate,  RouteProps } from 'react-router-dom'
import { AuthContext } from './authContext';

import {Route, useLocation} from 'react-router'



export type Props = {
    children?: ReactNode
} & RouteProps

// export const ProtectedRoute = ({component, ...rest}: any) => {

//     let context = useContext(AuthContext)

//     const routeComponent = (props: any) => (
//         context != null
//             ? createElement(component, props)
//             : <Navigate to={{pathname: '/login'}}/>
//     );
//     return <Route {...rest} render={routeComponent}/>;
// };


export const ProtectedRoute  = ({ children, ...rest } : Props) => {
    let context = useContext(AuthContext)

    if(context != null){
        let { user } = context 
        return (
            <Route {...rest}>{ <Navigate to="/login" />}</Route>
        )
    }

    return (
        <Route {...rest}>{children}</Route>
    )
}

export function RequireAuth({ children }: { children: JSX.Element }) {
    let location = useLocation();
    let context = useContext(AuthContext)
  
    if (context === null) {
      // Redirect them to the /login page, but save the current location they were
      // trying to go to when they were redirected. This allows us to send them
      // along to that page after they login, which is a nicer user experience
      // than dropping them off on the home page.
      return <Navigate to="/login" state={{ from: location }} />;
    }
    const { user } = context

    if( user == null ){
      return <Navigate to="/login" state={{ from: location }} />;
    }

    return children;
}