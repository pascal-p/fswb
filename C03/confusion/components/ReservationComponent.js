import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet,
         Picker, Switch, Button, Alert,
         TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import DatePicker from '@react-native-community/datetimepicker'
import Moment from 'moment';
import * as Animatable from 'react-native-animatable';


class Reservation extends Component {
  constructor(props) {
    super(props)

    this.state = {
      guests: 1,
      smoking: false,
      date: new Date().toISOString(),
      show: false,
      mode: 'date'
      // showModal: false
    }
  }

  static navigationOptions = {
    title: 'Reserve Table',
  };

  resetForm() {  // reset the form by mutating the state back to original
    this.setState({
      guests: 1,
      smoking: false,
      date: new Date().toISOString(),
      show: false
      // showModal: false
    });
  }

  handleReservation() {
    console.log(JSON.stringify(this.state));
    return(
      Alert.alert(
        'Your Reservation OK?',
        `Number of Guests: ${this.state.guests}\nSmoking? ${this.state.smoking}\nDate and Time: ${this.state.date}`,
        [
          {
            text: 'CANCEL',
            onPress: () => this.resetForm(),
            style: ' cancel'
          },
          {
            text: 'OK',
            onPress: () => this.resetForm()
          }
        ],
        { cancelable: false }
      )
    );
  }

  render() {
    return(
      <ScrollView>
        <Animatable.View animation="zoomIn" duration={1500} delay={500}>
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Number of Guests</Text>
            <Picker style={styles.formItem}
              selectedValue={this.state.guests}
              onValueChange={(itemValue, itemIndex) => this.setState({guests: itemValue})}>
              <Picker.Item label="1" value="1" />
              <Picker.Item label="2" value="2" />
              <Picker.Item label="3" value="3" />
              <Picker.Item label="4" value="4" />
              <Picker.Item label="5" value="5" />
              <Picker.Item label="6" value="6" />
            </Picker>
          </View>

          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Smoking/Non-Smoking?</Text>
            <Switch style={styles.formItem}
              value={this.state.smoking}
              trackColor='#512DA8'
              onValueChange={(value) => this.setState({smoking: value})}>
            </Switch>
          </View>

          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Date and Time</Text>
            <TouchableOpacity style={styles.formItem}
              style={{
                padding: 7,
                borderColor: '#512DA8',
                borderWidth: 2,
                flexDirection: "row"
              }}
              onPress={() => this.setState({ show: true, mode: 'date' })}>
              <Icon type='font-awesome' name='calendar' color='#512DA8' />
              <Text > {' ' + Moment(this.state.date).format('DD-MMM-YYYY h:mm A') } </Text>
            </TouchableOpacity>
            {this.state.show && (
              <DatePicker style={{flex: 2, marginRight: 20}}
                value={new Date(this.state.date)}
                mode={this.state.mode}
                is24Hour={true}
                display="default"
                placeholder="select date and Time"
                minimumDate={new Date('2020-06-01')}
                minuteInterval={30}
                onChange={(evt, date) => {
                  if (date === undefined) {
                    this.setState({ show: false });
                  }
                  else {
                    this.setState({
                      show: this.state.mode === "time" ? false : true,
                      mode: "time",
                      date: new Date(date).toISOString()
                    });
                  }
                }} />
            )}
          </View>

          <View style={styles.formRow}>
            <Button onPress={() => { this.handleReservation() }}
              title="Reserve"
              color="#512DA8" />
          </View>
        </Animatable.View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  formRow: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'row',
    margin: 20
  },
  formLabel: {
    fontSize: 18,
    flex: 2
  },
  formItem: {
    flex: 1
  },
});

export default Reservation;
