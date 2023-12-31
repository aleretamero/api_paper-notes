import { CreateNoteDto } from "../dtos/CreateNoteDto";
import { ReturnNoteDto } from "../dtos/ReturnNoteDto";
import { UpdateNoteDto } from "../dtos/UpdateNoteDto";

export interface INoteService {
  create: (createNoteDto: CreateNoteDto) => Promise<ReturnNoteDto>;

  findAllByAuthorId: (authorId: string) => Promise<ReturnNoteDto[]>;

  findById: (noteId: string, userId: string) => Promise<ReturnNoteDto>;

  searchAllByAuthorId: (
    authorId: string,
    query: string,
  ) => Promise<ReturnNoteDto[]>;

  update: (
    noteId: string,
    userId: string,
    updateNoteDto: UpdateNoteDto,
  ) => Promise<ReturnNoteDto>;

  changeStatus: (noteId: string, userId: string) => Promise<ReturnNoteDto>;

  changeVisibility: (noteId: string, userId: string) => Promise<ReturnNoteDto>;

  delete: (noteId: string, userId: string) => Promise<ReturnNoteDto>;
}
