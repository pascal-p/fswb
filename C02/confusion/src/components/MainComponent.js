import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Home from './HomeComponent';
import Menu from './MenuComponent';
import Header from './HeaderComponent'
import Footer from './FooterComponent'
// import DishDetail from './DishdetailComponent';
import { DISHES } from '../shared/dishes';


class Main extends Component {
  constructor(props) {
    super(props);

    // state
    this.state = {
      dishes: DISHES,     // array of dishes
      selectedDish: null  // only tracking the dishId, not the whole dish object
    };
  }

  componentDidMount() {
    console.log('>>> [componentDidMount] Main Component Mounted');
  }

  render() {
    console.log('>> Main Render Invoked');

    const HomePage = () => {
      return(
        <Home/>
      );
    }

    return(
      <div>
        <Header />
        <Switch>
          <Route path='/home' component={HomePage} />
          <Route exact path='/menu' component={() => <Menu dishes={this.state.dishes} />} />
          <Redirect to="/home" />
        </Switch>
        <Footer />
      </div>
    );
  }
}

export default Main;
