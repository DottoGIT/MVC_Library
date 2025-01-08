import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import * as actions from '../actions/userActions.ts';
import { UserState } from '../reducers/userReducer.ts';
import { useNavigate } from 'react-router-dom';

type PropsFromRedux = ConnectedProps<typeof connector>;

const AccountSettings: React.FC<PropsFromRedux> = ({ deleteAccount, currentUser}) => {
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      await deleteAccount(currentUser!.id!);
      navigate("/");
    }
  };

  return (
    <div className="container mt-5">
      <h1>Settings</h1>
      <div className="mt-4">
        <button
          className="btn btn-sm btn-danger ms-2"
          onClick={handleDeleteAccount}
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

const mapStateToProps = (state: { userReducer: UserState }) => ({
  currentUser: state.userReducer.currentUser,
  token: state.userReducer.token,
});

const mapActionsToProps = {
  deleteAccount: actions.deleteUser,
};

const connector = connect(mapStateToProps, mapActionsToProps);

export default connector(AccountSettings);
