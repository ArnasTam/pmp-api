import { CodeProblemsEntity } from '@entities/code_problems.entity';
import { CoursesEntity } from '@entities/courses.entity';
import { CodeProblem } from '@interfaces/code_problem.interface';
import { Course } from '@interfaces/course.interface';
import { CourseCodeLesson } from '@interfaces/course_code_lesson.interface';
import { IsNotEmpty } from 'class-validator';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne, ManyToOne } from 'typeorm';

@Entity({ name: 'course_code_lessons' })
export class CourseCodeLessonsEntity extends BaseEntity implements CourseCodeLesson {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => CodeProblemsEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  codeProblem: CodeProblem;

  @ManyToOne(() => CoursesEntity, course => course.codeLessons, { onDelete: 'CASCADE' })
  course: Course;

  @Column()
  @IsNotEmpty()
  lessonNr: number;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
