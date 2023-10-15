import { NextFunction, Request, Response } from "express";
import { ReturnCommentDto } from "./dtos/ReturnCommentDto";
import { createCommentSchema } from "./schemas/createCommentSchema";
import { idSchema } from "../../helpers/schemas/idSchema";
import { updateCommentSchema } from "./schemas/updateCommentSchema";
import { ICommentController } from "./interfaces/ICommentController";
import { ICommentService } from "./interfaces/ICommentService";

export class CommentController implements ICommentController {
  constructor(private readonly commentService: ICommentService) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.userId!;
      const createCommentDto = { ...createCommentSchema.parse(req.body), user: userId };

      const comment = await this.commentService
        .create({ ...createCommentDto })
        .then((note) => new ReturnCommentDto(note));

      res.status(201).json(comment);
    } catch (error) {
      next(error);
    }
  };

  getAllByNoteId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = idSchema.parse(req.params);

      const comments = await this.commentService
        .findAllByNoteId(id)
        .then((comments) => comments.map((comment) => new ReturnCommentDto(comment)));

      res.status(200).json(comments);
    } catch (error) {
      next(error);
    }
  };

  show = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = idSchema.parse(req.params);

      const comment = await this.commentService
        .findById(id)
        .then((comment) => new ReturnCommentDto(comment));

      res.status(200).json(comment);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = idSchema.parse(req.params);
      const updateCommentDto = updateCommentSchema.parse(req.body);

      const comment = await this.commentService
        .update(id, updateCommentDto)
        .then((comment) => new ReturnCommentDto(comment));

      res.status(200).json(comment);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = idSchema.parse(req.params);

      const comment = await this.commentService
        .delete(id)
        .then((comment) => new ReturnCommentDto(comment));

      res.status(204).json(comment);
    } catch (error) {
      next(error);
    }
  };
}