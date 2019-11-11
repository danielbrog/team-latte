import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  AppBar,
  Typography,
  makeStyles,
  Avatar,
  CssBaseline,
  Button
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import Launch from "../themes/ic-logo.png";
import MenuIcon from "@material-ui/icons/Menu";

const NavBarStyles = makeStyles(theme => ({
  companyLogo: {
    // logo is
    height: 30,
    width: 30,
    borderRadius: "0"
  },

  separation: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },

  rightButtons: {
    [theme.breakpoints.down("sm")]: {
      display: "none"
    },
    [theme.breakpoints.up("md")]: {
      display: "block"
    }
  },

  rightNav: {
    [theme.breakpoints.down("sm")]: {
      display: "block"
    },
    [theme.breakpoints.up("md")]: {
      display: "none"
    }
  },
  button: {
    margin: theme.spacing(0, 2, 0, 2),
    fontSize: 14,
    color: "black"
  },
  navList: {
    width: 150
  }
}));

function NavBar() {
  const [sandwhich, setSandwhich] = useState(false);
  const classes = NavBarStyles();

  const toggleDrawer = open => event => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setSandwhich(open);
  };

  const navList = (
    <div className={classes.navList}>
      <List>
        <ListItem
          button
          component={NavLink}
          onClick={toggleDrawer(false)}
          to="/explore"
        >
          Explore
        </ListItem>
        <ListItem
          button
          component={NavLink}
          onClick={toggleDrawer(false)}
          to="/launch"
        >
          Launch
        </ListItem>
        {window.sessionStorage.getItem("user") ? (
          <ListItem
            button
            component={NavLink}
            onClick={toggleDrawer(false)}
            to={
              "/profile/" +
              JSON.parse(window.sessionStorage.getItem("user"))._id
            }
          >
            Profile
          </ListItem>
        ) : (
          <ListItem
            onClick={toggleDrawer(false)}
            button
            component={NavLink}
            to="/login"
          >
            Login
          </ListItem>
        )}
      </List>
    </div>
  );
  const navButtons = (
    <div>
      <Button className={classes.button}>
        <NavLink
          onClick={toggleDrawer(false)}
          to="/explore"
          activeStyle={{
            color: "black"
          }}
          style={{
            textDecoration: "none"
          }}
        >
          EXPLORE
        </NavLink>
      </Button>
      <Button className={classes.button}>
        <NavLink
          onClick={toggleDrawer(false)}
          to="/launch"
          activeStyle={{
            color: "black"
          }}
          style={{
            textDecoration: "none"
          }}
        >
          LAUNCH
        </NavLink>
      </Button>
      <Button className={classes.button}>
        {window.sessionStorage.getItem("user") ? (
          <NavLink
            onClick={toggleDrawer(false)}
            to={
              "/profile/" +
              JSON.parse(window.sessionStorage.getItem("user"))._id
            }
            activeStyle={{
              color: "black"
            }}
            style={{
              textDecoration: "none"
            }}
          >
            PROFILE
          </NavLink>
        ) : (
          <NavLink
            onClick={toggleDrawer(false)}
            to="/login"
            activeStyle={{
              color: "black"
            }}
            style={{
              textDecoration: "none"
            }}
          >
            LOGIN
          </NavLink>
        )}
      </Button>
    </div>
  );

  return (
    <React.Fragment>
      <CssBaseline />

      <AppBar position="sticky">
        <div className={classes.separation}>
          <Avatar
            className={classes.companyLogo}
            alt="Company Logo"
            src={Launch}
          />
          <Typography variant="h6" style={{ marginLeft: "10px" }}>
            Product Launch
          </Typography>
        </div>
        <div>
          <div className={classes.rightButtons}>{navButtons}</div>
          <div className={classes.rightNav}>
            <IconButton onClick={toggleDrawer(true)} aria-label="Menu">
              <MenuIcon />
            </IconButton>
            <SwipeableDrawer
              anchor="right"
              open={sandwhich}
              onClose={toggleDrawer(false)}
              onOpen={toggleDrawer(true)}
            >
              {navList}
            </SwipeableDrawer>
          </div>
        </div>
      </AppBar>
    </React.Fragment>
  );
}

export default NavBar;
