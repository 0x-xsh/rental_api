import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Film } from './entities/film.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FilmService {
  constructor(
    @InjectRepository(Film)
    private readonly filmRepository: Repository<Film>,
  ) {}

  async findAll(): Promise<Film[]> {
    return this.filmRepository.find();
  }

  async createFilm(data: Partial<Film>): Promise<Film> {
    const film = this.filmRepository.create(data);
    return this.filmRepository.save(film);
  }
}