// types/express/index.d.ts
import { IUserDocument } from "../../src/models/User";

declare global {
  namespace Express {
    interface Request {
      user?: IUserDocument;
      file?: Express.Multer.File;
      cookies?: {
        refreshToken?: string;
      };
    }
  }
}
