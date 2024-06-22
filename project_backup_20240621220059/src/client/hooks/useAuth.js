import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setUser, setIsAuthenticated } from '../../redux/actions';
import { toast } from 'react-toastify';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  const checkAuthentication = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const response = await fetch('https://api.freightbooks.com/validate-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.valid) {
          dispatch(setIsAuthenticated(true));
          dispatch(setUser(data.user));
        } else {
          throw new Error('Invalid token');
        }
      } catch (error) {
        console.error('Token validation error:', error);
        localStorage.removeItem('authToken');
        dispatch(setIsAuthenticated(false));
        dispatch(setUser(null));
        toast.error('Your session has expired. Please log in again.');
      }
    }
    setIsLoading(false);
  }, [dispatch]);

  useEffect(() => {
    checkAuthentication();
  }, [checkAuthentication]);

  const login = async (username, password) => {
    try {
      const response = await fetch('https://api.freightbooks.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('authToken', data.token);
        dispatch(setIsAuthenticated(true));
        dispatch(setUser(data.user));
        toast.success('Login successful!');
        return true;
      } else {
        throw new Error('Invalid username or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
      return false;
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    dispatch(setIsAuthenticated(false));
    dispatch(setUser(null));
    toast.info('You have been logged out.');
  }, [dispatch]);

  return { isLoading, login, logout };
};

