import { gql } from 'apollo-boost';

const CREATE_USER = gql`
  mutation($data: CreateUserInput!){
    createUser(data: $data){
      token,
      user{
        id
      }
    }
  }
`
const GET_USERS = gql`
  query{
    users{
      id
      name
      email
    }
  }
`

const SIGN_IN = gql`
  mutation($data: SignInUserInput!){
    signIn( data: $data){
      token
    }
  }
`

const ME = gql`
  query{
    me{
      id
      name
      email
    }
  }
`
export {
  SIGN_IN,
  GET_USERS,
  CREATE_USER,
  ME
}