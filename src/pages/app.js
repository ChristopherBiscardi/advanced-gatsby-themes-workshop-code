import React from 'react'
import { Router, Link } from "@reach/router"

const Home = () => <div>
    <h1>Home</h1>
  <Link to="/app/dashboard/">to Dashboard</Link>
  </div>
const Dash = () => <div>    <h1>Dash</h1>
  <Link to="/app/">to Home</Link></div>

export default props => <div>
    <h1>inside the app</h1>
      <Router basepath="/app">
    <Home path="/" />
    <Dash path="dashboard" />
  </Router>
</div>