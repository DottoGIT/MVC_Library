import React, { useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import * as actions from '../actions/userActions.ts'; // Assuming your actions are in this file
import { User } from '../interfaces/user.ts';
import { UserState } from '../reducers/userReducer.ts';
import { Link, useNavigate} from 'react-router-dom';

type PropsFromRedux = ConnectedProps<typeof connector>;

const Navbar: React.FC<PropsFromRedux> = ({ currentUser, token, login, signup, logout }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isSignupForm, setIsSignupForm] = useState<boolean>(true);
  const [user, setUser] = useState<User>({
    userName: '',
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
    login({ userName: user.userName, password: user.password });
    handleModalClose();
  };

  const handleSignupClick = () => {
    signup({
      userName: user.userName,
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
    navigate("/");
  };

  const isAuthenticated = currentUser !== null && token !== null;

  return (
<header className="p-3 text-bg-dark">
  <div className="container">
    <div className="d-flex flex-wrap align-items-center justify-content-between">
      
      <nav>
          {!currentUser && (
            <ul className="nav col-12 col-lg-auto mb-2 justify-content-center mb-md-0">
              <Link to="/" className="nav-link px-2 fw-bold text-white">
                Home
              </Link>
            </ul>
          )}
          {currentUser?.role === 1 && (
            <ul className="nav col-12 col-lg-auto mb-2 justify-content-center mb-md-0">
              <Link to="/" className="nav-link px-2 fw-bold text-white">
                Home
              </Link>
              <Link to="/manageLeases" className="nav-link px-2 fw-bold text-white">
                Reservations
              </Link>
              <Link to="/accountSettings" className="nav-link px-2 fw-bold text-white">
                Account
              </Link>
            </ul>
          )}
          {currentUser?.role === 0 && (
            <ul className="nav col-12 col-lg-auto mb-2 justify-content-center mb-md-0">
              <Link to="/" className="nav-link px-2 fw-bold text-white">
                Home
              </Link>
              <Link to="/manageBooks" className="nav-link px-2 fw-bold text-white">
                Books
              </Link>
              <Link to="/manageLeases" className="nav-link px-2 fw-bold text-white">
                Leases
              </Link>
              <Link to="/listUsers" className="nav-link px-2 fw-bold text-white">
                Users
              </Link>
            </ul>
          )}
      </nav>

      <div className="d-flex align-items-center">
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
                        name="userName"
                        placeholder="Username"
                        value={user.userName}
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
                        name="userName"
                        placeholder="Username"
                        value={user.userName}
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
