import React, { Component } from 'react';
import { ScrollView, Text, View, Image,
         StyleSheet, ToastAndroid } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerItemList } from '@react-navigation/drawer';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import NetInfo from "@react-native-community/netinfo";

import { fetchDishes, fetchComments, fetchPromos, fetchLeaders } from '../redux/ActionCreators';
import Menu from './MenuComponent';
import Home from './HomeComponent';
import About from './AboutComponent';
import Contact from './ContactComponent';
import Dishdetail from './DishdetailComponent';
import Reservation from './ReservationComponent';
import Favorite from './FavoriteComponent';
import Login from './LoginComponent';


const mapStateToProps = state => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    promotions: state.promotions,
    leaders: state.leaders
  }
}

const mapDispatchToProps = dispatch => ({
  fetchDishes: () => dispatch(fetchDishes()),
  fetchComments: () => dispatch(fetchComments()),
  fetchPromos: () => dispatch(fetchPromos()),
  fetchLeaders: () => dispatch(fetchLeaders()),
})

const Drawer = createDrawerNavigator();
const MenuNav = createStackNavigator();

const HeaderOptions = {
  headerStyle: {
    backgroundColor: '#512DA8'
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    color: '#fff'
  }
};

const navFn = ({navigation}) => ({
  headerLeft: () => (<Icon name='menu' size={24} color='white' onPress={() => navigation.toggleDrawer()} />)
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  drawerHeader: {
    backgroundColor: '#512DA8',
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'row'
  },

  drawerHeaderText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold'
  },

  drawerImage: {
    margin: 10,
    width: 80,
    height: 60
  }
});

const CustomDrawerContentComponent = (props) => (
  <ScrollView>
    <View style={styles.drawerHeader}>
      <View style={{flex: 1}}>
        <Image source={require('./images/logo.png')} style={styles.drawerImage} />
      </View>

      <View style={{flex: 2}}>
        <Text style={styles.drawerHeaderText}>Ristorante Con Fusion</Text>
      </View>
    </View>

    <DrawerItemList {...props}/>
  </ScrollView>
);

function MainNavigatorScreen() {
  return(
    <Drawer.Navigator initialRouteName='Home' drawerStyle={{ backgroundColor:'#D1C4E9' }}
      drawerContentOptions={{
        backgroundColor:'#d1c4e9'
      }} drawerContent={ props => <CustomDrawerContentComponent {...props} /> }>

      <Drawer.Screen name="Login" component={LoginNavigatorScreen}
        options={{ drawerIcon: ({tintColor}) => (<Icon name='sign-in' type='font-awesome' size={24} color={tintColor} />) }} />

      <Drawer.Screen name="Home" component={HomeNavigatorScreen}
        options={{ drawerIcon: ({tintColor}) => (<Icon name='home' type='font-awesome' size={24} color={tintColor} />) }} />

      <Drawer.Screen name="About Us" component={AboutNavigatorScreen}
        options={{ drawerIcon: ({tintColor}) => (<Icon name='info-circle' type='font-awesome' size={24} color={tintColor} />) }} />

      <Drawer.Screen name="Menu" component={MenuNavigatorScreen}
        options={{ drawerIcon: ({tintColor}) => (<Icon name='list' type='font-awesome' size={24} color={tintColor} />) }} />

      <Drawer.Screen name="Contact Us" component={ContactNavigatorScreen}
        options={{ drawerIcon: ({tintColor}) => (<Icon name='address-card' type='font-awesome' size={22} color={tintColor} />) }} />

      <Drawer.Screen name="My Favorite" component={FavoriteNavigatorScreen}
        options={{ drawerIcon: ({tintColor}) => (<Icon name='heart' type='font-awesome' size={22} color={tintColor} />) }} />

      <Drawer.Screen name="Reserve Table" component={ReservationNavigatorScreen}
        options={{ drawerIcon: ({tintColor}) => (<Icon name='cutlery' type='font-awesome' size={22} color={tintColor} />) }} />
    </Drawer.Navigator>
  );
}

function MenuNavigatorScreen() {
   return(
    <MenuNav.Navigator initialRouteName='Home' screenOptions={HeaderOptions}>
      <MenuNav.Screen name='Menu' component={Menu} options={navFn} />
      <MenuNav.Screen name='Dishdetail' component={Dishdetail} options={{ headerTitle: "Dish Detail"}} />
    </MenuNav.Navigator>
  );
}

function HomeNavigatorScreen() {
   return(
    <MenuNav.Navigator initialRouteName='Home' screenOptions={HeaderOptions}>
      <MenuNav.Screen name='Home' component={Home} options={navFn} />
    </MenuNav.Navigator>
  );
}

function LoginNavigatorScreen() {
   return(
    <MenuNav.Navigator initialRouteName='Login' screenOptions={HeaderOptions}>
      <MenuNav.Screen name='Login' component={Login} options={navFn} />
    </MenuNav.Navigator>
  );
}

function AboutNavigatorScreen() {
   return(
    <MenuNav.Navigator initialRouteName='About' screenOptions={HeaderOptions}>
      <MenuNav.Screen name='About' component={About} options={navFn} />
    </MenuNav.Navigator>
  );
}

function ContactNavigatorScreen() {
   return(
    <MenuNav.Navigator initialRouteName='Contact' screenOptions={HeaderOptions}>
      <MenuNav.Screen name='Contact' component={Contact} options={navFn} />
    </MenuNav.Navigator>
  );
}

function ReservationNavigatorScreen() {
   return(
    <MenuNav.Navigator initialRouteName='Reservation' screenOptions={HeaderOptions}>
      <MenuNav.Screen name='Reservation' component={Reservation} options={navFn} />
    </MenuNav.Navigator>
  );
}

function FavoriteNavigatorScreen() {
   return(
    <MenuNav.Navigator initialRouteName='Favorite' screenOptions={HeaderOptions}>
      <MenuNav.Screen name='Favorite' component={Favorite} options={navFn} />
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
  componentDidMount() {
    this.props.fetchDishes();
    this.props.fetchComments();
    this.props.fetchPromos();
    this.props.fetchLeaders();

    NetInfo.fetch().then((connectionInfo) => {
      ToastAndroid.show('Initial Network Connectivity Type: '
                        + connectionInfo.type, ToastAndroid.LONG)
    });

    NetInfo.addEventListener(connectionChange => this.handleConnectivityChange(connectionChange));
  }

  componentWillUnmount() {
    NetInfo.removeEventListener(connectionChange => this.handleConnectivityChange(connectionChange))
  }

  handleConnectivityChange = (connectionInfo) => {
    console.log("handleConnectivityChange: " + connectionInfo.type);

    switch (connectionInfo.type) {
      case 'none':
      ToastAndroid.show('You are now offline', ToastAndroid.LONG);
      break;

    case 'wifi':
      ToastAndroid.show('You are now on WiFi', ToastAndroid.LONG);
      break;

    case 'cellular':
      ToastAndroid.show('You are now on Cellular', ToastAndroid.LONG);
      break;

    case 'unknown' :
      ToastAndroid.show('You are now have an Unknown connection', ToastAndroid.LONG);
      break;
    default:
    }
  }

  render() {
    return (
      <NavigationContainer>
        <MainNavigatorScreen />
      </NavigationContainer>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);

/*
 Check: https://reactnavigation.org/docs/nesting-navigators/
        https://reactnavigation.org/docs/nesting-navigators/#navigating-to-a-screen-in-a-nested-navigator

*/
