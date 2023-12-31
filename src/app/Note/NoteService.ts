import { NotFound } from "../../helpers/classes/NotFound";
import { Unauthorized } from "../../helpers/classes/Unauthorized";
import { CreateNoteDto } from "./dtos/CreateNoteDto";
import { ReturnNoteDto } from "./dtos/ReturnNoteDto";
import { UpdateNoteDto } from "./dtos/UpdateNoteDto";

import { NoteEntity } from "./entity/NoteEntity";
import { INoteRepository } from "./interfaces/INoteRepository";
import { INoteService } from "./interfaces/INoteService";

export class NoteService implements INoteService {
  constructor(private readonly noteRepository: INoteRepository) {}

  create = async (createNoteDto: CreateNoteDto): Promise<ReturnNoteDto> => {
    const note = await this.noteRepository.create(createNoteDto);

    return new ReturnNoteDto(note);
  };

  findAllByAuthorId = async (authorId: string): Promise<ReturnNoteDto[]> => {
    const notes = await this.noteRepository.findAllByAuthorId(authorId);

    return notes.map((note) => new ReturnNoteDto(note));
  };

  searchAllByAuthorId = async (
    authorId: string,
    query: string,
  ): Promise<ReturnNoteDto[]> => {
    const notes = await this.noteRepository.searchAllByAuthorId(
      authorId,
      query,
    );

    return notes.map((note) => new ReturnNoteDto(note));
  };

  findById = async (noteId: string, userId: string): Promise<ReturnNoteDto> => {
    const note = await this.noteRepository.findById(noteId);
    if (!note) throw new NotFound(`Note: _id ${noteId} not found!`);

    const isOwner = await this.isOwner(noteId, userId);
    if (!note.public && !isOwner) throw new Unauthorized("Permission denied");

    return new ReturnNoteDto(note);
  };

  update = async (
    noteId: string,
    userId: string,
    updateNoteDto: UpdateNoteDto,
  ): Promise<ReturnNoteDto> => {
    const isOwner = await this.isOwner(noteId, userId);
    if (!isOwner) throw new Unauthorized("Permission denied");

    const note = await this.noteRepository.update(noteId, updateNoteDto);

    return new ReturnNoteDto(note);
  };

  changeStatus = async (
    noteId: string,
    userId: string,
  ): Promise<ReturnNoteDto> => {
    const isOwner = await this.isOwner(noteId, userId);
    if (!isOwner) throw new Unauthorized("Permission denied");

    const status = (await this.findById(noteId, userId)).done;

    const note = await this.noteRepository.changeStatus(noteId, !status);

    return new ReturnNoteDto(note);
  };

  changeVisibility = async (
    noteId: string,
    userId: string,
  ): Promise<ReturnNoteDto> => {
    const isOwner = await this.isOwner(noteId, userId);
    if (!isOwner) throw new Unauthorized("Permission denied");

    const visibility = (await this.findById(noteId, userId)).public;

    const note = await this.noteRepository.changeVisibility(
      noteId,
      !visibility,
    );

    return new ReturnNoteDto(note);
  };

  delete = async (noteId: string, userId: string): Promise<ReturnNoteDto> => {
    const isOwner = await this.isOwner(noteId, userId);
    if (!isOwner) throw new Unauthorized("Permission denied");

    const note = (await this.noteRepository.delete(noteId)) as NoteEntity;

    return new ReturnNoteDto(note);
  };

  private readonly isOwner = async (
    noteId: string,
    userId: string,
  ): Promise<boolean> => {
    const note = await this.noteRepository.findById(noteId);

    if (note && JSON.stringify(userId) === JSON.stringify(note.author))
      return true;
    else return false;
  };
}
