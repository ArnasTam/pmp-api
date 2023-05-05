import App from '@/app';
import ChallengesRoute from '@routes/challenges.route';
import ChallengeCodeSubmissionsRoute from '@routes/challenges_code_submissions.route';
import CodeLanguagesRoute from '@routes/code_languages.route';
import CourseCodeSubmissionsRoute from '@routes/course_code_submissions.route';
import CourseProgressRoute from '@routes/course_progress.route';
import CourseReviewsRoutes from '@routes/course_reviews.route';
import CourseTagsRoute from '@routes/course_tags.route';
import CoursesRoute from '@routes/courses.route';
import IndexRoute from '@routes/index.route';
import validateEnv from '@utils/validateEnv';

validateEnv();

new App().init().then(app => {
  const routes = [
    new IndexRoute(),
    new CoursesRoute(),
    new CourseTagsRoute(),
    new CodeLanguagesRoute(),
    new CourseCodeSubmissionsRoute(),
    new CourseProgressRoute(),
    new ChallengesRoute(),
    new ChallengeCodeSubmissionsRoute(),
    new CourseReviewsRoutes(),
  ];
  app.initializeRoutes(routes);
  app.listen();
});
