import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography, Avatar, Button } from "@material-ui/core";
import Fields from "./Fields";
import ProjectList from "./Project";
import EditDialog from "./ProfileInfoEdit";
import MessageDialog from "./Message";

import LocationOnIcon from "@material-ui/icons/LocationOn";
import JHAvatar from "../assets/jh-avatar.jpg";
import coffeeCup from "../assets/coffee-cup.jpg";
import espresso from "../assets/espresso.jpg";
import espresso2 from "../assets/espresso2.jpg";
import pouringCoffee from "../assets/pouring-coffee.jpg";
import "./Profile.css";
import authFetch from "../utilities/auth";

const useStyles = makeStyles({
  avatar: {
    margin: 10
  },
  bigAvatar: {
    margin: 10,
    width: 60,
    height: 60
  },

  projectTitle: {
    padding: 20
  },
  projectGridList: {
    padding: 20
  }
});

const fieldsData = ["TECHNOLOGY", "COFFEE", "CUSTOMER SERVICE", "RESTAURANT"];

const projectData = [
  {
    img: coffeeCup,
    category: "Food and Craft",
    alt: "Coffee Cup",
    field: "Customer Service",
    title: "Urban Jungle: eco-friendly coffee shop",
    raised: "23,874",
    goal: "40,000",
    equity: "10%",
    daysToGo: "44"
  },
  {
    img: espresso,
    category: "Food and Craft",
    alt: "Espresso",
    field: "Coffee",
    title: "Energy Run: the quickest coffee experience",
    raised: "7,257",
    goal: "12,383",
    equity: "13%",
    daysToGo: "19"
  },
  {
    img: espresso,
    category: "Food and Craft",
    alt: "Espresso",
    field: "Coffee",
    title: "Energy Run: the quickest coffee experience",
    raised: "7,257",
    goal: "12,383",
    equity: "13%",
    daysToGo: "19"
  },
  {
    img: pouringCoffee,
    category: "Life Hacks",
    alt: "Pouring Coffee",
    field: "Restaurant",
    title: "Energy Rush: an even quicker coffee experience",
    raised: "34,912",
    goal: "50,000",
    equity: "5%",
    daysToGo: "5"
  }
];

export default function ProfilePage(props) {
  const [profile, setProfile] = useState(null); //Reason why it renders empty for profile for a short time
  const [projects, setProjects] = useState(null);

  useEffect(() => {
    authFetch({ url: `/profile/${props.match.params.id}` }).then(res => {
      if (res.error) {
        clearing();
      } else {
        setProfile(res.profile);
        setProjects(res.projects);
      }
    });
  }, [props.match.params.id]);

  //console.log(profile)
  const classes = useStyles();

  const clearing = () => {
    window.localStorage.clear();
    window.sessionStorage.clear();
    window.location.replace("/login");
  };

  return profile && projects ? (
    //set up a condition to render only if profile and project isn't null
    <React.Fragment>
      <Grid container justify="center" spacing={3}>
        {/* Left part */}
        <Grid item xs={3} style={{ minHeight: "200px" }}>
          <Grid container direction="column" spacing={3}>
            <Grid container justify="center" alignItems="center">
              <Avatar
                alt={profile.name}
                src={JHAvatar}
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
                {profile.name}
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
                {profile.location}
              </Typography>
            </Grid>

            <Grid container justify="center">
              <EditDialog profile={profile} setProfile={setProfile} />
            </Grid>

            <Grid container justify="center" alignItems="center">
              <Fields fieldsData={fieldsData} />
            </Grid>

            <Grid container justify="center" alignItems="center">
              <MessageDialog />
            </Grid>
            <Button onClick={clearing}>Logout</Button>
          </Grid>
        </Grid>

        {/* Right part*/}
        <Grid item xs={8}>
          <Typography
            variant="h3"
            gutterBottom
            className={classes.projectTitle}
          >
            Projects
          </Typography>
          <ProjectList projectData={projectData} />{" "}
          {/*the prop would be changed with projects state */}
          <h1>Column 2</h1>
          <h1>new line</h1>
          <h1>new line</h1>
          <h1>new line</h1>
          <h1>new line</h1>
          <h1>new line</h1>
          <h1>new line</h1>
          <h1>new line</h1>
          <h1>new line</h1>
          <h1>new line</h1>
          <h1>new line</h1>
          <h1>new line</h1>
          <h1>new line</h1>
          <h1>new line</h1>
          <h1>new line</h1>
          <h1>end line</h1>
        </Grid>
      </Grid>
    </React.Fragment>
  ) : (
    <div>Error</div>
  );
  /*(
    <div>
      <Redirect to="/launch" />
    </div> */
}
