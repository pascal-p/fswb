import React, { Component } from 'react';
import { View, StyleSheet, Text, ScrollView, Image } from 'react-native';
import { Icon, Input, CheckBox, Button } from 'react-native-elements';
import * as SecureStore from 'expo-secure-store';
import { baseUrl } from '../shared/baseUrl';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as ImageManipulator from 'expo-image-manipulator'
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import { Asset } from 'expo-asset';


const tabNavigator = createBottomTabNavigator();

class LoginTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      remember: false
    }
  }

  componentDidMount() {
    SecureStore.getItemAsync('userinfo')
      .then((userdata) => {
        let userinfo = JSON.parse(userdata);

        if (userinfo) {
          this.setState({username: userinfo.username});
          this.setState({password: userinfo.password});
          this.setState({remember: true})
        }
      })
  }

  static navigationOptions = {
    title: 'Login',
    tabBarIcon: ({ tintColor }) => (
        <Icon name='sign-in' type='font-awesome' size={24} iconStyle={{ color: tintColor }} />
    )
  };

  handleLogin(evt) {
    evt.preventDefault();
    console.log("handleLogin called with: " + JSON.stringify(this.state));

    if (this.state.remember) {
      SecureStore.setItemAsync('userinfo',
                               JSON.stringify({username: this.state.username, password: this.state.password}))
        .catch((error) => console.log('Could not save user info' + error));
    }
    else {
      SecureStore.deleteItemAsync('userinfo')
        .catch((error) => console.log('Could not delete user info' + error));

      // clear login form?
      this.setState({
        username: '',
        password: '',
        remember: false
      });

      console.log("new state: " + JSON.stringify(this.state));
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Input placeholder="Username" leftIcon={{ type: 'font-awesome', name: 'user-o' }}
          onChangeText={(username) => this.setState({username})}
          value={this.state.username}
          inputContainerStyle={styles.formInput} />

        <Input placeholder="Password" leftIcon={{ type: 'font-awesome', name: 'key' }}
          onChangeText={(password) => this.setState({password})}
          value={this.state.password}
          inputContainerStyle={styles.formInput} />

        <CheckBox title="Remember Me" center checked={this.state.remember}
          onPress={() => this.setState({remember: !this.state.remember})}
          inputContainerStyle={styles.formCheckbox} />

        <View style={styles.formButton}>
          <Button onPress={(evt) => this.handleLogin(evt)} title="Login"
            icon={<Icon name='sign-in' type='font-awesome' size={24} color='white' />}
            buttonStyle={{backgroundColor: "#512DA8"}} />
        </View>

        <View style={styles.formButton}>
          <Button onPress={() => this.props.navigation.navigate('Register')} title="Register" clear
            icon={<Icon name='user-plus' type='font-awesome' size={24} color= 'blue' />}
            titleStyle={{ color: "blue" }} />
        </View>
      </View>
    );
  }
}

class RegisterTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      firstname: '',
      lastname: '',
      email: '',
      remember: false,
      imageUrl: baseUrl + 'images/logo.png'
    }
  }

  getImageFromCamera = async () => {
    const cameraPermission = await Permissions.askAsync(Permissions.CAMERA);
    const cameraRollPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    if (cameraPermission.status === 'granted' && cameraRollPermission.status === 'granted') {
      let capturedImage = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!capturedImage.cancelled) {
        console.log("Captured image: " + capturedImage.uri);
        this.processImage(capturedImage.uri);
      }
    }
  }

  getImageFromGallery = async () => {
    const cameraPermission = await Permissions.askAsync(Permissions.CAMERA);
    const cameraRollPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    if (cameraPermission.status === 'granted' && cameraRollPermission.status === 'granted') {
      let imageFromGallery = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!imageFromGallery.cancelled) {
        console.log("Gallery image: " + imageFromGallery.uri);
        this.processImage(imageFromGallery.uri);
      }
    }
  }

  processImage = async (imageUri) => {
    let processedImage = await ImageManipulator.manipulateAsync(
      imageUri,
      [
        { resize: { width: 600 } }
            ],
      { format: 'png' }
    );
    console.log(processedImage);

    this.setState({imageUrl: processedImage.uri});
  }

  static navigationOptions = {
    title: 'Register',
    tabBarIcon: ({ tintColor, focused }) => (
        <Icon name='user-plus' type='font-awesome' size={24} iconStyle={{ color: tintColor }} />
    )
  };

  handleRegister() {
    console.log(JSON.stringify(this.state));

    if (this.state.remember) {
      SecureStore.setItemAsync('userinfo',
                               JSON.stringify({username: this.state.username, password: this.state.password}))
        .catch((error) => console.log('Could not save user info', error));
    }
  }

  render() {
    return(
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            <Image source={{uri: this.state.imageUrl}} loadingIndicatorSource={require('./images/logo.png')} style={styles.image} />
            <Button title="Camera" onPress={this.getImageFromCamera} />
            <Button title="Gallery" onPress={this.getImageFromGallery} />
          </View>

          <Input placeholder="Username" leftIcon={{ type: 'font-awesome', name: 'user-o' }}
            onChangeText={(username) => this.setState({username})} value={this.state.username} containerStyle={styles.formInput} />

          <Input placeholder="Password" leftIcon={{ type: 'font-awesome', name: 'key' }}
            onChangeText={(password) => this.setState({password})} value={this.state.password} containerStyle={styles.formInput}  />

          <Input placeholder="First Name" leftIcon={{ type: 'font-awesome', name: 'user-o' }}
            onChangeText={(lastname) => this.setState({firstname})} value={this.state.firstname} containerStyle={styles.formInput} />

          <Input placeholder="Last Name" leftIcon={{ type: 'font-awesome', name: 'user-o' }}
            onChangeText={(lastname) => this.setState({lastname})} value={this.state.lastname} containerStyle={styles.formInput} />

          <Input placeholder="Email" leftIcon={{ type: 'font-awesome', name: 'envelope-o' }}
            onChangeText={(email) => this.setState({email})} value={this.state.email} containerStyle={styles.formInput} />

          <CheckBox title="Remember Me" center checked={this.state.remember}
            onPress={() => this.setState({remember: !this.state.remember})} containerStyle={styles.formCheckbox} />

          <View style={styles.formButton}>
            <Button onPress={() => this.handleRegister()} title="Register"
              icon={<Icon name='user-plus' type='font-awesome' size={24} color= 'white' />}
              buttonStyle={{ backgroundColor: "#512DA8" }} />
          </View>
        </View>
      </ScrollView>
    );
  }
}

function Login() {
  return(
    <NavigationContainer independent={true}>
      <tabNavigator.Navigator initialRouteName='Login'
        tabBarOptions={{ activeBackgroundColor: '#9575CD',
                         inactiveBackgroundColor: '#D1C4E9',
                         activeTintColor: '#ffffff',
                         inactiveTintColor: 'gray' }}>

      <tabNavigator.Screen name='Login' component={LoginTab}
        options={{ title: 'Login',
                   tabBarIcon:({ tintColor }) => (
                        <Icon name='sign-in' type='font-awesome' size={24} iconStyle={{ color: tintColor }} />
                   )
                 }} />

      <tabNavigator.Screen name='Register' component={RegisterTab}
        options={{ title: 'Register',
                   tabBarIcon:({ tintColor }) => (
                            <Icon name='user-plus' type='font-awesome' size={24} iconStyle={{ color: tintColor }} />
                   )
                 }}
      />
      </tabNavigator.Navigator>
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    margin: 20,
  },
  imageContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent:'space-around',
    margin: 20
  },
  image: {
    margin: 10,
    width: 80,
      height: 60
  },
  formInput: {
    margin: 40
  },
  formCheckbox: {
    margin: 40,
    backgroundColor: null
  },
  formButton: {
    margin: 60
  }
});

export default Login;
