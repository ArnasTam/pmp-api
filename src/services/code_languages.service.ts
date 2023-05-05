import { CreateCodeLanguageDto } from '@dtos/code_languages/create_code_language.dto';
import { CodeLanguagesEntity } from '@entities/code_languages.entity';
import { HttpException } from '@exceptions/HttpException';
import { CodeLanguage } from '@interfaces/code_language.interface';
import { isEmpty } from '@utils/util';

class CodeLanguagesService {
  public async getCodeLanguages(): Promise<CodeLanguage[]> {
    return CodeLanguagesEntity.find();
  }

  public async getCodeLanguageById(id: string): Promise<CodeLanguage> {
    if (isEmpty(id)) throw new HttpException(400, 'id must not be empty');

    const codeLanguage: CodeLanguage = await CodeLanguagesEntity.findOne({ where: { id: id } });
    if (!codeLanguage) throw new HttpException(409, 'Code language with the specified id does not exist');

    return codeLanguage;
  }

  public async getCodeLanguagesByIds(ids: string[]): Promise<CodeLanguage[]> {
    if (isEmpty(ids)) throw new HttpException(400, 'ids must not be empty');

    const codeLanguages: CodeLanguage[] = await CodeLanguagesEntity.findByIds(ids);
    if (!codeLanguages || !codeLanguages.length) throw new HttpException(409, 'Code languages with the specified id does not exist');

    return codeLanguages;
  }

  public async createCodeLanguage(data: CreateCodeLanguageDto): Promise<CodeLanguage> {
    return await CodeLanguagesEntity.create({
      ...data,
    }).save();
  }

  public async updateCodeLanguage(id: string, data: CreateCodeLanguageDto): Promise<CodeLanguage> {
    if (isEmpty(id)) throw new HttpException(400, 'id must not be empty');

    const language: CodeLanguagesEntity = await CodeLanguagesEntity.findOne({ where: { id: id } });
    if (!language) throw new HttpException(409, 'Challenge with the specified id does not exist');
    language.title = data.title;
    language.compilerId = data.compilerId;

    return language.save();
  }

  public async deleteCodeLanguage(id: string): Promise<CodeLanguage> {
    if (isEmpty(id)) throw new HttpException(400, 'id must not be empty');

    const codeLanguage: CodeLanguage = await CodeLanguagesEntity.findOne({ where: { id: id } });
    if (!codeLanguage) throw new HttpException(409, 'Code language with the specified id does not exist');

    await CodeLanguagesEntity.delete({ id: id }, {});
    return codeLanguage;
  }
}

export default CodeLanguagesService;
