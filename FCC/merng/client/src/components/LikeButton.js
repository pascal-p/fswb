import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Button, Icon, Label } from 'semantic-ui-react';


function LikeButton({user, post: { id, likes, likeCount }}) {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    setLiked(user && likes && likes.find(like => like.username === user.username));
  }, [user, likes]);

  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId: id }
  });

  const likeBtn = user ? (
    liked ? (
      <Button color='teal'>
        <Icon name='heart' />
      </Button>
    ) : (
      <Button color='teal' basic>
        <Icon name='heart' />
      </Button>
    )
  ) : (
    <Button as={Link} to="/login" color='teal' basic>
      <Icon name='heart' />
    </Button>
  );

  return (
    <Button as='div' labelPosition='right' onClick={likePost}>
      {likeBtn}

      <Label basic color='teal' pointing='left'>
        {likeCount}
      </Label>
    </Button>
  )
}

const LIKE_POST_MUTATION = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes {
        id username
      }
      likeCount
    }
  }
`;

export default LikeButton;
