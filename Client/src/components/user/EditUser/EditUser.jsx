import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../../../config/axiosConfig';
import crud_logo from '/crud_logo.png';
import profile from '/profile.png';
import './EditUser.css';
import { toast } from 'react-toastify';
import Loading from '../../loading/loading';

const EditUser = () => {
    const [userData, setUserData] = useState({
        name: '',
        mobile: '',
        profile_url:''
    });
    console.log('this is edit page')
    const [profileImage, setProfileImage] = useState(null);
    const [errors, setErrors] = useState({});
    const [isloading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('userToken');
            try {
                const response = await API.get('/user-details', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (response.data.success) {
                    setUserData(response.data.user);
                } else {
                    console.error('Failed to fetch user details');
                    navigate('/login');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                navigate('/login');
            }
        };

        fetchUserData();
    }, [navigate]);

    const validate = () => {
        const errors = {};
        if (!userData.name.trim()) {
            errors.name = 'Name is required';
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

        const token = localStorage.getItem('userToken');
    
        console.log("token : ",token);
        
        const formData = new FormData();

       
        formData.append('name', userData.name);
        formData.append('mobile', userData.mobile);

        
        if (profileImage) {
            formData.append('profileImage', profileImage);
        }

        console.log("formData : ",formData)

        try {
            const response = await API.put('/edit-profile', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.data.success) {
                toast.success('Profile updated successfully!');
                navigate('/');
            } else {
                toast.error('Failed to update profile');
            }
        } catch (error) {
            
            if(error.response.data.message == "User not found"){
                toast.error('You are Blocked by admin');
                localStorage.removeItem("userToken");
                console.log("deleted user");
                navigate("/login");
              }
        } finally {
        setLoading(false); 
    }
};

    return (
        <div className='edit-user'>
            <img src={crud_logo} width={95} height={80} alt="" />
            <div className='edit-user-form'>
                <h1>Edit My Profile</h1>
                <img src={userData.profile_url || profile} alt="" />
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
                    {isloading?(<Loading/>):( <button type='submit'>Save changes</button>)}
                   
                </form>
            </div>
        </div>
    );
};

export default EditUser;
