import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  BelongsTo,
  ForeignKey,
  Unique,
} from 'sequelize-typescript';
import { User } from './User';
import { Rating } from './Rating';

@Table({ tableName: 'stores', timestamps: true })
export class Store extends Model {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id!: number;

  @Column({
    type: DataType.STRING(60),
    allowNull: false,
    validate: { len: [20, 60] },
  })
  name!: string;

  @Unique
  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: { isEmail: true },
  })
  email!: string;

  @Column({
    type: DataType.STRING(400),
    allowNull: false,
    validate: { len: [0, 400] },
  })
  address!: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: true })
  ownerId!: number | null;

  @BelongsTo(() => User, 'ownerId')
  owner!: User;

  @HasMany(() => Rating)
  ratings!: Rating[];
}
