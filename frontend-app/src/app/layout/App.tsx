import React, { useState, useEffect, Fragment, SyntheticEvent } from "react";
import { Container } from "semantic-ui-react";
import { IActivity } from "../models/activity";
import NavBar from "../../features/NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import agent from "../api/agent";
import LoadingComponent from "./loadingComponent";

const App = () => {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(
    null
  );
  const [editMode, setEditMode] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [target, setTarget] = useState("");

  const handleSelectActivity = (id: string) => {
    setEditMode(false);
    setSelectedActivity(activities.filter(a => a.id === id)[0]);
  };

  const handleOpenCreateForm = () => {
    setSelectedActivity(null);
    setEditMode(true);
  };

  const handleCreateActivity = async (activity: IActivity) => {
    setSubmitting(true);
    await agent.Activities.create(activity);
    setActivities([...activities, activity]);
    setSelectedActivity(activity);
    setEditMode(false);
    setSubmitting(false);
  };

  const handleEditActivity = async (activity: IActivity) => {
    setSubmitting(true);
    await agent.Activities.update(activity);
    setActivities([...activities.filter(a => a.id !== activity.id), activity]);
    setSelectedActivity(activity);
    setEditMode(false);
    setSubmitting(false);
  };

  const handleDeleteActivity = async (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    setSubmitting(true);
    setTarget(event.currentTarget.name);
    await agent.Activities.delete(id);
    setActivities([...activities.filter(a => a.id !== id)]);
    setSelectedActivity(null);
    setSubmitting(false);
  };

  useEffect(() => {
    agent.Activities.list()
      .then(response => {
        let activities: IActivity[] = [];
        response.forEach(activity => {
          activity.date = activity.date.split(".")[0];
          activities.push(activity);
        });
        setActivities(activities);
      })
      .then(() => {
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <LoadingComponent content={"Loading activities..."} inverted={true} />
    );

  return (
    <Fragment>
      <NavBar openCreateForm={handleOpenCreateForm} />
      <Container style={{ marginTop: "7em" }}>
        <ActivityDashboard
          activities={activities}
          selectActivity={handleSelectActivity}
          selectedActivity={selectedActivity}
          editMode={editMode}
          setEditMode={setEditMode}
          setSelectedActivity={setSelectedActivity}
          createActivity={handleCreateActivity}
          editActivity={handleEditActivity}
          deleteActivity={handleDeleteActivity}
          target={target}
          submitting={submitting}
        />
      </Container>
    </Fragment>
  );
};

export default App;
