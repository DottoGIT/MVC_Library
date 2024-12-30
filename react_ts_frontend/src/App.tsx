import React from 'react';
import './App.css';
import { store } from './actions/store.ts'; // Make sure the import path is correct
import { Provider } from 'react-redux';
import Navbar from './components/navBar.tsx';
import ManageBooksList from "./components/manageBooksList.tsx";

function App() {
  return (
    <Provider store={store}>
      <Navbar/>
      <ManageBooksList/>    
    </Provider>
  );
}

export default App;
