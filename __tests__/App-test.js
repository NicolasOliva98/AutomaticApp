/**
 * @format
 */

import 'react-native';
import React from 'react';
import Login from '../../AutomaticApp/src/screens/Login'
import Register from '../../AutomaticApp/src/screens/Register'
import Welcome from '../../AutomaticApp/src/screens/Welcome'


import renderer from 'react-test-renderer';

it('Register test unitario', () => {
  renderer.create(<Register />);
});
it('Login test unitario', () => {
  renderer.create(<Login />);
});
it('WelcomeScreen test unitario', () => {
  renderer.create(<Welcome />);
});


