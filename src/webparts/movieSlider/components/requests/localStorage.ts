import { IGenre, IMovie, Tkey, ILocalData, C } from '../interfaces';


export const localSetData = (key: Tkey, data: IMovie[] | IGenre[]): void => {
    console.log('localSetData', key);
    const obj = {
        data: data,
        datetime: new Date()
    };

    localStorage.setItem(key, JSON.stringify(obj));
};

export const localGetData = async <T extends any[]>(key: Tkey): Promise<T> => {
    console.log('localGetData:_', key);
    try {
        const TIMER_TIME = 86400000;
        const json = localStorage.getItem(key);
        if (json) {
            const { data, datetime } = await JSON.parse(json) as ILocalData;
            if (+new Date() - +new Date(datetime) < TIMER_TIME) {
                return data as T;
            }
        }
        return [] as T;
    }
    catch (error) {
        console.error('localGetData', error);
        return [] as T;
    }
};