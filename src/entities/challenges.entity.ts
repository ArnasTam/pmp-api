import { CodeProblemsEntity } from '@entities/code_problems.entity';
import { Challenge } from '@interfaces/challange.interface';
import { CodeProblem } from '@interfaces/code_problem.interface';
import { Difficulty } from '@interfaces/course.interface';
import { IsNotEmpty } from 'class-validator';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne } from 'typeorm';

@Entity({ name: 'challenges' })
export class ChallengesEntity extends BaseEntity implements Challenge {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => CodeProblemsEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  codeProblem: CodeProblem;

  @Column({
    type: 'enum',
    enum: Difficulty,
    default: Difficulty.BEGINNER,
  })
  @IsNotEmpty()
  difficulty: Difficulty;

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
