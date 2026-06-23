import React, { createContext, useState, useEffect, useContext } from 'react';
import { mockProperties } from '../data/mockProperties';
import { useAuth } from './AuthContext';

const PropertyContext = createContext();

export const PropertyProvider = ({ children }) => {
  // Properties State
  const [properties, setProperties] = useState(() => {
    const saved = localStorage.getItem('luxe_properties');
    return saved ? JSON.parse(saved) : [];
  });

  // Favorites State (Array of Property IDs)
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('luxe_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // Appointments State
  const [appointments, setAppointments] = useState(() => {
    const saved = localStorage.getItem('luxe_appointments');
    return saved ? JSON.parse(saved) : [];
  });

  // Callback Requests State
  const [callbacks, setCallbacks] = useState(() => {
    const saved = localStorage.getItem('luxe_callbacks');
    return saved ? JSON.parse(saved) : [];
  });

  // Currency State (USD or PEN)
  const [currency, setCurrency] = useState(() => {
    const saved = localStorage.getItem('luxe_currency');
    return saved ? saved : 'USD';
  });

  const exchangeRate = 3.75; // 1 USD = 3.75 PEN

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('luxe_properties', JSON.stringify(properties));
  }, [properties]);

  // Fetch properties from backend on mount
  useEffect(() => {
    const fetchProps = async () => {
      try {
        const res = await fetch('http://localhost:4001/properties');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setProperties(data);
      } catch (err) {
        console.error('Could not fetch properties:', err);
        // Fallback to mock if available
        const saved = localStorage.getItem('luxe_properties');
        if (!saved) setProperties(mockProperties);
      }
    };
    fetchProps();
  }, []);

  useEffect(() => {
    localStorage.setItem('luxe_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('luxe_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('luxe_callbacks', JSON.stringify(callbacks));
  }, [callbacks]);

  useEffect(() => {
    localStorage.setItem('luxe_currency', currency);
  }, [currency]);

  // Operations
  const toggleFavorite = (propertyId) => {
    setFavorites(prev => {
      if (prev.includes(propertyId)) {
        return prev.filter(id => id !== propertyId);
      } else {
        return [...prev, propertyId];
      }
    });
  };

  const { getAuthHeader } = useAuth();

  const addProperty = (property) => {
    // create on backend then update local state
    return fetch('http://localhost:4001/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(getAuthHeader()) },
      body: JSON.stringify(property)
    }).then(res => res.json()).then(created => {
      setProperties(prev => [created, ...prev]);
      return created.id;
    });
  };

  const updateProperty = (updatedProperty) => {
    // send update to backend
    fetch(`http://localhost:4001/properties/${updatedProperty.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...(getAuthHeader()) },
      body: JSON.stringify(updatedProperty)
    }).then(res => res.json()).then(updated => {
      setProperties(prev => prev.map(prop => prop.id === updated.id ? updated : prop));
    }).catch(err => console.error('Update failed', err));
  };

  const deleteProperty = (propertyId) => {
    fetch(`http://localhost:4001/properties/${propertyId}`, { method: 'DELETE', headers: { ...(getAuthHeader()) } })
      .then(res => {
        if (!res.ok) throw new Error('Delete failed');
        setProperties(prev => prev.filter(prop => prop.id !== propertyId));
        setFavorites(prev => prev.filter(id => id !== propertyId));
      })
      .catch(err => console.error('Delete error', err));
  };

  const addAppointment = (appointment) => {
    const newAppointment = {
      ...appointment,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setAppointments(prev => [newAppointment, ...prev]);
    return newAppointment;
  };

  const addCallback = (callbackRequest) => {
    const newCallback = {
      ...callbackRequest,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setCallbacks(prev => [newCallback, ...prev]);
    return newCallback;
  };

  // Price conversion and formatting helper
  const formatPrice = (priceInUsd, isMonthly = false) => {
    let finalPrice = priceInUsd;
    let symbol = '$';
    
    if (currency === 'PEN') {
      finalPrice = priceInUsd * exchangeRate;
      symbol = 'S/.';
    }

    // Format with commas
    const formatted = Math.round(finalPrice).toLocaleString('es-PE');
    
    return `${symbol} ${formatted}${isMonthly ? '/mes' : ''}`;
  };

  // Convert USD to PEN (raw number)
  const convertPrice = (priceInUsd) => {
    return currency === 'PEN' ? priceInUsd * exchangeRate : priceInUsd;
  };

  return (
    <PropertyContext.Provider value={{
      properties,
      favorites,
      appointments,
      callbacks,
      currency,
      exchangeRate,
      setCurrency,
      toggleFavorite,
      addProperty,
      updateProperty,
      deleteProperty,
      addAppointment,
      addCallback,
      formatPrice,
      convertPrice
    }}>
      {children}
    </PropertyContext.Provider>
  );
};

export const useProperties = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('useProperties must be used within a PropertyProvider');
  }
  return context;
};
