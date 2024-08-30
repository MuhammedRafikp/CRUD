import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';

const AdminLoginProtector = () => {
    const isLoggedIn = useSelector(state => state.adminAuth.isLoggedIn);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    console.log("isLoggedIn : ",isLoggedIn);
    
    useEffect(() => {

        const checkAuthStatus = async () => {

            setLoading(false);
        };

        checkAuthStatus();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {isLoggedIn ? navigate('/admin/dashboard') : <Outlet />}
        </div>
    )
};

export default AdminLoginProtector;