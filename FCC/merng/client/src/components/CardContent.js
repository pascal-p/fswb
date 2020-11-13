import React from 'react';
import { Card } from 'semantic-ui-react';
import moment from 'moment';

function CardContent({ post: {username, createdAt, body} }) {
  
  return (
    <Card.Content>
      <Card.Header>{username}</Card.Header>
      <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
      <Card.Description>{body}</Card.Description>
    </Card.Content>
  )
}

export default CardContent;
