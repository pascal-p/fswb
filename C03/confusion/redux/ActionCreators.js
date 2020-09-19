import * as ActionTypes from './ActionTypes';
import { baseUrl } from '../shared/baseUrl';


const errFn = (resp) => {
  let err = new Error('Error ' + resp.status + ': ' + resp.statusText);
  err.response = resp;
  throw err;
}

//
// comments
//
export const fetchComments = () => (dispatch) => {
  return fetch(baseUrl + 'comments')
    .then(response => {
      if (response.ok) {
        return response;
      }
      else {
        return errFn(response);
      }
    }, error => {
      throw new Error(error.message);
    })
    .then(response => response.json())
    .then(comments => dispatch(addComments(comments)))
    .catch(error => dispatch(commentsFailed(error.message)));
};

export const commentsFailed = (errmess) => ({
  type: ActionTypes.COMMENTS_FAILED,
  payload: errmess
});

export const addComments = (comments) => ({
  type: ActionTypes.ADD_COMMENTS,
  payload: comments
});

export const postComment = (dishId, rating, author, comment) => (dispatch) => {
  const newComment = {
    dishId: dishId,
    rating: rating,
    author: author,
    comment: comment,
    date: new Date().toISOString()
  };

  // simulate for now...
  setTimeout(() => {
    dispatch(addComment(newComment));
  }, 2000);

  /*
  return fetch(baseUrl + 'comments', {
      method: "POST",
      body: JSON.stringify(newComment),
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "same-origin"
    })
    .then(response => {
      if (response.ok) { return response; }
      else { return errFn(response);}
    }, error => {
      throw new Error(error.message);
    })
    .then(response => response.json())
    .then(response => dispatch(addComment(response)))
    .catch(error =>  {
      console.log('post comments', error.message);
      alert('Your comment could not be posted\nError: ' + error.message);
    });
  */
};

export const addComment = (comment) => ({
  type: ActionTypes.ADD_COMMENT,
  payload: comment
});


//
// dishes
//
export const fetchDishes = () => (dispatch) => {
  dispatch(dishesLoading());

  return fetch(baseUrl + 'dishes')
    .then(response => {
      if (response.ok) {
        return response;
      }
      else {
        return errFn(response);
      }
    }, error => {
      throw new Error(error.message);
    })
    .then(response => response.json())
    .then(dishes => dispatch(addDishes(dishes)))
    .catch(error => dispatch(dishesFailed(error.message)));
};

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

//
// promotions
//
export const fetchPromos = () => (dispatch) => {
  dispatch(promosLoading());

  return fetch(baseUrl + 'promotions')
    .then(response => {
      if (response.ok) {
        return response;
      }
      else {
        return errFn(response);
      }
    }, error => {
      throw new Error(error.message);
    })
    .then(response => response.json())
    .then(promos => dispatch(addPromos(promos)))
    .catch(error => dispatch(promosFailed(error.message)));
};

export const promosLoading = () => ({
  type: ActionTypes.PROMOS_LOADING
});

export const promosFailed = (errmess) => ({
  type: ActionTypes.PROMOS_FAILED,
  payload: errmess
});

export const addPromos = (promos) => ({
  type: ActionTypes.ADD_PROMOS,
  payload: promos
});


//
// leaders
//
export const fetchLeaders = () => (dispatch) => {
  dispatch(leadersLoading());

  return fetch(baseUrl + 'leaders')
    .then(response => {
      if (response.ok) {
        return response;
      }
      else {
        return errFn(response);
      }
    }, error => {
      throw new Error(error.message);
    })
    .then(response => response.json())
    .then(leaders => dispatch(addLeaders(leaders)))
    .catch(error => dispatch(leadersFailed(error.message)));
};

export const leadersLoading = () => ({
  type: ActionTypes.LEADERS_LOADING
});

export const leadersFailed = (errmess) => ({
  type: ActionTypes.LEADERS_FAILED,
  payload: errmess
});

export const addLeaders = (leaders) => ({
  type: ActionTypes.ADD_LEADERS,
  payload: leaders
});

//
// favorites
//
export const postFavorite = (dishId)  => (dispatch) => {
  // NOTE: simulate for now...

  setTimeout(() => {
    dispatch(addFavorite(dishId));
  }, 2000);
};

export const addFavorite = (dishId) => ({
  type: ActionTypes.ADD_FAVORITE,
  payload: dishId
});
