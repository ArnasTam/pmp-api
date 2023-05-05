import { CoursesEntity } from '@entities/courses.entity';
import { Course } from '@interfaces/course.interface';
import { CourseReview } from '@interfaces/course_review';
import { IsNotEmpty } from 'class-validator';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'course_reviews' })
export class CourseReviewEntity extends BaseEntity implements CourseReview {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CoursesEntity, course => course.comments, { onDelete: 'CASCADE' })
  course: Course;

  @Column()
  @IsNotEmpty()
  content: string;

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
