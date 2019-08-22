import { IEvent } from '../interfaces';


export interface ILocalData{
    data:any[];
    datetime:Date;
  }


export const getLocalTempEventsWithTime = async (key: string = 'tempData'): Promise<ILocalData> => {
    console.log('localGetTempEvents:_ ee');
    const TIMER_TIME = 900000;
    const json = localStorage.getItem(key);
    if (json) {
        const data = await JSON.parse(json) as ILocalData;
        if (+new Date() - +new Date(data.datetime) < TIMER_TIME) {
            return data;
        }
    }
    return undefined;
};