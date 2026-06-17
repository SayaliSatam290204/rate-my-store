import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from './User';
import { Store } from './Store';

@Table({
  tableName: 'ratings',
  timestamps: true,
  indexes: [{ unique: true, fields: ['userId', 'storeId'] }],
})
export class Rating extends Model {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 5 },
  })
  value!: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId!: number;

  @BelongsTo(() => User)
  user!: User;

  @ForeignKey(() => Store)
  @Column({ type: DataType.INTEGER, allowNull: false })
  storeId!: number;

  @BelongsTo(() => Store)
  store!: Store;
}
