import { MSGraphClientFactory } from '@microsoft/sp-http';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import {IUser} from '../interfaces';

export const addOutlookEvent = async (MSGClientFactory: MSGraphClientFactory, CalendarName: string = 'Calendar', movieName: string = 'test', action: string): Promise<void> => {
  console.log('addOutlookEvent');
  const datetime = new Date();
  const event = {
    subject: movieName,
    body: {
      contentType: "HTML",
      content: action
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
  const response = client.api(`/me/calendars/${CalendarName}/events`).post(event);

  console.log(response);
};


export const getUserName = async (MSGClientFactory: MSGraphClientFactory): Promise<string> => {
  const client = await MSGClientFactory.getClient();
  const user:IUser = await client.api('/me').get();
  
  return user.displayName;
};