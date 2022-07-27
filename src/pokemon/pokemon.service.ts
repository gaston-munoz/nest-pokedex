import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { isValidObjectId, Model } from 'mongoose'
import { CreatePokemonDto } from './dto/create-pokemon.dto'
import { UpdatePokemonDto } from './dto/update-pokemon.dto'
import { Pokemon } from './entities/pokemon.entity'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,

    private readonly appConfig: ConfigService
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase()

    try {
      const pokemonCreated = await this.pokemonModel.create(createPokemonDto)
      return pokemonCreated
    } catch (error) {
      this.handleExceptions(error)
    }
  }

  findAll(paginationDto) {
    const defaultLimit = this.appConfig.get<number>('limitPagination')
    const { limit = defaultLimit, offset = 0 } = paginationDto

    return this.pokemonModel
       .find()
       .limit(limit)
       .skip(offset)
       .select({ '__v': 0 })
       .sort({ 'code': 1 })
  }

  async findOne(search: string) {
    let pokemon: Pokemon
   
    if (!isNaN(Number(search))) {
      pokemon = await this.pokemonModel.findOne({ code: search})
    }

    if (!pokemon && isValidObjectId(search)) {
      pokemon = await this.pokemonModel.findById(search)
    }

    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({ name: search})
    }

    if(!pokemon) throw new NotFoundException(`Pokemon not found with search ${search}`)

    return pokemon
  }

  async update(search: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(search)

    try {
      return await this.pokemonModel.findByIdAndUpdate(pokemon._id, updatePokemonDto, { new: true })
    } catch (error) {
      this.handleExceptions(error)
    }
  }

  async remove(id: string) {
    const pokemonDeleted = await this.pokemonModel.findByIdAndRemove(id)

    if(!pokemonDeleted) {
      throw new BadRequestException(`The object with id ${id} not exists`)
    }

    return {
      pokemon: pokemonDeleted 
    }
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(`The object already exists ${JSON.stringify(error.keyValue)}`)
     }

     throw new InternalServerErrorException('Error saving resource') 
  }
}
