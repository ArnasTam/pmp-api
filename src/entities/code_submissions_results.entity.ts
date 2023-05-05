import { CodeSubmissionsEntity } from '@entities/code_submissions.entity';
import { TestCaseResultsEntity } from '@entities/test_case_results.entity';
import { CodeSubmission } from '@interfaces/code_submission';
import { CodeSubmissionResult, CodeSubmissionResultsStatus } from '@interfaces/code_submission_result';
import { TestCaseResult } from '@interfaces/test_case_result';
import { IsNotEmpty } from 'class-validator';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, OneToMany, JoinColumn } from 'typeorm';

@Entity({ name: 'code_submission_results' })
export class CodeSubmissionResultsEntity extends BaseEntity implements CodeSubmissionResult {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => CodeSubmissionsEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  codeSubmission: CodeSubmission;

  @Column({
    type: 'enum',
    enum: CodeSubmissionResultsStatus,
    default: CodeSubmissionResultsStatus.FAILURE,
  })
  @IsNotEmpty()
  status: CodeSubmissionResultsStatus;

  @OneToMany(() => TestCaseResultsEntity, entity => entity.codeSubmissionResult)
  @JoinColumn()
  testCaseResults: TestCaseResult[];

  @Column()
  @CreateDateColumn()
  createdAt: Date;
}
