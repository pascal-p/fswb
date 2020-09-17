import React, { Component } from 'react';
import { View, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import Menu from './MenuComponent';
import Home from './HomeComponent';
import About from './AboutComponent';
import Contact from './ContactComponent';
import Dishdetail from './DishdetailComponent';


const Drawer = createDrawerNavigator();
const MenuNav = createStackNavigator();

function MainNavigatorScreen() {
  return(
    <Drawer.Navigator initialRouteName='Home'
      screenOptions={{
        headerStyle: {
          backgroundColor: "#512DA8"
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          color: "#fff"
        }
      }}>
      <Drawer.Screen name="Home" component={HomeNavigatorScreen} />
      <Drawer.Screen name="About Us" component={AboutNavigatorScreen} />
      <Drawer.Screen name="Menu" component={MenuNavigatorScreen} />
      <Drawer.Screen name="Contact Us" component={ContactNavigatorScreen} />
    </Drawer.Navigator>
  );
}

function MenuNavigatorScreen() {
   return(
    <MenuNav.Navigator initialRouteName='Home'
      screenOptions={{
        headerStyle: {
          backgroundColor: "#512DA8"
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          color: "#fff"
        }
      }}>
      <MenuNav.Screen name="Menu" component={Menu} />
      <MenuNav.Screen name="Dishdetail" component={Dishdetail} options={{ headerTitle: "Dish Detail"}} />
    </MenuNav.Navigator>
  );
}

function HomeNavigatorScreen() {
   return(
    <MenuNav.Navigator initialRouteName='Home'
      screenOptions={{
        headerStyle: {
          backgroundColor: "#512DA8"
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          color: "#fff"
        }
      }}>
      <MenuNav.Screen name="Home" component={Home} />
    </MenuNav.Navigator>
  );
}

function AboutNavigatorScreen() {
   return(
    <MenuNav.Navigator initialRouteName='About'
      screenOptions={{
        headerStyle: {
          backgroundColor: "#512DA8"
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          color: "#fff"
        }
      }}>
      <MenuNav.Screen name="About" component={About} />
    </MenuNav.Navigator>
  );
}

function ContactNavigatorScreen() {
   return(
    <MenuNav.Navigator initialRouteName='Contact'
      screenOptions={{
        headerStyle: {
          backgroundColor: "#512DA8"
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          color: "#fff"
        }
      }}>
      <MenuNav.Screen name="Contact" component={Contact} />
    </MenuNav.Navigator>
  );
}


/* Functional Version
export default function Main() {
  return (
    <NavigationContainer>
      <MainNavigatorScreen />
    </NavigationContainer>
  );
}
*/

class Main extends Component {
  render() {
    return (
      <NavigationContainer>
        <MainNavigatorScreen />
      </NavigationContainer>
    );
  }
}

export default Main;

/*
 Check: https://reactnavigation.org/docs/nesting-navigators/
        https://reactnavigation.org/docs/nesting-navigators/#navigating-to-a-screen-in-a-nested-navigator

*/
