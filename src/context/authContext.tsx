import React, { createContext, useState, useEffect } from 'react'
import jwt_decode from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import { baseUrl } from '../utils/const'
import axios from 'axios'

export interface AuthProps {
    user: any,
    authTokens: any,
    loginUser(e: any, state: any): any,
    logoutUser(): any,
}

export const AuthContext = createContext<AuthProps | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    let [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens') ?? '') : null)
    let [user, setUser] = useState(() => localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens') ?? '') : null)

    const navigate = useNavigate()

    let loginUser = async (e: any, state: any) => {
        e.preventDefault()

        let body = {
            'username': e.target.username.value,
            'password': e.target.password.value,
        };

        try {
            let response = await axios.post(
                `${baseUrl}/token/`,
                body,
            )

            if (response.status === 200) {
                let data = response.data
                setAuthTokens(data)
                setUser(jwt_decode(data.access))
                localStorage.setItem('authTokens', JSON.stringify(data))
                navigate(state?.from?.pathname ?? '/')
            } else {
                alert('Something went wrong!')
            }
        } catch (error) {
            alert('Something went wrong!')
        }
    }


    let logoutUser = () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authTokens')
        navigate('/login')
    }

    let contextData = {
        user: user,
        authTokens: authTokens,
        loginUser: loginUser,
        logoutUser: logoutUser,
    }

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}
