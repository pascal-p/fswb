import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import { Tile } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';

import { baseUrl } from '../shared/baseUrl';
import { Loading } from './LoadingComponent';


const mapStateToProps = state => {
  return {
    dishes: state.dishes
  }
}

class Menu extends Component {
  render() {
    const dishes = this.props.dishes;
    const { navigate } = this.props.navigation;

    if (dishes.isLoading) {
      return(<Loading />);
    }
    else if (dishes.errMess) {
      return(
        <View>
          <Text>{props.dishes.errMess}</Text>
        </View>
      );
    }

    const renderMenuItem = ({item, index}) => {
      return(
        <Animatable.View animation="fadeInRightBig" duration={2000}>
          <Tile key={index} onPress={() => navigate('Dishdetail', { dishId: item.id })}
            title={item.name}
            imageSrc={{ uri: baseUrl + item.image}}
            caption={item.description} featured />
        </Animatable.View>
      );
    }

    return (
      <FlatList data={this.props.dishes.dishes} renderItem={renderMenuItem}
        keyExtractor={item => item.id.toString()} />
    );
  }
}

export default connect(mapStateToProps)(Menu);
