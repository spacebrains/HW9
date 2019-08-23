export interface IResMovie {
    vote_count: number;
    id: number;
    video: boolean;
    vote_average: number;
    title: string;
    popularity: number;
    poster_path: string;
    original_language: string;
    original_title: string;
    genre_ids: number[];
    backdrop_path: string;
    adult: boolean;
    overview: string;
    release_date: string;
  }

export interface IResCaml {
    'odata.type': string;
    'odata.id': string;
    'odata.etag': string;
    'odata.editLink': string;
    FileSystemObjectType: number;
    Id: number;
    ServerRedirectedEmbedUri?: any;
    ServerRedirectedEmbedUrl: string;
    ContentTypeId: string;
    Title: string;
    ComplianceAssetId?: any;
    Location?: any;
    Geolocation?: any;
    EventDate: string;
    EndDate: string;
    Description?: any;
    fAllDayEvent: boolean;
    fRecurrence: boolean;
    ParticipantsPickerId?: any;
    ParticipantsPickerStringId?: any;
    Category?: any;
    FreeBusy?: any;
    Overbook?: any;
    BannerUrl?: any;
    MovieCategory: MovieCategory[];
    MovieAction: string;
    ID: number;
    Modified: string;
    Created: string;
    AuthorId: number;
    EditorId: number;
    OData__UIVersionString: string;
    Attachments: boolean;
    GUID: string;
}

interface MovieCategory {
    Label: string;
    TermGuid: string;
    WssId: number;
}


export interface IResMSGraphUser {
    '@odata.context': string;
    businessPhones: string[];
    displayName: string;
    givenName: string;
    jobTitle?: any;
    mail: string;
    mobilePhone?: any;
    officeLocation?: any;
    preferredLanguage: string;
    surname: string;
    userPrincipalName: string;
    id: string;
  }