import React, { Component } from 'react';
import Menu from './MenuComponent';
import Header from './HeaderComponent'
import Footer from './FooterComponent'
import DishDetail from './DishdetailComponent';
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

  onDishSelect(dishId) {
    this.setState({selectedDish: dishId});
  }

  render() {
    console.log('>> Main Render Invoked');

    return (
      <div>
        <Header />
        <Menu dishes={this.state.dishes} onClick={
          (dishId) => this.onDishSelect(dishId)
        } />

        <DishDetail dish={
          this.state.dishes.filter((dish) => dish.id === this.state.selectedDish)[0] || null
        } />
        <Footer />
      </div>
    );
  }
}

export default Main;
