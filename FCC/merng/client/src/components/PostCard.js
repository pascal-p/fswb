import React from 'react';
import { Button, Card, Icon, Label, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import moment from 'moment';

function PostCard({ post: {id, body, createdAt, username, likeCount, commentCount, likes} }) {

  function likePost() {
    console.log('Like post');
  }

  function commentOnPost() {
    console.log('Comment post');
  }

  return (
    <Card fluid>
      <Card.Content>
        <Image
          floated='right'
          size='mini'
          src='https://react.semantic-ui.com/images/avatar/large/molly.png'
        />
      <Card.Header>{username}</Card.Header>
      <Card.Meta as={Link} to={`/posts/${id}`}>{moment(createdAt).fromNow(true)}</Card.Meta>
        <Card.Description>
          {body}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button as='div' labelPosition='right' onClick={likePost}>
          <Button color='teal' basic>
            <Icon name='heart' />
            <Label basic color='teal' poiting='left'>
              {likeCount}
            </Label>
          </Button>
        </Button>

        <Button as='div' labelPosition='right' onClick={commentOnPost}>
          <Button color='blue' basic>
            <Icon name='comments' />
            <Label basic color='blue' poiting='left'>
              {commentCount}
            </Label>
          </Button>
        </Button>
      </Card.Content>
    </Card>
  );
}

export default PostCard;


// <div className='ui two buttons'>
//   <Button basic color='green'>
//     Approve
//   </Button>
//   <Button basic color='red'>
//     Decline
//   </Button>
// </div>
