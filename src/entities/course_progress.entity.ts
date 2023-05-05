import { CourseCodeLessonsEntity } from '@entities/course_code_lessons.entity';
import { CoursesEntity } from '@entities/courses.entity';
import { Course } from '@interfaces/course.interface';
import { CourseCodeLesson } from '@interfaces/course_code_lesson.interface';
import { CourseProgress, CourseProgressStatus } from '@interfaces/course_progress';
import { IsNotEmpty } from 'class-validator';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';

@Entity({ name: 'course_progress' })
export class CourseProgressEntity extends BaseEntity implements CourseProgress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => CourseCodeLessonsEntity)
  @JoinTable({
    name: 'completed_course_lessons',
  })
  completedCodeLessons: CourseCodeLesson[];

  @ManyToOne(() => CoursesEntity, { onDelete: 'CASCADE' })
  course: Course;

  @Column({
    type: 'enum',
    enum: CourseProgressStatus,
    default: CourseProgressStatus.IN_PROGRESS,
  })
  @IsNotEmpty()
  status: CourseProgressStatus;

  @Column()
  @IsNotEmpty()
  userId: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
