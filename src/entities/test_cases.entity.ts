import { CodeProblemsEntity } from '@entities/code_problems.entity';
import { CodeProblem } from '@interfaces/code_problem.interface';
import { TestCase } from '@interfaces/test_case.interface';
import { IsNotEmpty } from 'class-validator';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity('test_cases')
export class TestCasesEntity extends BaseEntity implements TestCase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsNotEmpty()
  input: string;

  @Column()
  @IsNotEmpty()
  expectedResult: string;

  @ManyToOne(() => CodeProblemsEntity, codeProblem => codeProblem.testCases)
  codeProblem: CodeProblem;
}
