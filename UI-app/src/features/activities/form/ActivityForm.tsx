import React, { useState, FormEvent, useContext, useEffect } from "react";
import { Segment, Form, Button, Grid } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";
import { v4 as uuid } from "uuid";
import activityStore from "../../../app/store/activityStore";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router";

interface DetailParams {
  id: string;
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
  history
}) => {
  const {
    createActivity,
    submitting,
    editActivity,
    activity: initialFormState,
    loadActivity,
    clearActivity
  } = useContext(activityStore);

  const [activity, setActivity] = useState<IActivity>({
    id: "",
    title: "",
    description: "",
    category: "",
    date: "",
    city: "",
    venue: ""
  });

  useEffect(() => {
    if (match.params.id && activity.id.length === 0) {
      loadActivity(match.params.id).then(() => {
        initialFormState && setActivity(initialFormState);
      });
    }

    return () => {
      clearActivity();
    };
  }, [
    loadActivity,
    match.params.id,
    clearActivity,
    initialFormState,
    activity.id.length
  ]);

  const handleInputChange = (
    event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.currentTarget;
    setActivity({
      ...activity,
      [name]: value
    });
  };

  const handleSubmit = () => {
    if (activity.id.length === 0) {
      let newActivity = { ...activity, id: uuid() };
      createActivity(newActivity).then(() =>
        history.push(`/activities/${activity.id}`)
      );
    } else {
      editActivity(activity).then(() =>
        history.push(`/activities/${activity.id}`)
      );
    }
  };

  return (
    <Grid>
      <Grid.Column width={10}>
        <Segment clearing>
          <Form onSubmit={handleSubmit}>
            <Form.Input
              placeholder="Title"
              name="title"
              value={activity.title}
              onChange={handleInputChange}
            />
            <Form.TextArea
              placeholder="Description"
              name="description"
              value={activity.description}
              onChange={handleInputChange}
            />
            <Form.Input
              placeholder="Category"
              name="category"
              value={activity.category}
              onChange={handleInputChange}
            />
            <Form.Input
              type="datetime-local"
              name="date"
              value={activity.date}
              onChange={handleInputChange}
            />
            <Form.Input
              placeholder="City"
              name="city"
              value={activity.city}
              onChange={handleInputChange}
            />
            <Form.Input
              placeholder="Venue"
              name="venue"
              value={activity.venue}
              onChange={handleInputChange}
            />
            <Button
              loading={submitting}
              floated="right"
              positive
              type="submit"
              content="Submit"
            />
            <Button
              floated="right"
              type="button"
              content="Cancel"
              onClick={() => {
                // clearActivity();
                history.push("/activities");
              }}
            />
          </Form>
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityForm);
