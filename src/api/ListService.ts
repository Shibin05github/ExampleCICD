import { ListApiResponseType } from "../types/ListTypes"
import { getRequest } from "./api"

export const getProducts = async (limit: number): Promise<ListApiResponseType> => {
    const res = await getRequest<ListApiResponseType>(`products?limit=${limit}&skip=0`)
    return res.data
}