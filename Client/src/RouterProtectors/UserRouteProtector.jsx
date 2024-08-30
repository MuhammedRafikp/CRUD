import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';

const UserRouteProtector = () => {
    const isLoggedIn = useSelector(state => state.userAuth.isLoggedIn);
    const navigate = useNavigate();

    console.log("isLoggedIn protector: ",isLoggedIn)
    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        }
    }, []);

    return isLoggedIn ? <Outlet /> : null;
};

export default UserRouteProtector;
