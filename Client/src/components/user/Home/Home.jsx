import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../../redux/userAuthSlice'
import './Home.css'
import crud_logo from '/crud_logo.png'
import { toast } from 'react-toastify'
import API from '../../../../config/axiosConfig'

const Home = () => {

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    mobile: ""
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    console.log("token : ", token)

    //  if(!token) {
    //   console.error('No token found in local storage');
    //   navigate('/login');
    // }
    
      const fetchUserData = async () => {
        try {
          const response = await API.get('/user-details', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (response.data.success) {
            console.log("data got")
            setUserData(response.data.user);
          } else {
            toast.error("Failed to fetch user details")
          }

        } catch (error) {
          console.error('Failed to load user data. Redirecting to login...');
          console.error(error);
         
          if(error.response.data.message == "User not found"){
            toast.error('You are Blocked by admin');
            localStorage.removeItem("userToken");
            console.log("deleted user");
            navigate("/login");
          }
        }
      }

      fetchUserData();

    
    
  }, []);

  const handleLogout = () => {

    dispatch(logout(
      {isLoggedIn:false}
    ));

    navigate('/login');
  };

  const navigateToeditUser=()=>{
    navigate('/edit-user');
  }

  const { name, email, mobile, profile_url } = userData;

  return (

    <div>
      <div className='home'>
        <img src={crud_logo} width={95} height={80} alt="" />
        <div className='user-badge'>
          <img src={profile_url} alt="" />
          <h2>Welcome, {name}!</h2>
          <div >
            <p >Email : <span className='details'>{email}</span></p>
            <p>Mobile :<span className='details'>{mobile}</span> </p>
          </div>
          <button className='edit-btn' onClick={navigateToeditUser}>Edit Profile</button>
          <button className='logout-btn' onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>

  )
}

export default Home
