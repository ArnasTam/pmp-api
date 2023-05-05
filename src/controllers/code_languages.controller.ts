import { CreateCodeLanguageDto } from '@dtos/code_languages/create_code_language.dto';
import { CodeLanguage } from '@interfaces/code_language.interface';
import CodeLanguagesService from '@services/code_languages.service';
import { NextFunction, Request, Response } from 'express';

class CodeLanguagesController {
  private _codeLanguagesService = new CodeLanguagesService();

  public getCodeLanguages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const codeLanguages: CodeLanguage[] = await this._codeLanguagesService.getCodeLanguages();

      res.status(200).json({ data: codeLanguages });
    } catch (error) {
      next(error);
    }
  };

  public createCodeLanguage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const codeLanguageDto: CreateCodeLanguageDto = req.body;
      const codeLanguage: CodeLanguage = await this._codeLanguagesService.createCodeLanguage(codeLanguageDto);

      res.status(201).json({ data: codeLanguage });
    } catch (error) {
      next(error);
    }
  };

  public updateCodeLanguage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const codeLanguageId = req.params.id;
      const codeLanguageDto: CreateCodeLanguageDto = req.body;
      const codeLanguage: CodeLanguage = await this._codeLanguagesService.updateCodeLanguage(codeLanguageId, codeLanguageDto);

      res.status(200).json({ data: codeLanguage });
    } catch (error) {
      next(error);
    }
  };

  public deleteCodeLanguage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const codeLanguageId = req.params.id;
      const codeLanguage: CodeLanguage = await this._codeLanguagesService.deleteCodeLanguage(codeLanguageId);

      res.status(200).json({ data: codeLanguage });
    } catch (error) {
      next(error);
    }
  };
}

export default CodeLanguagesController;
