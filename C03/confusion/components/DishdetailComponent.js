import React, { Component, useRef } from 'react';
import { Text, View, ScrollView, FlatList,
         StyleSheet, Modal, Button,
         Alert, PanResponder } from 'react-native';
import { Card, Icon, Rating, Input, } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';

import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';


const mapStateToProps = state => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    favorites: state.favorites
  }
}

const mapDispatchToProps = dispatch => ({
  postFavorite: (dishId) => dispatch(postFavorite(dishId)),
  postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment)),
})

function RenderComments(props) {
  const comments = props.comments;

  const renderCommentItem = ({item, index}) => {
    return (
      <View key={index} style={{margin: 10}}>
        <Text style={{fontSize: 14}}>{item.comment}</Text>
        <Rating style={{marginRight: 'auto'}} imageSize={12} readonly startingValue={item.rating} />
        <Text style={{fontSize: 12}}>{'-- ' + item.author + ', ' + item.date} </Text>
      </View>
    );
  };

  return(
    <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>
      <Card>
        <Card.Title> Comments </Card.Title>
        <FlatList data={comments} renderItem={renderCommentItem} keyExtractor={item => item.id.toString()} />
      </Card>
    </Animatable.View>
  );
}

function RenderDish(props) {
  const dish = props.dish;

  const animRef = useRef();

  const recognizeDrag = ({ _moveX, _moveY, dx, _dy }) => dx < -200;
  const recognizeComment = ({ _moveX, _moveY, dx, _dy }) => dx > 200;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (_e, _gestureState) => { return true; },
    onPanResponderGrant: () => { animRef.current.rubberBand(1000)
                                 .then(endState => console.log(endState.finished ? 'finished' : 'cancelled')); },
    onPanResponderEnd: (_e, gestureState) => {
      console.log("pan responder end", gestureState);

      if (recognizeDrag(gestureState)) {
        Alert.alert(
          'Add Favorite',
          'Are you sure you wish to add ' + dish.name + ' to favorite?',
          [
            {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            {text: 'OK', onPress: () => {props.favorite ? console.log('Already favorite') : props.onPress()}},
          ],
          { cancelable: false }
        );
      }
      else if (recognizeComment(gestureState)) {
        props.toggleModal();
      }
      return true;
    }
  })

  if (dish != null) {
    return(
      <Animatable.View animation="fadeInDown" duration={2000} delay={1000} ref={animRef} {...panResponder.panHandlers}>
        <Card>
          <Card.Title>{dish.name}</Card.Title>
          <Card.Divider/>
          <Card.Image source={{uri: baseUrl + dish.image}}>
          </Card.Image>
          <Text style={{margin: 10}}> {dish.description} </Text>

          <View style={styles.formRow}>
            <Icon raised reverse name={ props.favorite ? 'heart' : 'heart-o'}
              type='font-awesome' color='#f50'
              onPress={() => props.favorite ? console.log('Already favorite') : props.onPress()} />

            <Icon raised reverse name='pencil' type='font-awesome' color='#512DA8'
              onPress={() => props.toggleModal() } />
          </View>
        </Card>
      </Animatable.View>
    );
  }
  else {
    return(<View></View>);
  }
}

class Dishdetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      favorites: [],

      showModal: false,
      rating: 0,
      author: '',
      comment: ''
    };
  }

  markFavorite(dishId) {
    this.props.postFavorite(dishId);
  }

  toggleModal() {
    this.setState({showModal: !this.state.showModal});
  }

  handleCommentSubmit(dishId) {
    console.log(">> state: " + JSON.stringify(this.state));
    this.props.postComment(dishId, this.state.rating,
                           this.state.author, this.state.comment);
    this.toggleModal();
  }

  render() {
    const dishId = this.props.route.params.dishId;

    return(
      <View>
        <RenderDish dish={this.props.dishes.dishes[+dishId]} favorite={this.props.favorites.some(el => el === dishId)}
          toggleModal={() => this.toggleModal()} onPress={() => this.markFavorite(dishId)} />

        <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />

        {/* the modal containing the 'form' */}
        <Modal animationType={"slide"} transparent={false}
          visible={this.state.showModal}
          onDismiss={ () => this.toggleModal() }
          onRequestClose={ () => this.toggleModal() }>

          <ScrollView>
            <View style={styles.formRow}>
              <Rating type='star' ratingCount={5} imageSize={20} showRating startingValue={1}
                onFinishRating={rating => this.setState({rating: rating})} />
            </View>

            <View style={styles.formRow}>
              <Input placeholder='Author' leftIcon={<Icon name='user-o' type='font-awesome' color='black' />}
                onChangeText={value => this.setState({ author: value })} />
            </View>

            <View style={styles.formRow}>
              <Input placeholder='Comment' leftIcon={<Icon name='comment-o' type='font-awesome' color='black' />}
                onChangeText={value => this.setState({ comment: value })} />
            </View>

            <View style={styles.btnRow}>
              <Button onPress={() => { this.handleCommentSubmit(dishId) }} title="Submit" color="#512DA8"
                accessibilityLabel="Learn more about this purple button" />
            </View>

            <View style={styles.btnRow}>
              <Button title="Cancel" type="clear" type="solid" color="gray" />
            </View>

          </ScrollView>
      </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  btnRow: {
    alignSelf: 'stretch',
    margin: 5
  },
  formRow: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'row',
    margin: 20
  },
  button: {
    flexDirection: 'row',
  },
  modal: {
    justifyContent: 'center',
    margin: 20
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    backgroundColor: '#512DA8',
    textAlign: 'center',
    color: 'white',
    marginBottom: 20
  },
  modalText: {
    fontSize: 18,
    margin: 10
  }
});

  export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);

/*
 * Using VirtualView leads to 'VirtualizedLists should never be nested inside plain ScrollViews' Warning
 * cf. https://nyxo.app/fixing-virtualizedlists-should-never-be-nested-inside-plain-scrollviews
 *
 * Reverting to View...
 */
