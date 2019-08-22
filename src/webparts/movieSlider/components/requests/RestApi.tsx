import { IResCaml, IActs, IListEvent, C } from '../interfaces';

export const addListEvent = async (movieName: string, category: string[], acts: IActs, baseUrl: string = 'https://mastond.sharepoint.com', calendarName: string = 'MovieCalendar'): Promise<void> => {
    console.log('addListEvent or');

    const sp = (await import("@pnp/sp"));
    const web = new sp.Web(baseUrl);

    const iWillGo = acts.iWillGo ? `${C.iWillGo}; ` : '';
    const intresting = acts.intresting ? `${C.intresting}; ` : '';
    const event = { Title: movieName, MCategory: category.join('; '), MovieAction: iWillGo + intresting };
    console.log(event);
    const response = await web.lists.getByTitle(calendarName).items.add(event);
    console.log(response);
};


const getListEvent = async (movieName: string, baseUrl: string = 'https://mastond.sharepoint.com', calendarName: string = 'MovieCalendar'): Promise<IResCaml> => {
    console.log('checkMovieActs or');
    const sp = (await import("@pnp/sp"));
    const web = new sp.Web(baseUrl);

    const response: IResCaml[] = await web.lists.getByTitle(calendarName).getItemsByCAMLQuery({
        ViewXml: `<View><Query><Where><Eq><FieldRef Name='Title'/><Value Type='Text'>${movieName}</Value></Eq></Where></Query></View>`
    });
    if (response[0]) {
        return response[0];
    }
};

export const deleteListEvent = async (movieName: string, baseUrl: string = 'https://mastond.sharepoint.com', calendarName: string = 'MovieCalendar'):Promise<void> => {
    console.log('deleteListEvent or');
    const sp = (await import("@pnp/sp"));
    const web = new sp.Web(baseUrl);

    const camlResponse: IResCaml = await getListEvent(movieName);
    if (camlResponse) {
        const spResponse = await web.lists.getByTitle(calendarName).items.getById(camlResponse.ID).delete;
        console.log(spResponse);
    }
};


export const checkMovieActs = async (movieName: string, baseUrl: string = 'https://mastond.sharepoint.com', calendarName: string = 'MovieCalendar'): Promise<IActs> => {
    console.log('checkMovieActs or');
    const sp = (await import("@pnp/sp"));
    const web = new sp.Web(baseUrl);

    const response: IResCaml = await getListEvent(movieName);
    if (response) {
        const iWillGo: boolean = response.MovieAction.includes(C.iWillGo);
        const intresting: boolean = response.MovieAction.includes(C.intresting);

        const acts: IActs = {
            iWillGo: iWillGo,
            intresting: intresting
        };
        return acts;
    }
    else return { iWillGo: false, intresting: false };
};


