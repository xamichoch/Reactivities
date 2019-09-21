import React, { useContext, useEffect } from "react";
import { Card, Image, Button } from "semantic-ui-react";
import activityStore from "../../../app/store/activityStore";
import { observer } from "mobx-react-lite";
import { RouteChildrenProps } from "react-router";
import LoadingComponent from "../../../app/layout/loadingComponent";
import { Link } from "react-router-dom";

interface DetailParams {
  id: string;
}

const ActivityDetails: React.FC<RouteChildrenProps<DetailParams>> = ({
  match,
  history
}) => {
  const { activity, loadActivity, loadingInitial } = useContext(activityStore);

  useEffect(() => {
    match && loadActivity(match.params.id);
  }, [loadActivity, match]);

  if (loadingInitial || !activity)
    return <LoadingComponent content="Loading activity..." />;

  return (
    <Card fluid>
      <Image
        src={`/assets/categoryImages/${activity!.category}.jpg`}
        wrapped
        ui={false}
      />
      <Card.Content>
        <Card.Header>{activity!.title}</Card.Header>
        <Card.Meta>{activity!.date}</Card.Meta>
        <Card.Description>{activity!.description}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button.Group widths="2">
          <Button
            as={Link}
            to={`/manage/${activity.id}`}
            basic
            color="blue"
            content="Edit"
          />
          <Button
            basic
            color="grey"
            content="Cancel"
            onClick={() => history.push("/activities")}
          />
        </Button.Group>
      </Card.Content>
    </Card>
  );
};

export default observer(ActivityDetails);
