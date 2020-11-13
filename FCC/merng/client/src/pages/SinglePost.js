import React, { useContext, useState, useRef } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Button, Form, Grid, Card, Icon, Image, Label } from 'semantic-ui-react';

import { AuthContext } from '../context/auth';
import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton';
import CardContent from '../components/CardContent';


function SinglePost(props) {
  const postId = props.match.params.postId;

  const { user } = useContext(AuthContext);
  const commentInputRef = useRef(null);
  const [comment, setComment] = useState('');

  const { data = {} } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId
    }
  })

  const getPost = (Object.keys(data).length !== 0) ? data.getPost : "";
  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    update() {
      setComment('');
      commentInputRef.current.blur();
    },
    variable: {
      postId,
      body: comment
    }
  });

  const deletePostCB = () => props.history.push('/');

  let postMarkup;

  if (!getPost) {
    postMarkup = <p>Loading post...</p>
  }
  else {
    const {id, body, createdAt, username, comments, likes, likeCount, commentCount } = getPost;

    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image src="https://react.semantic-ui.com/images/avatar/large/molly.png" size="small" float="right" />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <CardContent post={{ username, createdAt, body }} />
              <hr />

              <Card.Content extra>
                <LikeButton user={user} post={{id, likeCount, likes}} />
                <Button as="div" labelPosition="right" onClick={() => console.log('Comment on post')}>
                  <Button basic color="blue">
                    <Icon name="comments" />
                  </Button>
                  <Label basic color="blue" pointing="left">
                    {commentCount}
                  </Label>
                </Button>
                {user && user.username === username && <DeleteButton postId={id} callback={deletePostCB} />}
              </Card.Content>
            </Card>
            { user && (
              <Card fluid>
                <Card.Content>
                  <p>Post a comment</p>
                  <Form>
                    <div className="ui action input fluid">
                      <input type="text" placeholder="Comment..." name="comment" value={comment}
                        onChange={(evt) => setComment(evt.target.value)} ref={commentInputRef} />
                      <button type="submit" className="ui button teal" disabled={comment.trim() === ''} onClick={submitComment}>
                        Submit
                      </button>
                    </div>
                  </Form>
                </Card.Content>
              </Card>
            )}
            { comments && comments.map((comment) => (
              <Card fluid key={comment.id}>
                { user && user.username === comment.username && (
                    <DeleteButton postId={id} commentId={comment.id} />
                )}
                <CardContent post={comment} />
              </Card>
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }

  return postMarkup;
}

const SUBMIT_COMMENT_MUTATION = gql`
  mutation createComment($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id body username createdAt
      }
      commentCount
    }
  }
`;

const FETCH_POST_QUERY = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
      id body createdAt username likeCount
      likes {
        username
      }
      commentCount
      comments {
        id username createdAt body
      }
    }
  }
`;

export default SinglePost;
