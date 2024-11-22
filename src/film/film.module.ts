import { Module } from '@nestjs/common';
import { FilmService } from './film.service';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { FilmController } from './film.controller';
import { Film } from './entities/film.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Film])],
  // controllers: [FilmController],
  providers: [FilmService],
})
export class FilmModule {}
