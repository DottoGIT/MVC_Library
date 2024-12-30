import React, { useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import * as actions from '../actions/userActions.ts'; // Assuming your actions are in this file
import { User } from '../interfaces/user.ts';
import { UserState } from '../reducers/userReducer.ts';

type PropsFromRedux = ConnectedProps<typeof connector>;

const Navbar: React.FC<PropsFromRedux> = ({ currentUser, token, login, signup, logout }) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isSignupForm, setIsSignupForm] = useState<boolean>(true);
  const [user, setUser] = useState<User>({
    username: '',
    password: '',
    email: '',
    firstName: '',
    lastName: ''
  });

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleModalClose = () => {
    setShowModal(false);
    setIsSignupForm(true);
  };

  const handleLoginClick = () => {
    login({ username: user.username, password: user.password });
    handleModalClose();
  };

  const handleSignupClick = () => {
    signup({
      username: user.username,
      password: user.password,
      email: user.email!,
      firstName: user.firstName!,
      lastName: user.lastName!,
      confirmPassword: user.password,
    });
    handleModalClose();
  };

  const handleLogoutClick = () => {
    logout();
  };

  const isAuthenticated = currentUser !== null && token !== null;

  return (
    <header className="p-3 text-bg-dark">
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
          <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
            <li>
              <a href="/" className="nav-link px-2 fw-bold text-white">
                Home
              </a>
            </li>
            <li>
              <a href="/reservations" className="nav-link px-2 text-white">
                Reservations
              </a>
            </li>
            <li>
              <a href="/account" className="nav-link px-2 text-white">
                Account
              </a>
            </li>
          </ul>

          <div className="d-flex justify-content-end align-items-center">
            {isAuthenticated ? (
              <div className="d-flex align-items-center">
                <span className="text-white me-3">
                  {currentUser?.firstName} {currentUser?.lastName}
                </span>
                <button className="btn btn-outline-light me-2" onClick={handleLogoutClick}>
                  Logout
                </button>
              </div>
            ) : (
              <div className="text-end">
                <button
                  className="btn btn-outline-light me-2"
                  onClick={() => {
                    setShowModal(true);
                    setIsSignupForm(false);
                  }}
                >
                  Login
                </button>
                <button
                  className="btn btn-warning"
                  onClick={() => {
                    setShowModal(true);
                    setIsSignupForm(true);
                  }}
                >
                  Sign-up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{isSignupForm ? 'Sign-up' : 'Login'}</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={handleModalClose}
                ></button>
              </div>
              <div className="modal-body">
                {isSignupForm ? (
                  <div>
                    <h5>Sign-up</h5>
                    <form onSubmit={(e) => e.preventDefault()}>
                      <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={user.username}
                        onChange={handleUserChange}
                        className="form-control mb-2"
                      />
                      <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={user.email}
                        onChange={handleUserChange}
                        className="form-control mb-2"
                      />
                      <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={user.firstName}
                        onChange={handleUserChange}
                        className="form-control mb-2"
                      />
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={user.lastName}
                        onChange={handleUserChange}
                        className="form-control mb-2"
                      />
                      <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={user.password}
                        onChange={handleUserChange}
                        className="form-control mb-2"
                      />
                      <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={user.password}
                        onChange={handleUserChange}
                        className="form-control mb-2"
                      />
                      <button type="button" onClick={handleSignupClick} className="btn btn-primary">
                        Sign Up
                      </button>
                    </form>
                  </div>
                ) : (
                  <div>
                    <h5>Login</h5>
                    <form onSubmit={(e) => e.preventDefault()}>
                      <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={user.username}
                        onChange={handleUserChange}
                        className="form-control mb-2"
                      />
                      <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={user.password}
                        onChange={handleUserChange}
                        className="form-control mb-2"
                      />
                      <button type="button" onClick={handleLoginClick} className="btn btn-primary">
                        Login
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

const mapStateToProps = (state: { userReducer: UserState }) => ({
  currentUser: state.userReducer.currentUser,
  token: state.userReducer.token,
});

const mapActionsToProps = {
  login: actions.login,
  signup: actions.signup,
  logout: actions.logout,
};

const connector = connect(mapStateToProps, mapActionsToProps);

export default connector(Navbar);
