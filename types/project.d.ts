declare namespace Project{
    type User = {
        id?: number,
        name: string,
        login: string,
        password: string,
        email: string,
    };

    type Resource = {
        id? : number;
        name : string;
        key : string;
    }

    type Profile = {
        id? : number;
        description : string;
    }

    type UserProfile = {
        id? : number;
        profile: Profile;
        user: User;
    }
}