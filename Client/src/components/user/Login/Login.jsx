import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from '../../../redux/userAuthSlice';
import './login.css';
import crud_logo from '/crud_logo.png';
import API from '../../../../config/axiosConfig';
import { toast } from 'react-toastify';
import Loading from '../../loading/loading';

const Login = () => {

  const [formData, setformData] = useState({ email: "", password: "" });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  // let isLoading = useSelector((state) => state.userAuth.loading);

  // console.log(isLoading);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setformData({
      ...formData,
      [name]: value.trim()
    });
  }

  const validate = () => {
    let valid = true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.(com)$/;

    if (!formData.email) {
      toast.error('Email is required');
      valid = false;
    } else if (!emailRegex.test(formData.email)) {
      toast.error('Invalid email');
      valid = false;
    }

    if (!formData.password) {
      toast.error('Password is required');
      valid = false;
    } else {
      if (formData.password.length < 6) {
        toast.error('Password : Min 6 characters');
        valid = false;
      }
      if (!/[A-Za-z]/.test(formData.password)) {
        toast.error('Password : At least 1 letter');
        valid = false;
      }
      if (!/\d/.test(formData.password)) {
        toast.error('Password : At least 1 number');
        valid = false;
      }
      if (!/[@$!%*?&]/.test(formData.password)) {
        toast.error('Password : At least 1 special character');
        valid = false;
      }
    }

    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
   
    if (validate()) {
      setIsLoading(true);
      try {
        const response = await API.post('/login', formData);
        console.log('Login successful', response.data);
        if (response.data.success) {
          console.log("token", response.data.token);
          dispatch(loginSuccess({
            token: response.data.token,
            isLoggedIn:true
          }));
          setIsLoading(false)
          toast.success('Login Successful');
          navigate('/');
        }
      } catch (error) {
        setIsLoading(false);
        toast.error('Invalid email or password');
        console.error('Error logging in', error);
      }
    }
  };

  const navigateToSignUp = () => {
    navigate('/signup');
  };

  return (
    <div className='login'>
      <img src={crud_logo} width={95} height={80} alt="" />
      <div className='login-form'>
        <h1>Sign In</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder='Email address'
            value={formData.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder='Password'
            value={formData.password}
            onChange={handleChange}
          />
          {isLoading ? (
            <Loading />
          ) : (
            <button type='submit'>Sign In</button>
          )}
        </form>

        <div className='form-switch'>
          <p>New to App? <span onClick={navigateToSignUp}>Sign Up Now</span></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
