import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router';

const PrivateRoute = () => {
    const userData = useSelector(state => state.user.userData);
    const isAuthenticated = userData && Object.keys(userData).length > 0;

    if (isAuthenticated) {
        return <Outlet />;
    } else {
        return <Navigate to="/" replace />;
    }
};

export default PrivateRoute;