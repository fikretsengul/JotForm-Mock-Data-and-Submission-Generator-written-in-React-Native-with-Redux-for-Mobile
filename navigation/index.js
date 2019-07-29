import React from 'react';
import { Image } from 'react-native';
import { createAppContainer, createStackNavigator } from 'react-navigation';

import Welcome from '../screens/Welcome';
import Login from '../screens/Login';
import Browse from '../screens/Browse';
import Form from '../screens/Form';

import { theme } from '../constants';

const screens = createStackNavigator({
  Welcome,
  Login,
  Browse,
  Form
});

export default createAppContainer(screens);