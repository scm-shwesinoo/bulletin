export interface User {
    username: string,
    email: string
    data: {
        id: number
    }
}

export interface RoleList {
    roles:
    {
        id: number,
        name: string
    }[]
}

export interface UserList {
    id: number
    name: string,
    email: string,
    password: string,
    confirmPwd: string,
    type: number,
    phone: number,
    dob?: string,
    address?: string,
    createdAt: string,
    role: number,
    profile: string,
    oldProfile: string,
    formType: string,
    file: any,
    user: User
}

export interface UserProfile {
    username: string,
    email: string,
    employee: UserList
}

export interface Post {
    id: number,
    type: string,
    title: string,
    description: string,
    status: boolean,
    createdAt: string,
    user: User
}

export interface PostFilter {
    id: number,
    attributes: Post
}

export interface PostList {
    data: PostFilter
    // data: {
        // id: number,
        // attributes: {
        //     id: number,
        //     type: string,
        //     title: string,
        //     description: string,
        //     status: boolean,
        //     createdAt: string,
        //     user: User
        // }
    // }
}