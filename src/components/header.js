/** @jsx jsx */
import { Link } from "gatsby";
import { jsx } from "theme-ui";

const NavItem = props => (
  <li>
    <Link
      {...props}
      sx={{
        color: "primary",
        fontFamily: "body",
        "&:hover": {
          color: "secondary"
        }
      }}
    />
  </li>
);
export default props => (
  <header>
    <nav>
      <ul
        sx={{
          display: "flex",
          margin: 0,
          "& li": {
            marginLeft: "1rem",
            listStyleType: "none"
          }
        }}
      >
        <NavItem to="/">Home</NavItem>
        <NavItem to="/pricing">Pricing</NavItem>
        <NavItem to="/company">Company</NavItem>
        <NavItem to="/blog">Blog</NavItem>
        <NavItem to="/dev-blog">DevBlog</NavItem>
        <NavItem to="/swag">SWAG</NavItem>
      </ul>
      <ul
        sx={{
          display: "flex",
          "& li": {
            marginLeft: "1rem",
            listStyleType: "none"
          }
        }}
      >
        <li>
          <NavItem to="/app">Log in</NavItem>
        </li>
      </ul>
    </nav>
  </header>
);
