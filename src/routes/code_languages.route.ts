import CodeLanguagesController from '@controllers/code_languages.controller';
import { CreateCodeLanguageDto } from '@dtos/code_languages/create_code_language.dto';
import authMiddleware from '@middlewares/auth.middleware';
import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';

class CodeLanguagesRoute implements Routes {
  public router = Router();
  public basePath = '/code-languages';
  private _codeLanguagesController = new CodeLanguagesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.basePath}`, authMiddleware, this._codeLanguagesController.getCodeLanguages);
    this.router.post(
      `${this.basePath}`,
      authMiddleware,
      validationMiddleware(CreateCodeLanguageDto, 'body'),
      this._codeLanguagesController.createCodeLanguage,
    );
    this.router.put(
      `${this.basePath}/:id`,
      authMiddleware,
      validationMiddleware(CreateCodeLanguageDto, 'body'),
      this._codeLanguagesController.updateCodeLanguage,
    );
    this.router.delete(`${this.basePath}/:id`, authMiddleware, this._codeLanguagesController.deleteCodeLanguage);
  }
}

export default CodeLanguagesRoute;
