import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody, CardTitle, Breadcrumb, BreadcrumbItem,
         Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import { Link } from 'react-router-dom';


class CommentForm extends Component {
  constructor(props) {
    super(props);

    // state
    this.state = {
      isModalOpen: false
    };

    this.toggleModal = this.toggleModal.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
  }

  toggleModal() {
    this.setState({
      isModalOpen: !this.state.isModalOpen
    });
  }

  render() {
    return(
      <React.Fragment>
        <div className="col-12 col-md-5 m-1">
          <Button outline onClick={this.toggleModal}><span className="fa fa-pencil fa-lg"></span>Submit Comment</Button>
        </div>

        <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>Login</ModalHeader>
          <ModalBody>

          </ModalBody>
        </Modal>
      </React.Fragment>
    );
  }
}

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
      <React.Fragment>
        <h4>Comments</h4>
        <ul className="list-unstyled">
          {comment}
        </ul>
      </React.Fragment>
    );
  }
  else
    return(<div></div>);
}

const DishDetail = (props) => {
  if (!props.dish) {
    // falsey: null, undefined, false, ...
    return(<div></div>);
  }
  else {
    return (
      <div className="container">
        <div className="row">
          <Breadcrumb>
            <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
            <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
          </Breadcrumb>

          <div className="col-12">
            <h3>{props.dish.name}</h3>
            <hr />
          </div>
        </div>

        <div className="row">
          <div className="col-12 col-md-5 m-1">
            <RenderDish dish={props.dish} />
          </div>
          <div className="col-12 col-md-5 m-1">
            <RenderComments comments={props.comments} />
            <CommentForm />
          </div>
        </div>
      </div>
    );
  }
}

export default DishDetail;
