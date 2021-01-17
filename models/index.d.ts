import {Association, Model, Optional, Sequelize} from "sequelize";

export interface ReportAttribute {
  id: number
  name: string,
  tests: number,
  failures: number,
  errors: number,
  time: number,
}
// Some attributes are optional in `report.build` and `report.create` calls
interface ReportCreationAttributes extends Optional<ReportAttribute, "id"> {}

export class Report extends Model<ReportAttribute, ReportCreationAttributes>
  implements ReportAttribute {

  public id: number;
  public name: string;
  public tests: number;
  public failures: number;
  public errors: number;
  public time: number;
  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly suites?: any[]
  public readonly build?: any
    // Report.hasMany(models.suite);
    // Report.hasOne(models.build);

  public static associations: {
    suites: Association<Report, any>;
  };
}

interface DBModel {
  sequelize: InstanceType<Sequelize>;
  Sequelize: typeof Sequelize;
  report: typeof Report;
  build: any
  suite: any
  testcase: any;
}

declare const db: DBModel;
export default db;
