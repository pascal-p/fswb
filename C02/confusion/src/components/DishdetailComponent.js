import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody, CardTitle } from 'reactstrap';


class DishDetail extends Component {
  //stateless

  renderDish(dish) {
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

  renderComments(comments) {
    if (comments != null) {
      const dateOpts = {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
      };

      const comment = comments.map((objCom) => {
        const comDate = new Date(Date.parse(objCom.date));

        return(
          <li key={objCom.id}>
            <p>{objCom.comment}</p>
            <p>-- <span>{objCom.author}</span>, <span>{comDate.toLocaleDateString("en-US", dateOpts)}</span></p>
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
      return(
        <div></div>
      );
  }

  render() {
    if (!this.props.dish) {
      // falsey: null, undefined, false, ...
      return(
        <div></div>
      );
    }
    else {
      return (
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-5 m-1">
              {this.renderDish(this.props.dish)}
            </div>

            <div className="col-12 col-md-5 m-1">
              <h4>Comments</h4>
              {this.renderComments(this.props.dish.comments)}
            </div>
          </div>
        </div>
      );
    }
  }
}

export default DishDetail;
