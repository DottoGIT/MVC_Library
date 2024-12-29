import React from 'react';
import './App.css';
import { store } from './actions/store.ts'; // Make sure the import path is correct
import { Provider } from 'react-redux';
import ManageBooksList from "./components/manageBooksList.tsx"

function App() {
  return (
    <Provider store={store}>
      <ManageBooksList/>    
    </Provider>
  );
}

export default App;
