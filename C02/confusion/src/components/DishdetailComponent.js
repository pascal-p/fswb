import React from 'react';
import { Card, CardImg, CardText, CardBody, CardTitle } from 'reactstrap';

function RenderDish({dish}) {
  // dish always defined
  return(
    <Card>
      <CardImg top src={dish.image} alt={dish.name} />
      <CardBody>
        <CardTitle>{dish.name}</CardTitle>
        <CardText>{dish.description}</CardText>
      </CardBody>
    </Card>
  );
}

function RenderComments({comments}) {
  if (comments != null) {
    const dateOpts = {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    };

    const comment = comments.map((objCom) => {
      const comDate = (new Date(Date.parse(objCom.date))).toLocaleDateString("en-US", dateOpts);
      return(
        <li key={objCom.id}>
          <p>{objCom.comment}</p>
          <p>-- <span>{objCom.author}</span>, <span>{comDate}</span></p>
        </li>
      );
    });

    return (
      <ul className="list-unstyled">
        {comment}
      </ul>
    );
  }
  else
    return(<div></div>);
}

const DishDetail = (props) => {
  if (!props.dish) {
    // falsey: null, undefined, false, ...
    console.log('>> DishDetail Render Invoked with no selected dish');

    return(<div></div>);
  }
  else {
    console.log('>> DishDetail Render Invoked with a selected dish: ' + props.dish.name);

    return (
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-5 m-1">
            <RenderDish dish={props.dish} />
          </div>

          <div className="col-12 col-md-5 m-1">
            <h4>Comments</h4>
            <RenderComments comments={props.dish.comments} />
          </div>
        </div>
      </div>
    );
  }
}

export default DishDetail;
