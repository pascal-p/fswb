import { COMMENTS } from '../shared/comments';
import * as ActionTypes from './ActionTypes';

export const Comments = (state = COMMENTS, action) => {
  switch (action.type) {
    case ActionTypes.ADD_COMMENT:
      let comment = action.payload;
      comment.id = state.length;               // starts at index 0, easy way to gen. and id
      comment.date = new Date().toISOString();
      console.log("Comment: ", comment);
      return state.concat(comment);

    default:
      return state;
  }
};
