import { Injectable, InternalServerErrorException } from '@nestjs/common'
import axios, { AxiosInstance } from 'axios'
import { HttpAdapter } from '../interfaces/httpAdapter.interface'

@Injectable()
export class AxiosAdapter implements HttpAdapter {
    private readonly axios: AxiosInstance = axios

    async get<T>(url: string) {
        try {
            const { data } = await axios.get(url)
            return data
        } catch (error) {
            throw new InternalServerErrorException('Something went wrong')
        }
    }
}