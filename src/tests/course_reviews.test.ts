import { CoursesEntity } from '@/entities/courses.entity';
import { mockToken } from '@/tests/utils';
import { clearDB } from '@/tests/utils';
import CourseReviewsRoutes from '@/routes/course_reviews.route';
import { CreateCourseDto } from '@/dtos/courses/create_course.dto';
import { CourseReviewEntity } from '@/entities/course_reviews.entity';
import request from 'supertest';
import { createConnection, getConnection } from 'typeorm';
import App from '@/app';
import { dbConnection } from '@databases';

describe('Course Reviews', () => {
  let app: App;
  let route: CourseReviewsRoutes;
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
    route = new CourseReviewsRoutes();
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

  describe('[GET] /course-reviews', () => {
    it('response should have a list of course reviews', async () => {
      const course = await CoursesEntity.create({ ...createCourseDto, authorId: 'testAuthor1' }).save();
      const courseReview = await CourseReviewEntity.create({ content: 'test', course: course, authorId: 'testAuthor1' }).save();

      const response = await request(app.getServer()).get(`${route.basePath}?courseId=${course.id}`).expect(200);

      expect(response.body.data.map(item => item.id)).toEqual(expect.arrayContaining([courseReview.id]));
    });
  });

  describe('[POST] /course-reviews', () => {
    it('should create new course review', async () => {
      await request(app.getServer())
        .post(`${route.basePath}`)
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ ...createCourseDto })
        .expect(201);
    });
  });

  // describe('[PUT] /courses', () => {
  //   it('should update existing course', async () => {
  //     const course1 = await CoursesEntity.create({ ...createCourseDto, authorId: mockUserId }).save();
  //
  //     const updateDto: UpdateCourseDto = {
  //       title: 'updatedTitle',
  //       descriptionRichText: '{"text": "updatedDescription"}',
  //       difficulty: 1,
  //       estimatedTimeOfCompletion: 2,
  //       tagIds: [],
  //       codeLessons: [],
  //     };
  //
  //     const response = await request(app.getServer())
  //       .put(`${route.basePath}/${course1.id}`)
  //       .set('Content-type', 'application/json')
  //       .set('Authorization', `Bearer ${mockToken}`)
  //       .send({ ...updateDto })
  //       .expect(201);
  //
  //     expect(response.body.title).toEqual(updateDto.title);
  //   });
  //
  //   it('should return forbidden if user does not own the course', async () => {
  //     const course1 = await CoursesEntity.create({ ...createCourseDto, authorId: 'otherUser' }).save();
  //
  //     const updateDto: UpdateCourseDto = {
  //       title: 'updatedTitle',
  //       descriptionRichText: '{"text": "updatedDescription"}',
  //       difficulty: 1,
  //       estimatedTimeOfCompletion: 2,
  //       tagIds: [],
  //       codeLessons: [],
  //     };
  //
  //     await request(app.getServer())
  //       .put(`${route.basePath}/${course1.id}`)
  //       .set('Content-type', 'application/json')
  //       .set('Authorization', `Bearer ${mockToken}`)
  //       .send({ ...updateDto })
  //       .expect(403);
  //   });
  // });
  //
  // describe('[DELETE] /courses', () => {
  //   it('should delete existing course', async () => {
  //     const course1 = await CoursesEntity.create({ ...createCourseDto, authorId: mockUserId }).save();
  //
  //     await request(app.getServer())
  //       .delete(`${route.basePath}/${course1.id}`)
  //       .set('Content-type', 'application/json')
  //       .set('Authorization', `Bearer ${mockToken}`)
  //       .expect(200);
  //   });
  //
  //   it('should return forbidden if user does not own the course', async () => {
  //     const course1 = await CoursesEntity.create({ ...createCourseDto, authorId: 'otherUser' }).save();
  //
  //     await request(app.getServer())
  //       .delete(`${route.basePath}/${course1.id}`)
  //       .set('Content-type', 'application/json')
  //       .set('Authorization', `Bearer ${mockToken}`)
  //       .expect(403);
  //   });
  // });
});
