import { CodeLanguagesEntity } from '@entities/code_languages.entity';
import { CodeProblemsEntity } from '@entities/code_problems.entity';
import { CodeLanguage } from '@interfaces/code_language.interface';
import { CodeProblem } from '@interfaces/code_problem.interface';
import { CodeSubmission } from '@interfaces/code_submission';
import { IsNotEmpty } from 'class-validator';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';

@Entity({ name: 'code_submissions' })
export class CodeSubmissionsEntity extends BaseEntity implements CodeSubmission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsNotEmpty()
  code: string;

  @ManyToOne(() => CodeProblemsEntity)
  codeProblem: CodeProblem;

  @ManyToOne(() => CodeLanguagesEntity, { onDelete: 'CASCADE' })
  codeLanguage: CodeLanguage;

  @Column()
  @IsNotEmpty()
  submitterId: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;
}
