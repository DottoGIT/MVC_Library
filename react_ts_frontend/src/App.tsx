import React from 'react';
import './App.css';
import { store } from './actions/store.ts';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components
import Home from "./components/home.tsx";
import Navbar from './components/navBar.tsx';
import ManageBooksList from "./components/manageBooksList.tsx";
import ManageLeasesList from './components/manageLeasesList.tsx';
import UsersList from "./components/usersList.tsx"
import AccountSettings from './components/accountSettings.tsx';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/manageBooks" element={<ManageBooksList />} />
          <Route path="/manageLeases" element={<ManageLeasesList />} />
          <Route path="/listUsers" element={<UsersList />} />
          <Route path="/accountSettings" element={<AccountSettings />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
