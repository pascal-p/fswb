import * as ActionTypes from './ActionTypes';
import { DISHES } from '../shared/dishes';


// action types:
export const dishesLoading = () => ({
  type: ActionTypes.DISHES_LOADING
});

export const dishesFailed = (errmess) => ({
  type: ActionTypes.DISHES_FAILED,
  payload: errmess
});

export const addDishes = (dishes) => ({
  type: ActionTypes.ADD_DISHES,
  payload: dishes
});

// a thunk:
export const fetchDishes = () => (dispatch) => {
  dispatch(dishesLoading(true));

  setTimeout(() => {
    dispatch(addDishes(DISHES));
  }, 1000); // 1s is enough
}

export const addComment = (dishId, rating, author, comment) => ({
  type: ActionTypes.ADD_COMMENT,
  payload: {
    dishId: dishId,
    rating: rating,
    author: author,
    comment: comment
  }
});
