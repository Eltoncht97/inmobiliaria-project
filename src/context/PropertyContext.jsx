import React, { createContext, useState, useEffect, useContext } from 'react';
import { mockProperties } from '../data/mockProperties';

const PropertyContext = createContext();

export const PropertyProvider = ({ children }) => {
  // Properties State
  const [properties, setProperties] = useState(() => {
    const saved = localStorage.getItem('luxe_properties');
    return saved ? JSON.parse(saved) : mockProperties;
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

  const addProperty = (property) => {
    const newProperty = {
      ...property,
      id: Date.now().toString(),
      priceUsd: Number(property.priceUsd)
    };
    setProperties(prev => [newProperty, ...prev]);
    return newProperty.id;
  };

  const updateProperty = (updatedProperty) => {
    setProperties(prev => prev.map(prop => 
      prop.id === updatedProperty.id 
        ? { ...updatedProperty, priceUsd: Number(updatedProperty.priceUsd) } 
        : prop
    ));
  };

  const deleteProperty = (propertyId) => {
    setProperties(prev => prev.filter(prop => prop.id !== propertyId));
    // Also remove from favorites if deleted
    setFavorites(prev => prev.filter(id => id !== propertyId));
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
