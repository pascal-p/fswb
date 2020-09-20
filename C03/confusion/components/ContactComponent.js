import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Card } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';


export default function Contact() {
  return (
    <View>
      <Animatable.View animation="fadeInDown" duration={2000} delay={1000}>
        <Card>
          <Card.FeaturedTitle style={{textAlign: "center", color: "black"}}>Contact Information</Card.FeaturedTitle>
          <Card.Divider/>
          <Text style={{margin: 10}}>121, Clear Water Bay Road</Text>
          <Text style={{margin: 10}}>Clear Water Bay, Kowloon</Text>
          <Text style={{margin: 10}}>HONG KONG</Text>
          <Text style={{margin: 10}}>Tel: +852 1234 5678</Text>
          <Text style={{margin: 10}}>Fax: +852 8765 4321</Text>
          <Text style={{margin: 10}}>Email:confusion@food.net</Text>
        </Card>
      </Animatable.View>
    </View>
  );
}
