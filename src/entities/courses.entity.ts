import { CourseCodeLessonsEntity } from '@entities/course_code_lessons.entity';
import { CourseProgressEntity } from '@entities/course_progress.entity';
import { CourseReviewEntity } from '@entities/course_reviews.entity';
import { CourseTagsEntity } from '@entities/course_tags.entity';
import { Course, Difficulty } from '@interfaces/course.interface';
import { CourseCodeLesson } from '@interfaces/course_code_lesson.interface';
import { CourseProgress } from '@interfaces/course_progress';
import { CourseReview } from '@interfaces/course_review';
import { CourseTag } from '@interfaces/course_tag.interface';
import { IsNotEmpty } from 'class-validator';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'courses' })
export class CoursesEntity extends BaseEntity implements Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsNotEmpty()
  title: string;

  @Column()
  @IsNotEmpty()
  descriptionRichText: string;

  @Column({
    type: 'enum',
    enum: Difficulty,
    default: Difficulty.BEGINNER,
  })
  @IsNotEmpty()
  difficulty: Difficulty;

  @Column()
  @IsNotEmpty()
  estimatedTimeOfCompletion: number;

  @ManyToMany(() => CourseTagsEntity)
  @JoinTable({
    name: 'course_to_course_tag_relations',
  })
  tags: CourseTag[];

  @OneToMany(() => CourseCodeLessonsEntity, codeLesson => codeLesson.course)
  @JoinColumn()
  codeLessons: CourseCodeLesson[];

  @OneToMany(() => CourseReviewEntity, comment => comment.course)
  @JoinColumn()
  comments: CourseReview[];

  @OneToMany(() => CourseProgressEntity, progress => progress.course)
  @JoinColumn()
  progresses: CourseProgress[];

  @Column()
  @IsNotEmpty()
  authorId: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
