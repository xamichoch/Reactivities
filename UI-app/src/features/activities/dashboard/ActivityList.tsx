import React, { useContext, Fragment } from "react";
import { Item, Label } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import activityStore from "../../../app/store/activityStore";
import ActivityListItem from "./ActivityListItem";

const ActivityList: React.FC = () => {
  const { activitiesByDate } = useContext(activityStore);

  return (
    <Fragment>
      {activitiesByDate.map(([date, activities]) => (
        <Fragment key={date}>
          <Label size="big" color="blue" content={date} />
          <Item.Group divided>
            {activities.map(activity => (
              <ActivityListItem key={activity.id} activity={activity} />
            ))}
          </Item.Group>
        </Fragment>
      ))}
    </Fragment>
  );
};

export default observer(ActivityList);
