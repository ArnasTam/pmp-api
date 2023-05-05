import { CodeSubmissionResultsEntity } from '@entities/code_submissions_results.entity';
import { TestCasesEntity } from '@entities/test_cases.entity';
import { CodeSubmissionResult } from '@interfaces/code_submission_result';
import { TestCase } from '@interfaces/test_case.interface';
import { TestCaseResult, TestCaseResultStatus } from '@interfaces/test_case_result';
import { IsNotEmpty } from 'class-validator';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('test_case_results')
export class TestCaseResultsEntity extends BaseEntity implements TestCaseResult {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  error?: string;

  @Column({ nullable: true })
  compileOutput?: string;

  @Column({ nullable: true })
  output?: string;

  @Column({
    type: 'enum',
    enum: TestCaseResultStatus,
    default: TestCaseResultStatus.FAIL,
  })
  @IsNotEmpty()
  status: TestCaseResultStatus;

  @ManyToOne(() => TestCasesEntity)
  @JoinColumn()
  testCase: TestCase;

  @ManyToOne(() => CodeSubmissionResultsEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  codeSubmissionResult: CodeSubmissionResult;
}
