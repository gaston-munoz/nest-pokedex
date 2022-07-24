import { Module } from '@nestjs/common'
import { join } from 'path'
import { ServeStaticModule } from '@nestjs/serve-static'
import { PokemonModule } from './pokemon/pokemon.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      serveRoot: '/public',
      rootPath: join(__dirname, '..', 'public'),
    }),
    PokemonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
