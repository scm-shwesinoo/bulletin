export interface User{
    id: number,
    name: string,
    email: string,
    password: string,
    confirmPwd: string,
    type: string,
    phone: number,
    dob?: string,
    address?: string,
    user: any;
    createdAt: string;
}