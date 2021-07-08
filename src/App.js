import React, { Component } from "react";
import { Router, Route, Switch } from "react-router-dom";
import "./scss/style.scss";
import history from "../src/history";

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

const TheLayout = React.lazy(() => import("./containers/TheLayout"));

const Login = React.lazy(() => import("./views/pages/login/Login"));
const Resetpassword = React.lazy(() =>
  import("./views/pages/resetPassword/resetPassword")
);
const Forgetpassword = React.lazy(() =>
  import("./views/pages/forgetPassword/forgetPassword")
);
const OtpVerify = React.lazy(() => import("./views/pages/otpVerify"));

class App extends Component {
  render() {
    return (
      <Router history={history}>
        <React.Suspense fallback={loading}>
          <Switch>
            <Route
              exact
              path="/login"
              name="Login Page"
              render={(props) => <Login {...props} />}
            />
            <Route
              exact
              path="/resetPassword/:token"
              name="Reset Pass"
              render={(props) => <Resetpassword {...props} />}
            />
            <Route
              exact
              path="/forgetpassword"
              name="Forget Pass"
              render={(props) => <Forgetpassword {...props} />}
            />
            <Route
              path="/"
              name="Home"
              render={(props) => <TheLayout {...props} />}
            />
          </Switch>
        </React.Suspense>
      </Router>
    );
  }
}

export default App;
