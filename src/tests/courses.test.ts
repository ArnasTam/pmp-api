import CoursesRoute from '@/routes/courses.route';
import { CreateCourseDto } from '@/dtos/courses/create_course.dto';
import { CoursesEntity } from '@/entities/courses.entity';
import { mockToken } from '@/tests/utils';
import { UpdateCourseDto } from '@/dtos/courses/update_course.dto';
import { mockUserId } from '@/tests/utils';
import { clearDB } from '@/tests/utils';
import request from 'supertest';
import { createConnection, getConnection } from 'typeorm';
import App from '@/app';
import { dbConnection } from '@databases';

describe('Courses', () => {
  let app: App;
  let route: CoursesRoute;
  const createCourseDto: CreateCourseDto = {
    title: 'test',
    descriptionRichText: '{}',
    difficulty: 0,
    estimatedTimeOfCompletion: 0,
    tagIds: [],
    codeLessons: [],
  };

  beforeAll(async () => {
    await createConnection(dbConnection);
    route = new CoursesRoute();
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

  describe('[GET] /courses', () => {
    it('response should have a list of courses', async () => {
      const course1 = await CoursesEntity.create({ ...createCourseDto, authorId: 'testAuthor1' }).save();
      const course2 = await CoursesEntity.create({ ...createCourseDto, authorId: 'testAuthor2' }).save();

      const response = await request(app.getServer()).get(`${route.basePath}`).expect(200);

      expect(response.body.data.map(item => item.id)).toEqual(expect.arrayContaining([course1.id, course2.id]));
    });
  });

  describe('[GET] /courses?authorId=', () => {
    it('response should have a list of courses filter by authorId', async () => {
      const course1 = await CoursesEntity.create({ ...createCourseDto, authorId: 'testAuthor1' }).save();
      const course2 = await CoursesEntity.create({ ...createCourseDto, authorId: 'testAuthor2' }).save();

      const response = await request(app.getServer()).get(`${route.basePath}?authorId=${course1.authorId}`).expect(200);

      expect(response.body.data.map(item => item.id)).toEqual(expect.arrayContaining([course1.id]));
      expect(response.body.data.map(item => item.id)).not.toEqual(expect.arrayContaining([course2.id]));
    });
  });

  describe('[GET] /courses/:id', () => {
    it('response should contain course with specified id', async () => {
      const course1 = await CoursesEntity.create({ ...createCourseDto, authorId: 'testAuthor1' }).save();

      const response = await request(app.getServer()).get(`${route.basePath}/${course1.id}`).expect(200);

      expect(response.body.id).toEqual(course1.id);
    });
  });

  describe('[POST] /courses', () => {
    it('should create new course', async () => {
      await request(app.getServer())
        .post(`${route.basePath}`)
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ ...createCourseDto })
        .expect(201);
    });
  });

  describe('[PUT] /courses', () => {
    it('should update existing course', async () => {
      const course1 = await CoursesEntity.create({ ...createCourseDto, authorId: mockUserId }).save();

      const updateDto: UpdateCourseDto = {
        title: 'updatedTitle',
        descriptionRichText: '{"text": "updatedDescription"}',
        difficulty: 1,
        estimatedTimeOfCompletion: 2,
        tagIds: [],
        codeLessons: [],
      };

      const response = await request(app.getServer())
        .put(`${route.basePath}/${course1.id}`)
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ ...updateDto })
        .expect(201);

      expect(response.body.title).toEqual(updateDto.title);
    });

    it('should return forbidden if user does not own the course', async () => {
      const course1 = await CoursesEntity.create({ ...createCourseDto, authorId: 'otherUser' }).save();

      const updateDto: UpdateCourseDto = {
        title: 'updatedTitle',
        descriptionRichText: '{"text": "updatedDescription"}',
        difficulty: 1,
        estimatedTimeOfCompletion: 2,
        tagIds: [],
        codeLessons: [],
      };

      await request(app.getServer())
        .put(`${route.basePath}/${course1.id}`)
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ ...updateDto })
        .expect(403);
    });
  });

  describe('[DELETE] /courses', () => {
    it('should delete existing course', async () => {
      const course1 = await CoursesEntity.create({ ...createCourseDto, authorId: mockUserId }).save();

      await request(app.getServer())
        .delete(`${route.basePath}/${course1.id}`)
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`)
        .expect(200);
    });

    it('should return forbidden if user does not own the course', async () => {
      const course1 = await CoursesEntity.create({ ...createCourseDto, authorId: 'otherUser' }).save();

      await request(app.getServer())
        .delete(`${route.basePath}/${course1.id}`)
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`)
        .expect(403);
    });
  });
});
