import { Association, Model, Optional, Sequelize } from 'sequelize';

interface ReportAttribute {
  id: number;
  repository_id: number;
  name: string;
  tests: number;
  failures: number;
  errors: number;
  time: number;
}
// Some attributes are optional in `report.build` and `report.create` calls
type ReportCreationAttributes = Optional<ReportAttribute, 'id'>;

export class Report
  extends Model<ReportAttribute, ReportCreationAttributes>
  implements ReportAttribute {
  public id: number;
  public repository_id: number;
  public name: string;
  public tests: number;
  public failures: number;
  public errors: number;
  public time: number;
  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly suites?: Suite[];
  public readonly build?: Build;
  public static associations: {
    suites: Association<Report, Suite>;
    build: Association<Report, Build>;
  };
}

interface SuiteAttribute {
  id: number;
  report_id: number;
  name: string;
  tests: number;
  failures: number;
  errors: number;
  skipped: number;
  time: number;
  timestamp: Date;
}
type SuiteCreationAttributes = Optional<SuiteAttribute, 'id'>;

export class Suite
  extends Model<SuiteAttribute, SuiteCreationAttributes>
  implements SuiteAttribute {
  id: number;
  report_id: number;
  name: string;
  tests: number;
  failures: number;
  errors: number;
  skipped: number;
  time: number;
  timestamp: Date;
  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly testcases?: TestCase[];
  public static associations: {
    testcases: Association<Suite, TestCase>;
  };
}

interface TestCaseAttribute {
  id: number;
  suite_id: number;
  classname: string;
  name: string;
  failure: string | null;
  skipped: string | null;
  time: number;
}
type TestCaseCreationAttributes = Optional<TestCaseAttribute, 'id'>;

export class TestCase
  extends Model<TestCaseAttribute, TestCaseCreationAttributes>
  implements TestCaseAttribute {
  classname: string;
  failure: string | null;
  id: number;
  name: string;
  skipped: string | null;
  suite_id: number;
  time: number;
  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

interface BuildAttribute {
  id: number;
  report_id: number;
  repository_url: string;
  branch: string;
  commit_hash: string;
  tag: string;
  pull_request_url: string;
  build_url: string;
}
type BuildCreationAttributes = Optional<BuildAttribute, 'id'>;

export class Build
  extends Model<BuildAttribute, BuildCreationAttributes>
  implements BuildAttribute {
  branch: string;
  build_url: string;
  commit_hash: string;
  id: number;
  pull_request_url: string;
  report_id: number;
  repository_url: string;
  tag: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

interface IntegrationAttribute {
  key: string;
  token: string;
}

export class Integration
  extends Model<IntegrationAttribute, any>
  implements IntegrationAttribute {
  repository_id: number;
  token: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

interface DBModel {
  sequelize: InstanceType<Sequelize>;
  Sequelize: typeof Sequelize;
  report: typeof Report;
  suite: typeof Suite;
  testcase: typeof TestCase;
  build: typeof Build;
  integration: typeof Integration;
}

declare const db: DBModel;
export default db;
