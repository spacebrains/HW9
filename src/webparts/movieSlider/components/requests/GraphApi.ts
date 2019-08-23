import { MSGraphClientFactory } from '@microsoft/sp-http';
import { IResMSGraphUser } from './responseInterfaces';
import * as strings from 'MovieSliderWebPartStrings';

export interface IResMSGraphUser extends IResMSGraphUser { }

export const addOutlookEvent = async (MSGClientFactory: MSGraphClientFactory, movieName: string = 'test', action: string, CalendarName: string = 'Calendar', ): Promise<void> => {
  const datetime = new Date();

  const event = {
    subject: strings.AtThisTime + (action==='' ? strings.AbsolutelyNothing : action),
    body: {
      contentType: "HTML",
      content: movieName
    },
    start: {
      dateTime: datetime,
      timeZone: "Pacific Standard Time"
    },
    end: {
      dateTime: datetime,
      timeZone: "Pacific Standard Time"
    }
  };

  const client = await MSGClientFactory.getClient();
  await client.api(`/me/calendars/${CalendarName}/events`).post(event);
};


export const getUserName = async (MSGClientFactory: MSGraphClientFactory): Promise<string> => {
  const client = await MSGClientFactory.getClient();
  const user: IResMSGraphUser = await client.api('/me').get();

  return user.displayName;
};