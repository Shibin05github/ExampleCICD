import React, { createContext, useContext, useState } from "react";

type AuthContextType = {
    isLoggedIn: boolean
    login: () => void
    logout: () => void
}

const initialState: AuthContextType = {
    isLoggedIn: false,
    login() {
    },
    logout() {
    },
}

const AuthContext = createContext<AuthContextType>(initialState)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const login = () => {
        setIsLoggedIn(true)
    }

    const logout = () => {
        setIsLoggedIn(false)
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context
}