import './App.css';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { UserContext } from './app/contexts/UserContext';
import Header from './app/header/Header';
import { Outlet } from 'react-router-dom';

function App({ signOut, user }) {
  console.log(user);

  return (
    <UserContext.Provider value={{ signOut: signOut, user: user }}>
      <Header />
      <Outlet />
    </UserContext.Provider>
  );
}

const formFields = {
  signUp: {
    email: {
      order: 1,
      isRequired: true,
    },
    family_name: {
      order: 2,
      isRequired: true,
    },
    given_name: {
      order: 3,
      isRequired: true,
    },
    birthdate: {
      order: 4,
      isRequired: true,
    },
    password: {
      order: 5,
      isRequired: true,
    },
    confirm_password: {
      order: 6,
      isRequired: true,
    },
  },
};

export default withAuthenticator(App, { formFields: formFields });
