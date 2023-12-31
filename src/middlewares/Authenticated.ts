import type { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { z } from "zod";

import { userService } from "../app/User/UserModule";
import { IUserService } from "../app/User/interfaces/IUserService";

import { ReturnUserDto } from "../app/User/dtos/ReturnUserDto";
import { Unauthorized } from "../helpers/classes/Unauthorized";

class Authenticated {
  constructor(private readonly userService: IUserService) {}

  private readonly schema = z.object({
    authorization: z.string(),
  });

  public readonly isAuthenticated = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const authorization = this.parseToken(req);

      if (!authorization) throw new Unauthorized("Unauthorized: Invalid token");

      const token = authorization.replace(/^Bearer /, "");

      const payload = this.isValidToken(token);

      if (!payload) throw new Unauthorized("Unauthorized: Invalid token");

      const isValidUser = await this.isValidUser(payload);

      if (!isValidUser) {
        throw new Unauthorized("Unauthorized: Please log in again to continue");
      }

      req.userId = payload._id;
      req.user = {
        _id: payload._id,
        name: payload.name,
        email: payload.email,
      };

      next();
    } catch (error) {
      next(error);
    }
  };

  private readonly parseToken = (req: Request): string | undefined => {
    try {
      return this.schema.parse(req.headers).authorization;
    } catch (error) {
      return undefined;
    }
  };

  private readonly isValidToken = (
    token: string,
  ): ReturnUserDto | undefined => {
    try {
      const payload = verify(token, process.env.JWT_TOKEN!) as ReturnUserDto;

      return payload;
    } catch (error) {
      return undefined;
    }
  };

  private readonly isValidUser = async (
    payload: ReturnUserDto,
  ): Promise<boolean> => {
    const user = await this.userService
      .findById(payload._id)
      .catch(() => undefined);

    if (!user) return false;
    if (payload.email !== user.email) return false;
    if (payload.name !== user.name) return false;

    return true;
  };
}

export const isAuthenticated = new Authenticated(userService).isAuthenticated;
