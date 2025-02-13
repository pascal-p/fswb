import React, { Component } from 'react';
import { Text, View, FlatList } from 'react-native';
import { Card, Avatar, ListItem } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';

import { baseUrl } from '../shared/baseUrl';
import { Loading } from './LoadingComponent';


const mapStateToProps = state => {
  return {
    leaders: state.leaders
  }
}

function History() {
  return(
    <Card>
      <Card.FeaturedTitle style={{textAlign: "center", color: "black"}}> Our History </Card.FeaturedTitle>
      <Card.Divider/>
      <Text style={{margin: 10}}>
        Started in 2010, Ristorante con Fusion quickly established itself as a culinary icon par excellence in Hong Kong.
        With its unique brand of world fusion cuisine that can be found nowhere else, it enjoys patronage from the A-list clientele in Hong Kong.
        Featuring four of the best three-star Michelin chefs in the world, you never know what will arrive on your plate the next time you visit us.
      </Text>

      <Text style={{margin: 10}}>
        The restaurant traces its humble beginnings to The Frying Pan, a successful chain started by our CEO, Mr. Peter Pan, that featured for the first time the world's best cuisines in a pan.
      </Text>
    </Card>
  );
}

class About extends Component {
  render() {
    const leaders = this.props.leaders;

    if (leaders.isLoading) {
      return(
        <ScrollView>
          <History />
          <Card>
            <Card.FeaturedTitle style={{textAlign: "center", color: "black"}}> Corporate Leadership </Card.FeaturedTitle>
            <Loading />
          </Card>
        </ScrollView>
      );
    }
    else if (leaders.errMess) {
      return(
        <ScrollView>
          <History />
          <Card>
            <Card.FeaturedTitle style={{textAlign: "center", color: "black"}}> Corporate Leadership </Card.FeaturedTitle>
            <Text>{this.props.leaders.errMess}</Text>
          </Card>
        </ScrollView>
      );
    }

    const renderLeader = ({item, index}) => {
      return(
        <ListItem key={index}>
          <Avatar source={{uri: baseUrl + item.image}} />
          <ListItem.Content>
            <ListItem.Title>{item.name}</ListItem.Title>
            <ListItem.Subtitle>{item.description}</ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      );
    }

    const { navigate } = this.props.navigation;

    return (
      <View>
        <History />
        <Animatable.View animation="fadeInDown" duration={2000} delay={1000}>
          <Card>
            <Card.FeaturedTitle style={{textAlign: "center", color: "black"}}> Corporate Leadership </Card.FeaturedTitle>
            <FlatList data={this.props.leaders.leaders} renderItem={renderLeader} keyExtractor={item => item.id.toString()} />
          </Card>
        </Animatable.View>
      </View>
    );
  }
}

export default connect(mapStateToProps)(About);
