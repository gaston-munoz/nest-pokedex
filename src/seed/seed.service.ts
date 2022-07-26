import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios'

import { PokeResponse } from './interfaces/poke-response.interface';
import { Pokemon as IPokemon } from './interfaces/pokemon.interface';

import { Model } from 'mongoose';

import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';

@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance = axios

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ) {}

  async executeSeed() {
    await this.deleteAll()

    const { data } = await axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650')

    const pokemonsToInsert = data.results.map(({name, url}) => {
      const splitedUrl = url.split('/')
      const code = parseInt(splitedUrl[splitedUrl.length - 2])
      const pokemon: IPokemon = {
        name,
        code,
      }

      console.log(pokemon)
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
