import { IResCaml } from './responseInterfaces';


export interface IResCaml extends IResCaml { }


export const getSpListEvent = async (movieName: string, baseUrl: string = 'https://mastond.sharepoint.com', calendarName: string = 'MovieCalendar'): Promise<IResCaml> => {
    const sp = (await import("@pnp/sp"));
    const web = new sp.Web(baseUrl);
    const response: IResCaml[] = await web.lists.getByTitle(calendarName).getItemsByCAMLQuery({
        ViewXml: `<View><Query><Where><Eq><FieldRef Name='Title'/><Value Type='Text'>${movieName}</Value></Eq></Where></Query></View>`
    });
    if (response[0]) {
        return response[0];
    }
};

export const addListEvent = async (movieName: string, category: string[], MovieAction: string, baseUrl: string = 'https://mastond.sharepoint.com', calendarName: string = 'MovieCalendar'): Promise<void> => {
    const sp = (await import("@pnp/sp"));
    const web = new sp.Web(baseUrl);

    const event = { Title: movieName, MCategory: category.join(' '), MovieAction: MovieAction };
    await web.lists.getByTitle(calendarName).items.add(event);
};

export const deleteListEvent = async (movieName: string, baseUrl: string = 'https://mastond.sharepoint.com', calendarName: string = 'MovieCalendar'): Promise<void> => {
    const sp = (await import("@pnp/sp"));
    const web = new sp.Web(baseUrl);

    const camlResponse: IResCaml = await getSpListEvent(movieName);
    if (camlResponse) {
        await web.lists.getByTitle(calendarName).items.getById(camlResponse.ID).delete();
    }
};


