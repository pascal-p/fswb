import React, { useState, useContext } from 'react';
import { Button, Form } from 'semantic-ui-react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { AuthContext } from '../context/auth';
import { useForm } from '../utils/hooks';


function Login(props) {
  const context = useContext(AuthContext);  // now we have access to the context which is a {user, login and logout}
  const [errors, setErrors] = useState({});

  const { onChange, onSubmit, values } = useForm(loginUserCB, {
    username: '',
    password: '',
  });

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_proxy, {data: {login: userData}}) {
      context.login(userData);
      props.history.push('/');
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values
  });

  function loginUserCB() { // will be 'hoisted'
    loginUser();
  }

  return(
    <div className="form-container">
      <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
        <h1>Login</h1>
        <Form.Input label="Username" placeholder="Username..." name="username" value={values.username}
          error={errors.username ? true : false} type="text" onChange={onChange} />

        <Form.Input label="Password" placeholder="Password..." name="password" value={values.password}
          error={errors.password ? true : false} type="password" onChange={onChange} />

        <Button type="submit" primary> Login </Button>
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

const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      username
      email
      createdAt
      token
   }
  }
`;

export default Login;
