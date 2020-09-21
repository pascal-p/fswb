import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet,
         Picker, Switch, Button, Alert,
         TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import DatePicker from '@react-native-community/datetimepicker'
import Moment from 'moment';
import * as Animatable from 'react-native-animatable';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import * as Calendar from 'expo-calendar';


class Reservation extends Component {
  constructor(props) {
    super(props)

    this.state = {
      guests: 1,
      smoking: false,
      date: new Date().toISOString(),
      show: false,
      mode: 'date'
    }
  }

  resetForm() {  // reset the form by mutating the state back to original
    this.setState({
      guests: 1,
      smoking: false,
      date: new Date().toISOString(),
      show: false
    });
  }

  async obtainNotificationPermission() {
    let permission = await Permissions.getAsync(Permissions.USER_FACING_NOTIFICATIONS);

    if (permission.status !== 'granted') {
      permission = await Permissions.askAsync(Permissions.USER_FACING_NOTIFICATIONS);

      if (permission.status !== 'granted') {
        Alert.alert('Permission not granted to show notifications');
      }
    }
    return permission;
  }

  async presentLocalNotification(date) {
    await this.obtainNotificationPermission();

    Notifications.presentLocalNotificationAsync({
      title: 'Your Reservation',
      body: 'Reservation for '+ date + ' requested',
      ios: {
        sound: true
      },
      android: {
        sound: true,
        vibrate: true,
        color: '#512DA8'
      }
    });
  }

  handleReservation() {
    console.log(JSON.stringify(this.state));

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
    );

    if (this.obtainCalendarPermission()) {
      console.log("Calendar Pemission granted...");
      this.addReservationToCalendar(this.state.date);
    }
    else {
      console.log("Calendar Pemission denied...");
    }
  }

  obtainCalendarPermission = async () => {
    const calPerm = await Calendar.requestCalendarPermissionsAsync(); // Permission.CALENDAR;
    return calPerm === 'granted';
  }

  getDefaultCalendarSrc = async() => {
    const calendars = await Calendar.getCalendarsAsync();
    const defaultCalendars = calendars.filter(each => each.source.name === 'My calendar');

    return defaultCalendars[0].source;
  }

  addReservationToCalendar = async (date) => {
    const datems = Date.parse(date);
    const startDate = new Date(datems);
    const endDate = new Date(datems + 2 * 3600 * 1000);

    // Android only...
    const defaultCalendarSrc = await this.getDefaultCalendarSrc();

    if (defaultCalendarSrc !== undefined) {
      const details = {
        title: 'Con Fusion Table Reservation',
        source: defaultCalendarSrc,
        name: 'internalCalendarName',
        color: 'lightgreen',
        entityType: Calendar.EntityTypes.EVENT,
        sourceId: defaultCalendarSrc.id,
        ownerAccount: 'personal',
        accessLevel: Calendar.CalendarAccessLevel.OWNER,
      }

      const calendarId = await Calendar.createCalendarAsync(details);

      const newCalEventID = await Calendar.createEventAsync(calendarId, {
        title: 'Con Fusion Table Reservation',
        startDate: startDate,
        endDate: endDate,
        timeZone: 'Asia/Hong_Kong',
        location: '121, Clear Water Bay Road, Clear Water Bay, Kowloon, Hong Kong',
        accessLevel: Calendar.CalendarAccessLevel.OWNER,
      });

      console.log("Calendar Event added, id: " + newCalEventID);
    }
    else {
      console.log("Not yet managed...")
    }
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
            <Button onPress={() =>
                             {
                               this.presentLocalNotification(this.state.date);
                               this.handleReservation()
                             }}
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
