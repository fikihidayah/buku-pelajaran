import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { Dimensions } from 'react-native';

import { Feather } from 'react-native-vector-icons';
import { ScreenRoutes } from './screens';

const App = () => {
  return (
    <NavigationContainer>
      <ScreenRoutes />
    </NavigationContainer>
  );
};

export default App;
