import { useState } from 'react';

export const useLocalStorageBind = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValueWithCallback = (newValue, callback) => {
    console.log('newValue: ', newValue);
    try {
      setValue(newValue);
      window.localStorage.setItem(key, JSON.stringify(newValue));
      if (callback) callback(newValue);
    } catch (error) {
      console.error(error);
    }
  };

  return [value, setValueWithCallback];
};
