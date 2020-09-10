import React, { Component } from 'react';
import { Navbar, NavbarBrand } from 'reactstrap';
import Menu from './MenuComponent';
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

  onDishSelect(dishId) {
    this.setState({selectedDish: dishId});
  }

  render() {
    return (
      <div>
        <Navbar dark color="primary">
          <div className="container">
            <NavbarBrand href="/">Ristorante Con Fusion</NavbarBrand>
          </div>
        </Navbar>

        <Menu dishes={this.state.dishes} onClick={
          (dishId) => this.onDishSelect(dishId)
        } />

        <DishDetail dish={
          this.state.dishes.filter((dish) => dish.id === this.state.selectedDish)[0] || null
        } />
      </div>
    );
  }
}

export default Main;
