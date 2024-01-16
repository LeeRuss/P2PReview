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
    },
    family_name: {
      order: 2,
    },
    given_name: {
      order: 3,
    },
    birthdate: {
      order: 4,
    },
    password: {
      order: 5,
    },
    confirm_password: {
      order: 6,
    },
  },
};

export default withAuthenticator(App, { formFields: formFields });
