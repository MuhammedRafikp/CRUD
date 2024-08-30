import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../../../../config/axiosConfig';
import crud_logo from '/crud_logo.png';
import profile from '/profile.png';
import './AdminEditUser.css';
import { toast } from 'react-toastify';
import Loading from '../../loading/loading';

const AdminEditUser = () => {
    const { userId } = useParams();
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        mobile: '',
        profile_url: ''
    });
    const [profileImage, setProfileImage] = useState(null);
    const [errors, setErrors] = useState({});
    const [isLoading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('adminToken');
            try {
                const response = await API.get(`/admin/edit-user/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (response.data.success) {
                    setUserData(response.data.user);
                } else {
                    console.error('Failed to fetch user details');
                    navigate('/admin/dashboard');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                navigate('/admin/dashboard');
            }
        };

        if (userId) {
            fetchUserData();
        } else {
            console.error('No userId found');
            navigate('/admin/dashboard');
        }
    }, [userId, navigate]);

    const validate = () => {
        const errors = {};
        if (!userData.name.trim()) {
            errors.name = 'Name is required';
        }
        if (!userData.email.trim()) {
            errors.email = 'Email address is required';
        } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
            errors.email = 'Email address is invalid';
        }
        if (!userData.mobile.trim()) {
            errors.mobile = 'Mobile number is required';
        } else if (!/^\d+$/.test(userData.mobile)) {
            errors.mobile = 'Mobile number must contain only digits';
        }
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        setProfileImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        setLoading(true);

        const token = localStorage.getItem('adminToken');
        const formData = new FormData();

        formData.append('name', userData.name);
        formData.append('email', userData.email);
        formData.append('mobile', userData.mobile);
        if (profileImage) {
            formData.append('profileImage', profileImage);
        } else {
            formData.append('profileImage', userData.profile_url);
        }

        try {
            const response = await API.put(`/admin/edit-user/${userId}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                toast.success('Profile updated successfully!');
                navigate('/admin/dashboard');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error('Error updating profile');
            console.error('Error updating user:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleGoback = () => {
        navigate('/admin/dashboard');
    };

    return (
        <div className='admin-edit-user'>
            <img src={crud_logo} width={95} height={80} alt="CRUD Logo" />
            <div className='admin-edit-user-form'>
                <h1>Edit User's Profile</h1>
                <img src={userData.profile_url || profile} alt="User Profile" />
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder='Username'
                        value={userData.name}
                        onChange={handleInputChange}
                    />
                    {errors.name && <p className='error'>{errors.name}</p>}

                    <input
                        type="email"
                        name="email"
                        placeholder='Email address'
                        value={userData.email}
                        onChange={handleInputChange}
                    />
                    {errors.email && <p className='error'>{errors.email}</p>}

                    <input
                        type="text"
                        name="mobile"
                        placeholder='Mobile'
                        value={userData.mobile}
                        onChange={handleInputChange}
                    />
                    {errors.mobile && <p className='error'>{errors.mobile}</p>}

                    <div className='file-input-container'>
                        <input
                            type="file"
                            id="file-input"
                            className="file-input"
                            onChange={handleFileChange}
                        />
                        <label htmlFor="file-input" className="upload-img-btn">Upload Profile</label>
                    </div>

                    {isLoading ? (
                        <Loading />
                    ) : (
                        <button type='submit'>Save changes</button>
                    )}
                </form>
                <button onClick={handleGoback} className='goback-btn'>Go back</button>
            </div>
        </div>
    );
}

export default AdminEditUser;
