import React, { Component } from "react";
import { HashRouter as Router, NavLink } from "react-router-dom";
import Rating from "./rating";
import * as api from "../api";

class ReviewForm extends Component {
  constructor() {
    super();

    this.state = {
      comment: "",
      ratePrice: "",
      rateQuality: "",
      errorOccured: false,
      errorMessage: "",
      response: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  logout = e => {
    e.preventDefault();
    localStorage.setItem('JWT', null);
    window.location.href = "#/sign-in"
  };

  handleChange(e) {
    let target = e.target;
    let value = target.value;
    let name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    api
      .submitReview(this.state, this.props.match.params.steakhouse)
      .then(response => {
        if (response.error) {
          this.setState(() => {
            return {
              errorOccured: true,
              errorMessage: response.error
            };
          });
        } else {
          if (response.message === "review saved") {
            window.location.href =
              "#/steakhouses/info/" + this.props.match.params.steakhouse;
          } else {
            this.setState(() => {
              return {
                response: response.message
              };
            });
          }
        }
      });
  }

  render() {
    if (this.state.errorOccured === true) {
      throw this.state.errorMessage;
    }
    return (
      <Router path="/steakhouses/review">
        <div className="App__Form">
          <div className="LogoutHolder">
            <NavLink
              exact
              to="/steakhouses/info"
              activeClassName="PageSwitcher__Item--Active"
              className="PageSwitcher__Item-logout"
            >
              Go Back
            </NavLink>
            <span class="seperator" />
            <NavLink
              onClick={this.logout}
              to="#"
              activeClassName="PageSwitcher__Item--Active"
              className="PageSwitcher__Item-logout"
            >
              Logout
            </NavLink>
          </div>
          <br />
          <div className="FormTitle">
            <NavLink
              to={"/steakhouses/info/" + this.props.match.params.steakhouse}
              activeClassName="FormTitle__Link--Active"
              className="FormTitle__Link"
            >
              Find Steak
            </NavLink>{" "}
            or{" "}
            <NavLink
              to={"/steakhouses/review/" + this.props.match.params.steakhouse}
              activeClassName="FormTitle__Link--Active"
              className="FormTitle__Link"
            >
              Write A Review
            </NavLink>
          </div>

          <div className="FormCenter">
          <p className="signUpError">{this.state.response}</p>
            <div id="writeReview">Write a review</div>
            <form onSubmit={this.handleSubmit} className="FormFields">
              <div className="FormField">
                <textarea
                  rows={10}
                  cols={50}
                  defaultValue={""}
                  id="comment"
                  className="FormReview"
                  placeholder="How was your experience?"
                  name="comment"
                  onChange={this.handleChange}
                />
              </div>
              <p>
                <Rating
                  ratePrice={this.state.ratePrice}
                  rateQuality={this.state.rateQuality}
                  handleChange={this.handleChange}
                />
                <br />
              </p>

              <div className="FormField">
                <button className="FormField__Button mr-20">Post</button>
              </div>
            </form>
          </div>
        </div>
      </Router>
    );
  }
}

export default ReviewForm;
