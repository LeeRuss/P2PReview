import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports.js';
import '@aws-amplify/ui-react/styles.css';
import App from './App.jsx';
import Settings from './app/settings/Settings.jsx';
import WorkExplorer from './app/workExplorer/WorkExplorer.jsx';
import UserWork from './app/userWork/UserWork.jsx';
import UserReviews from './app/userReviews/UserReviews.jsx';
import AddWork from './app/userWork/AddWork.jsx';

Amplify.configure(awsExports);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<WorkExplorer />}></Route>
          <Route index path="/yourWork" element={<UserWork />}></Route>
          <Route index path="/addWork" element={<AddWork />}></Route>
          <Route index path="/yourReviews" element={<UserReviews />}></Route>
          <Route index path="/settings" element={<Settings />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
