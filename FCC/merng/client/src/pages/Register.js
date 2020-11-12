import React, { useState, useContext }  from 'react';
import { Button, Form } from 'semantic-ui-react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { AuthContext } from '../context/auth';
import { useForm } from '../utils/hooks';


function Register(props) {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  const { onChange, onSubmit, values } = useForm(addUserCB, {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(_proxy, {data: {login: userData}}) {
      // console.log(result);
      context.login(userData);
      props.history.push('/');
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values
  });

  function addUserCB() { // will be 'hoisted'
    addUser();
  }

  return(
    <div className="form-container">
      <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
        <h1>Register</h1>
        <Form.Input label="Username" placeholder="Username..." name="username" value={values.username}
          error={errors.username ? true : false} type="text" onChange={onChange} />

        <Form.Input label="Email" placeholder="Email..." name="email" value={values.email}
          error={errors.email ? true : false} type="text" onChange={onChange} />

        <Form.Input label="Password" placeholder="Password..." name="password" value={values.password}
          error={errors.password ? true : false} type="password" onChange={onChange} />

        <Form.Input label="Confirm Password" placeholder="Confirm Password..." name="confirmPassword" value={values.confirmassword}
          error={errors.confirmPassword ? true : false} type="password" onChange={onChange} />

        <Button type="submit" primary> Register </Button>
      </Form>

      { Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
           {
             Object.values(errors).map((value) => (
               <li key={value}>{value}</li>
             ))
           }
          </ul>
        </div>)
      }
    </div>
  )
}

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
   register(
     registerInput: {
       username: $username
       email: $email
       password: $password
       confirmPassword: $confirmPassword
     }
   ) {
     id username email createdAt token
   }
  }
`;

export default Register;
