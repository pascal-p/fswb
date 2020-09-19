import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity,
         Animated, Alert } from 'react-native';
import { Avatar, ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import { deleteFavorite } from '../redux/ActionCreators';


const mapStateToProps = state => {
  return {
    dishes: state.dishes,
    favorites: state.favorites
  }
}

const mapDispatchToProps = dispatch => ({
  deleteFavorite: (dishId) => dispatch(deleteFavorite(dishId))
});

class Favorites extends Component {

  render() {
    const { navigate } = this.props.navigation;

    const rightBtn = (progress, dragX, item) => {
      const scale = dragX.interpolate({
        inputRange: [-100, 0],
        outputRange: [1, 0],
        extrapolate: 'clamp'
      });

      return(
        <React.Fragment>
          <TouchableOpacity onPress={() => {
            Alert.alert('Delete Favorite?',
                        'Are you sure to delete your Favorite Dish' + item.name + '?',
                        [{
                          text: 'Cancel',
                          onPress: () => console.log(item.name + 'Not Deleted'),
                          style: ' cancel'
                         },
                         {
                           text: 'OK',
                           onPress: () => this.props.deleteFavorite(item.id)
                         }
                        ],
                        { cancelable: false }
                       )
          }}>
            <View style={{flex: 1, backgroundColor: '#dd2c00', justifyContent: 'center', alignItems: 'flex-end'}}>
              <Animated.Text style={{color: '#ffffff', paddingHorizontal: 20, fontWeight:'bold', transform: [{scale}]}}>
                Delete
              </Animated.Text>
            </View>
          </TouchableOpacity>
        </React.Fragment>
      );
    }

    const renderMenuItem = ({item, index}) => {
      return (
        <Swipeable renderRightActions={(progress, dragX) => rightBtn(progress, dragX, item)}>
          <ListItem key={index} onPress={() => navigate('Dishdetail', { dishId: item.id })}>
            <Avatar source={{uri: baseUrl + item.image}} />
            <ListItem.Content>
              <ListItem.Title> {item.name} </ListItem.Title>
              <ListItem.Subtitle> {item.description} </ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>

        </Swipeable>
      );
    };

    if (this.props.dishes.isLoading) {
      return(<Loading />);
    }
    else if (this.props.dishes.errMess) {
      return(
        <View>
          <Text>{this.props.dishes.errMess}</Text>
        </View>
      );
    }
    return (
      <FlatList data={this.props.dishes.dishes.filter(dish => this.props.favorites.some(el => el === dish.id))}
        renderItem={renderMenuItem} keyExtractor={item => item.id.toString()} />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Favorites);
