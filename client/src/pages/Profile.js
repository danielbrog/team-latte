import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Typography,
  Avatar,
  Button,
  IconButton
} from "@material-ui/core";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Fields from "./Fields";
import ProjectList from "./Project";
import EditDialog from "./ProfileInfoEdit";
import MessageDialog from "./Message";
import classNames from "classnames";

import LocationOnIcon from "@material-ui/icons/LocationOn";
import angellist from "../assets/angellist.png";
import linkedin from "../assets/linkedin.png";
import "./Profile.css";
import authFetch from "../utilities/auth";

const useStyles = makeStyles(createTheme => ({
  avatar: {
    margin: 10
  },
  bigAvatar: {
    margin: 10,
    width: 150,
    height: 150
  },
  smallAvatar: {
    margin: 10,
    width: 30,
    height: 30
  },
  projectTitle: {
    padding: 20
  },
  projectGridList: {
    padding: 20
  },
  leftSection: {
    paddingTop: createTheme.spacing(10),
    borderRight: "10px solid",
    borderImage: "linear-gradient(to right, #CCCCCC, rgba(0, 0, 0, 0)) 1 100%;"
  },
  rightSection: {
    paddingLeft: createTheme.spacing(5),
    paddingTop: createTheme.spacing(5)
  }
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {children}
    </Typography>
  );
}

export default function ProfilePage(props) {
  const [profile, setProfile] = useState(null); //Reason why it renders empty for profile for a short time
  const [projects, setProjects] = useState(null);
  const [investedProjects, setInvestedProjects] = useState([]);
  const [value, setValue] = React.useState(0);

  useEffect(() => {
    authFetch({ url: `/apiprofile/${props.match.params.id}` }).then(res => {
      if (res.error) {
        clearing();
      } else {
        setProfile(res.profile);
        setProjects(res.projects);
      }
    }, []);
    authFetch({ url: `/userInvestments/${props.match.params.id}` }).then(
      res => {
        if (res.error) {
          clearing();
        } else {
          setInvestedProjects(res.projects);
        }
      }
    );
  }, [props.match.params.id]);

  //console.log(profile)
  const classes = useStyles();

  const clearing = () => {
    window.sessionStorage.clear();
    window.location.replace("/login");
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return !profile ? (
    <div></div>
  ) : (
    <React.Fragment>
      <Grid container justify="center">
        {/* Left part */}
        <Grid
          item
          xs={3}
          className={classNames(classes.leftSection)}
          style={{ minHeight: "200px" }}
        >
          <Grid container direction="column" spacing={3}>
            <Grid container justify="center" alignItems="center">
              <Avatar
                alt={!profile ? "" : profile.name}
                src={
                  !profile || !profile.profilePic ? "" : profile.profilePic.link
                }
                className={classes.bigAvatar}
              />
            </Grid>

            <Grid
              container
              justify="center"
              alignItems="center"
              className="full-name"
            >
              <Typography variant="h4" gutterBottom>
                {!profile ? "" : profile.name}
              </Typography>
            </Grid>

            <Grid
              container
              justify="center"
              alignItems="center"
              className={classes.location}
            >
              <Typography variant="body2" color="textSecondary" gutterBottom>
                <LocationOnIcon />
                {!profile ? "" : profile.location}
              </Typography>
            </Grid>

            {window.sessionStorage.getItem("AuthToken") &&
            JSON.parse(window.sessionStorage.getItem("user"))._id ===
              props.match.params.id ? (
              //&& window.sessionStorage.getItem('user')._id === props.match.params.id
              //JSON.parse(window.sesssionStorage.getItem('user))._id

              <Grid container justify="center">
                <EditDialog profile={profile} setProfile={setProfile} />
              </Grid>
            ) : (
              <Grid container justify="center">
                <Button variant="outlined">Add Friend</Button>
              </Grid>
            )}

            <Grid container justify="center" alignItems="center">
              <MessageDialog />
            </Grid>

            <Grid container justify="center" alignItems="center">
              <Fields fieldsData={!profile ? [] : profile.expertise} />
            </Grid>

            <Grid container justify="center">
              <IconButton size="small">
                <Avatar src={angellist} />
              </IconButton>
              <IconButton size="small">
                <Avatar src={linkedin} />
              </IconButton>
            </Grid>

            {window.sessionStorage.getItem("AuthToken") &&
            JSON.parse(window.sessionStorage.getItem("user"))._id ===
              props.match.params.id ? (
              <Grid container justify="center">
                <Button onClick={clearing} variant="outlined">
                  Logout
                </Button>
              </Grid>
            ) : (
              <div></div>
            )}
          </Grid>
        </Grid>

        {/* Right part*/}
        <Grid item xs={8} className={classNames(classes.rightSection)}>
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            aria-label="full width tabs example"
          >
            <Tab label="Projects" />
            <Tab label="Investments" />
          </Tabs>
          <TabPanel value={value} index={0}>
            <Typography
              variant="h3"
              gutterBottom
              className={classes.projectTitle}
            >
              Projects
            </Typography>
            <ProjectList projectData={projects} />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Typography
              variant="h3"
              gutterBottom
              className={classes.projectTitle}
            >
              Investments
            </Typography>
            <ProjectList projectData={investedProjects} />
          </TabPanel>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
