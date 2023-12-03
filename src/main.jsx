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
import WorkPage from './app/userWork/WorkPage.jsx';

Amplify.configure(awsExports);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<WorkExplorer />}></Route>
          <Route path="/yourWork" element={<UserWork />}></Route>
          <Route path="/addWork" element={<AddWork />}></Route>
          <Route path="/yourReviews" element={<UserReviews />}></Route>
          <Route path="/settings" element={<Settings />}></Route>
          <Route path="/work/:workId" element={<WorkPage />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
