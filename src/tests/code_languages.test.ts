import { mockToken } from '@/tests/utils';
import { clearDB } from '@/tests/utils';
import { CreateCodeLanguageDto } from '@/dtos/code_languages/create_code_language.dto';
import { CodeLanguagesEntity } from '@/entities/code_languages.entity';
import CodeLanguagesRoute from '@/routes/code_languages.route';
import request from 'supertest';
import { createConnection, getConnection } from 'typeorm';
import App from '@/app';
import { dbConnection } from '@databases';

describe('Code Languages', () => {
  let app: App;
  let route: CodeLanguagesRoute;
  const createCodeLanguage: CreateCodeLanguageDto = {
    title: 'test',
    compilerId: 0,
  };

  beforeAll(async () => {
    await createConnection(dbConnection);
    route = new CodeLanguagesRoute();
    app = new App();
    app.init().then(app => {
      app.initializeRoutes([route]);
    });
  });

  afterEach(async () => {
    await clearDB();
  });

  afterAll(async () => {
    await getConnection().close();
  });

  describe('[GET] /code-languages', () => {
    it('response should have a list of code languages', async () => {
      const codeLanguage1 = await CodeLanguagesEntity.create({ ...createCodeLanguage }).save();
      const codeLanguage2 = await CodeLanguagesEntity.create({ ...createCodeLanguage }).save();

      const response = await request(app.getServer()).get(`${route.basePath}`).expect(200);

      expect(response.body.data.map(item => item.id)).toEqual(expect.arrayContaining([codeLanguage1.id, codeLanguage2.id]));
    });
  });

  describe('[POST] /code-languages', () => {
    it('should create new code language', async () => {
      await request(app.getServer())
        .post(`${route.basePath}`)
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ ...createCodeLanguage })
        .expect(201);
    });
  });

  describe('[PUT] /code-languages', () => {
    it('should update existing code language', async () => {
      const codeLanguage = await CodeLanguagesEntity.create({ ...createCodeLanguage }).save();

      const updateDto: CreateCodeLanguageDto = {
        title: 'updatedTitle',
        compilerId: 1,
      };

      await request(app.getServer())
        .put(`${route.basePath}/${codeLanguage.id}`)
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ ...updateDto })
        .expect(200);
    });
  });

  describe('[DELETE] /code-languages', () => {
    it('should delete existing code language', async () => {
      const codeLanguage = await CodeLanguagesEntity.create({ ...createCodeLanguage }).save();

      await request(app.getServer())
        .delete(`${route.basePath}/${codeLanguage.id}`)
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`)
        .expect(200);
    });
  });
});
