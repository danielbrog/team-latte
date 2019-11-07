import React, { useEffect, useState } from "react";
import {
  Typography,
  makeStyles,
  Grid,
  Select,
  TextField,
  MenuItem
} from "@material-ui/core";
import classNames from "classnames";
import ProjectList from "./Project";
import authFetch from "../utilities/auth";
import InfiniteScroll from "react-infinite-scroller";

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: theme.spacing(5),
    textAlign: "center"
  },

  fieldMargin: {
    margin: theme.spacing(2)
  },

  select: {
    minWidth: 215
  },
  flexContainer: {
    margin: "40px 10%"
  }
}));

function Explore() {
  const classes = useStyles();
  const [projects, setProjects] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState(0);
  const [uniqueIndustries, setUniqueIndustries] = useState(new Set());

  //console.log(projects)

  const [filterQuery, setFilterQuery] = useState({
    industry: "",
    location: "",
    deadline: ""
  });

  //It would be nice if this is run everytime the user hit the bottom of the page and fetches 20 new projects each time
  //look up 'react infinite scroll' for that

  //This loads the industries from projects
  useEffect(() => {
    projects.forEach(project => {
      setUniqueIndustries(uniqueIndustries.add(project.industry)); //Adding each project's industry in the Set
    });
  }, [projects, uniqueIndustries]); //projects array changes, it will rerender

  const onChangeFilter = event => {
    setHasMore(true); //download more objects incase it's needed
    const { value, name } = event.target;
    setFilterQuery({ ...filterQuery, [name]: value });
  };

  const filterProjects = projects => {
    const { industry, location } = filterQuery; //TODO using deadline yet, it should the project timestamp and subtract dates

    //Check issue # ...
    return projects.filter(
      // for each array's element (which are objects for project info)
      project => {
        return (
          project.industry.includes(industry) && //checking if specific project's industry MATCHES the industry
          project.location.includes(location)
        );
      }
    );
  };

  const loadMore = () => {
    setHasMore(false);
    const url = "/projects?pageNo=" + cursor + "&size=3";
    authFetch({
      url
    }).then(res => {
      if (res.error) {
        setHasMore(false);
      } else {
        setProjects(projects.concat(res));
        setCursor(cursor + 1);
        setHasMore(true);
      }
    });
  };

  return (
    <div className={classes.container}>
      <Typography gutterBottom variant="h4">
        Explore projects
      </Typography>
      <Grid alignContent="center">
        <Select
          onChange={onChangeFilter}
          name="industry"
          value={filterQuery.industry}
          className={classNames(classes.select)}
          variant="outlined"
          input={
            <TextField variant="outlined" margin="normal" label="Industries" />
          }
        >
          <MenuItem value={""}>{}</MenuItem>
          {[...uniqueIndustries].map(industry => (
            <MenuItem value={industry}>{industry}</MenuItem>
          ))}
        </Select>
        <TextField
          onChange={onChangeFilter}
          value={filterQuery.location}
          name="location"
          className={classNames(classes.fieldMargin)}
          variant="outlined"
          margin="normal"
          label="Location"
        />
        <TextField
          onChange={onChangeFilter}
          value={filterQuery.deadline}
          name="deadline"
          className={classes.fieldText}
          variant="outlined"
          margin="normal"
          label="Deadline"
        />
      </Grid>

      {projects && (
        <div className={classes.flexContainer}>
          <InfiniteScroll
            pageStart={0}
            loadMore={loadMore}
            hasMore={hasMore}
            loader={
              <div className="loader" key={0}>
                Loading ...
              </div>
            }
          >
            <ProjectList projectData={filterProjects(projects)} />
          </InfiniteScroll>
        </div>
      )}
    </div>
  );
}

export default Explore;
