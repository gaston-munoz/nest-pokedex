import { Injectable } from '@nestjs/common'
import axios, { AxiosInstance } from 'axios'

import { PokeResponse } from './interfaces/poke-response.interface'
import { Pokemon as IPokemon } from './interfaces/pokemon.interface'

import { Model } from 'mongoose'

import { InjectModel } from '@nestjs/mongoose'
import { Pokemon } from 'src/pokemon/entities/pokemon.entity'
import { HttpAdapter } from 'src/common/interfaces/httpAdapter.interface'
import { AxiosAdapter } from 'src/common/adapters/axios.adapter'

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter
  ) {}

  async executeSeed() {
    await this.deleteAll()

    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650')

    const pokemonsToInsert = data.results.map(({name, url}) => {
      const splitedUrl = url.split('/')
      const code = parseInt(splitedUrl[splitedUrl.length - 2])
      const pokemon: IPokemon = {
        name,
        code,
      }

      return pokemon
    })

    await this.pokemonModel.insertMany(pokemonsToInsert)

    return 'Seed executed successfully'
  }

  async deleteAll() {
    await this.pokemonModel.deleteMany()

    return 'Deleted successfully'
  }
}
