import React from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { TabNavigator } from 'react-navigation';
import { createStackNavigator } from '@react-navigation/stack';
//import { render } from 'react-dom';
import { Provider } from 'react-redux';
import Expo, { Notifications } from 'expo';

import registerForNotifications from './services/push_notifications';
import store from './store';
import AuthScreen from './screens/AuthScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import MapScreen from './screens/MapScreen';
import DeckScreen from './screens/DeckScreen';
import SettingsScreen from './screens/SettingsScreen';
import ReviewScreen from './screens/ReviewScreen';

export default class App extends React.Component {
  componentDidMount() {
    registerForNotifications();
    Notifications.addListener((notification) => {
      const { data: { text }, origin } = notification;
      if (origin === 'received' && text) {
        Alert.alert(
          'New Push Notification',
          text,
          [{ text: 'Ok' }]
        );
      }
    });
  }
  render() {
    const routesConfig = {
      welcome: { screen: WelcomeScreen },
      auth: { screen: AuthScreen },
      main: {
        screen: TabNavigator({
          map: { screen: MapScreen },
          deck: { screen: DeckScreen },
          review: {
            screen: createStackNavigator({
              review: { screen: ReviewScreen },
              settings: { screen: SettingsScreen }
            })
          }
        }, {
          tabBarPosition: 'bottom',
          tabBarOptions: {
            activeTintColor: '#009688',
            labelStyle: {
              fontSize: 12,
            },
          },
        })
      }
    };

    const tabNavigatorConfig = {
      activeTintColor: '#e91e63',
      lazy: true,
      navigationOptions: {
        tabBarVisible: false
      }
    };

    const MainNavigator = TabNavigator(routesConfig, tabNavigatorConfig);

    return (
      <Provider store={store} >
        <MainNavigator />
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

//Expo.registerRootComponent(App);