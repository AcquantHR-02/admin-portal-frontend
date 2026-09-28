export interface ApiResponse<T>{
    success:boolean,
    message:string,
    data:T
}

export interface PaginatedResponse<T>{
    content:T[],
    pageNumber:number,
    pageSize:number,
    totalElements:number,
    totalPages:number,
    last:boolean,
    first:boolean
}

export enum Role{
    ADMIN="ADMIN",
    USER="USER"

}