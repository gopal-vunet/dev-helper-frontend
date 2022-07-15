import React, { FC, FunctionComponent, useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/authContext'
import { getDate } from '../screens/add_status/addStatus'
import { baseUrl } from '../utils/const'


export const Header: FunctionComponent = (props) => {
    let context = useContext(AuthContext)
    let location = useLocation()

    if (location.pathname.toString().includes('login')) {
        return <></>
    }

    if (context !== null) {

        let { user, logoutUser } = context

        let homeActive = location.pathname === '/' ? 'active' : ''
        let addActive = location.pathname === '/add' ? 'active' : ''

        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">

                    <div className="d-flex .flex-sm-row">
                        <div className="container">
                            <div className="row">
                                <div className="col-sm">
                                    <a className="navbar-brand" href="/">VunetSystems</a>
                                </div>
                                <div className="col-sm">
                                    <ul className="navbar-nav me-auto my-2 my-lg-0">
                                        <li className="nav-item">
                                            <Link className={"nav-link " + homeActive} aria-current="page" to="/">Home</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className={"nav-link " + addActive} aria-current="page" to="/add">Add</Link>
                                        </li>
                                        <a className="nav-link" target="_blank" rel="noopener noreferrer" href={`${baseUrl}/slack-dev-status/${getDate()}`}>Slack</a>

                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className=".flex-sm-row" id="navbarScroll">
                        <div className="container">
                            <div className="row">
                                <div className="col-sm">
                                    {user && <p className='m-2'>UserId-{user.user_id}</p>}
                                </div>
                                <div className="col-sm">
                                    <button className="btn btn-outline-danger" onClick={logoutUser}>Logout</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        )
    }

    return (
        <div></div>
    )
}


