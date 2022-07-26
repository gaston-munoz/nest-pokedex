import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase()

    try {
      return await this.pokemonModel.create(createPokemonDto)
    } catch (error) {
      this.handleExceptions(error)
    }
  }

  findAll() {
    return this.pokemonModel.find()
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
