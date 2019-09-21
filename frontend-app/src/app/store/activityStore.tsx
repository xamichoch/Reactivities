import { observable, action, computed, configure, runInAction } from "mobx";
import { createContext, SyntheticEvent } from "react";
import { IActivity } from "../models/activity";
import agent from "../api/agent";

configure({ enforceActions: "always" });

class ActivityStore {
  @observable activityRegistry = new Map<string, IActivity>();
  @observable loadingInitial = false;
  @observable activity: IActivity | null = null;
  @observable submitting: boolean = false;
  @observable target: string = "";

  @computed get activitiesByDate() {
    return Array.from(this.activityRegistry.values()).sort(
      (a, b) => Date.parse(a.date) - Date.parse(b.date)
    );
  }

  @action loadActivities = async () => {
    this.loadingInitial = true;
    try {
      const activities = await agent.Activities.list();
      runInAction("Loading activities", () => {
        activities.forEach(activityRegistry => {
          activityRegistry.date = activityRegistry.date.split(".")[0];
          this.activityRegistry.set(activityRegistry.id, activityRegistry);
        });
        this.loadingInitial = false;
      });
    } catch (error) {
      runInAction("Loading activities error", () => {
        console.log(error);
        this.loadingInitial = false;
      });
    }
  };

  @action loadActivity = async (id: string) => {
    let activity = this.getActivity(id);
    if (activity) {
      this.activity = activity;
    } else {
      this.loadingInitial = true;
      try {
        activity = await agent.Activities.details(id);
        runInAction("getting activities", () => {
          if (activity) this.activity = activity;
          this.loadingInitial = false;
        });
      } catch (error) {
        runInAction("get activity error", () => {
          this.loadingInitial = false;
        });
        console.log(error);
      }
    }
  };

  getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  };

  @action selectActivity = (id: string) => {
    let activity = this.activityRegistry.get(id);
    if (activity) this.activity = activity;
  };

  @action createActivity = async (activityRegistry: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.create(activityRegistry);
      runInAction("Creating activityRegistry", () => {
        this.activityRegistry.set(activityRegistry.id, activityRegistry);
        this.activity = activityRegistry;
        this.submitting = false;
      });
    } catch (error) {
      runInAction("Creating activityRegistry error", () => {
        console.log(error);
        this.submitting = false;
      });
    }
  };

  @action editActivity = async (activityRegistry: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.update(activityRegistry);
      runInAction("Editing activityRegistry", () => {
        this.activityRegistry.set(activityRegistry.id, activityRegistry);
        this.activity = activityRegistry;
        this.submitting = false;
      });
    } catch (error) {
      runInAction("Editing activityRegistry", () => {
        console.log(error);
        this.submitting = false;
      });
    }
  };

  @action deleteActivity = async (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    this.submitting = true;
    this.target = event.currentTarget.name;
    try {
      await agent.Activities.delete(id);
      runInAction("Deleting activityRegistry", () => {
        this.activityRegistry.delete(id);
        this.activity = null;
        this.submitting = false;
        this.target = "";
      });
    } catch (error) {
      runInAction("Deleting activityRegistry", () => {
        console.log(error);
        this.submitting = false;
      });
    }
  };

  @action clearActivity = () => (this.activity = null);

  @action cancelCreateActivity = () => {
    this.activity = null;
  };

  @action closeActivity = () => {
    this.activity = null;
  };
}

export default createContext(new ActivityStore());
