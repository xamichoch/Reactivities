import React, { useEffect, useContext } from "react";
import { Grid } from "semantic-ui-react";
import ActivityList from "./ActivityList";
import { observer } from "mobx-react-lite";
import LoadingComponent from "../../../app/layout/loadingComponent";
import ActivityStore from "../../../app/store/activityStore";

const ActivityDashboard: React.FC = () => {
  const { loadingInitial, loadActivities, activityRegistry } = useContext(
    ActivityStore
  );

  useEffect(() => {
    !activityRegistry.size && loadActivities();
  }, [loadActivities, activityRegistry]);

  if (loadingInitial) {
    return (
      <LoadingComponent content={"Loading activities..."} inverted={false} />
    );
  }

  return (
    <Grid>
      <Grid.Column width="10">
        <ActivityList />
      </Grid.Column>
      <Grid.Column width="6">
        <h2>Activity filters</h2>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDashboard);
