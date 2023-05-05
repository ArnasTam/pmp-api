import { mockToken } from '@/tests/utils';
import { clearDB } from '@/tests/utils';
import { CreateChallengeDto } from '@/dtos/challanges/create_challange.dto';
import ChallengesRoute from '@/routes/challenges.route';
import { ChallengesEntity } from '@/entities/challenges.entity';
import { CodeLanguagesEntity } from '@/entities/code_languages.entity';
import { UpdateChallengeDto } from '@/dtos/challanges/update_challenge.dto';
import { mockUserId } from '@/tests/utils';
import { CodeProblemsEntity } from '@/entities/code_problems.entity';
import request from 'supertest';
import { createConnection, getConnection } from 'typeorm';
import App from '@/app';
import { dbConnection } from '@databases';

describe('Challenges', () => {
  let app: App;
  let route: ChallengesRoute;
  const createChallengeDto: CreateChallengeDto = {
    title: 'testTitle',
    descriptionRichText: '{}',
    codeEditorTemplate: 'testCodeEditorTemplate',
    allowedCodeLanguageIds: [],
    testCases: [],
    difficulty: 0,
  };

  beforeAll(async () => {
    await createConnection(dbConnection);
    route = new ChallengesRoute();
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

  describe('[GET] /challenges', () => {
    it('response should have a list of challenges', async () => {
      const challenge1 = await ChallengesEntity.create({ ...createChallengeDto, authorId: 'testAuthor1' }).save();
      const challenge2 = await ChallengesEntity.create({ ...createChallengeDto, authorId: 'testAuthor2' }).save();

      const response = await request(app.getServer()).get(`${route.basePath}`).expect(200);

      expect(response.body.data.map(item => item.id)).toEqual(expect.arrayContaining([challenge1.id, challenge2.id]));
    });
  });

  describe('[GET] /challenges?authorId=', () => {
    it('response should have a list of challenges filtered by authorId', async () => {
      const challenge1 = await ChallengesEntity.create({ ...createChallengeDto, authorId: 'testAuthor1' }).save();
      const challenge2 = await ChallengesEntity.create({ ...createChallengeDto, authorId: 'testAuthor2' }).save();

      const response = await request(app.getServer()).get(`${route.basePath}?authorId=${challenge1.authorId}`).expect(200);

      expect(response.body.data.map(item => item.id)).toEqual(expect.arrayContaining([challenge1.id]));
      expect(response.body.data.map(item => item.id)).not.toEqual(expect.arrayContaining([challenge2.id]));
    });
  });

  describe('[GET] /challenges/:id', () => {
    it('response should contain challenge with specified id', async () => {
      const challenge1 = await ChallengesEntity.create({ ...createChallengeDto, authorId: 'testAuthor1' }).save();

      const response = await request(app.getServer()).get(`${route.basePath}/${challenge1.id}`).expect(200);

      expect(response.body.id).toEqual(challenge1.id);
    });
  });

  describe('[POST] /challenges', () => {
    it('should create new challenge', async () => {
      const codeLanguage = await CodeLanguagesEntity.create({ title: 'test', compilerId: 1 }).save();
      await request(app.getServer())
        .post(`${route.basePath}`)
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ ...createChallengeDto, allowedCodeLanguageIds: [codeLanguage.id] })
        .expect(201);
    });
  });

  describe('[PUT] /challenges', () => {
    it('should update existing challenge', async () => {
      const codeLanguage = await CodeLanguagesEntity.create({ title: 'test', compilerId: 1 }).save();
      const codeProblem = await CodeProblemsEntity.create({ ...createChallengeDto }).save();
      const challenge = await ChallengesEntity.create({
        ...createChallengeDto,
        authorId: mockUserId,
        codeProblem: codeProblem,
      }).save();

      const updateDto: UpdateChallengeDto = {
        title: 'updatedTitle',
        descriptionRichText: '{}',
        codeEditorTemplate: 'testCodeEditorTemplate',
        allowedCodeLanguageIds: [codeLanguage.id],
        testCases: [],
        difficulty: 0,
      };

      await request(app.getServer())
        .put(`${route.basePath}/${challenge.id}`)
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ ...updateDto })
        .expect(201);
    });

    it('should return forbidden if user does not own the challenge', async () => {
      const codeLanguage = await CodeLanguagesEntity.create({ title: 'test', compilerId: 1 }).save();
      const codeProblem = await CodeProblemsEntity.create({ ...createChallengeDto }).save();
      const challenge = await ChallengesEntity.create({
        ...createChallengeDto,
        authorId: 'otherAuthorId',
        codeProblem: codeProblem,
      }).save();

      const updateDto: UpdateChallengeDto = {
        title: 'updatedTitle',
        descriptionRichText: '{}',
        codeEditorTemplate: 'testCodeEditorTemplate',
        allowedCodeLanguageIds: [codeLanguage.id],
        testCases: [],
        difficulty: 0,
      };

      await request(app.getServer())
        .put(`${route.basePath}/${challenge.id}`)
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ ...updateDto })
        .expect(403);
    });
  });

  describe('[DELETE] /challenges', () => {
    it('should delete existing challenge', async () => {
      const challenge = await ChallengesEntity.create({
        ...createChallengeDto,
        authorId: mockUserId,
      }).save();

      await request(app.getServer())
        .delete(`${route.basePath}/${challenge.id}`)
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`)
        .expect(200);
    });

    it('should return forbidden if user does not own the challenge', async () => {
      const challenge = await ChallengesEntity.create({
        ...createChallengeDto,
        authorId: 'otherUserId',
      }).save();

      await request(app.getServer())
        .delete(`${route.basePath}/${challenge.id}`)
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`)
        .expect(403);
    });
  });
});
