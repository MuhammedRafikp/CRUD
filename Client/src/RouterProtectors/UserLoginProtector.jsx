// import React, { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
// import { Outlet, useNavigate } from 'react-router-dom';

// const UserLoginProtector = () => {
//     const isLoggedIn = useSelector(state => state.userAuth.isLoggedIn);
//     const [loading, setLoading] = useState(true);
//     const navigate = useNavigate();

//     console.log("isLoggedIn : ",isLoggedIn)
//     useEffect(() => {

//         const checkAuthStatus = async () => {

//             setLoading(false);
//         };

//         checkAuthStatus();
//     }, []);

//     if (loading) {
//         return <div>Loading...</div>;
//     }

//     return (
//         <div>
//             {isLoggedIn ? navigate('/') : <Outlet />}
//         </div>
//     )
// };

// export default UserLoginProtector;

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';

const UserLoginProtector = () => {
    const isLoggedIn = useSelector(state => state.userAuth.isLoggedIn);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuthStatus = async () => {
            console.log("isLoggedIn login route protector:",isLoggedIn)
            if (isLoggedIn) {
                navigate('/');
            }
            setLoading(false);
        };

        checkAuthStatus();
    }, [isLoggedIn, navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return !isLoggedIn ? <Outlet /> : null;
};

export default UserLoginProtector;
