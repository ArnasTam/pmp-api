import { CodeLanguagesEntity } from '@entities/code_languages.entity';
import { TestCasesEntity } from '@entities/test_cases.entity';
import { CodeLanguage } from '@interfaces/code_language.interface';
import { CodeProblem } from '@interfaces/code_problem.interface';
import { TestCase } from '@interfaces/test_case.interface';
import { IsNotEmpty } from 'class-validator';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany, JoinColumn } from 'typeorm';

@Entity({ name: 'code_problems' })
export class CodeProblemsEntity extends BaseEntity implements CodeProblem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsNotEmpty()
  title: string;

  @Column()
  @IsNotEmpty()
  descriptionRichText: string;

  @Column()
  @IsNotEmpty()
  codeEditorTemplate: string;

  @OneToMany(() => TestCasesEntity, testCase => testCase.codeProblem)
  @JoinColumn()
  testCases: TestCase[];

  @ManyToMany(() => CodeLanguagesEntity, { onDelete: 'CASCADE' })
  @JoinTable({
    name: 'course_code_lesson_to_code_language_relations',
  })
  allowedCodeLanguages: CodeLanguage[];
}
