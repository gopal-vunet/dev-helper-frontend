import React, { FunctionComponent, useContext } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext, AuthProps } from "../../context/authContext";

export const Login: FunctionComponent = (props) => {
    const context = useContext<AuthProps | null>(AuthContext)
    const { state } = useLocation()

    if (context != null) {
        const { loginUser } = context
        return (
            <div className="container d-flex justify-content-center mt-4">
                <form onSubmit={(e) => loginUser(e, state)}>
                    <div className="mb-3">
                        <label className="form-label">User Name</label>
                        <input type="text" className="form-control" id="username"/>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input type="password" className="form-control" id="password" />
                    </div>
                    <button type="submit" className="btn btn-primary">Login</button>
                </form>
            </div>
        )
    }

    return (
        <div>
            Loading...
        </div>
    )
}
