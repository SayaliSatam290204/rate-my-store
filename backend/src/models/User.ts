import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  HasOne,
  Unique,
  BeforeCreate,
  BeforeUpdate,
} from 'sequelize-typescript';
import bcrypt from 'bcryptjs';
import { UserRole } from '../types';
import { Rating } from './Rating';
import { Store } from './Store';

@Table({ tableName: 'users', timestamps: true })
export class User extends Model {
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

  @Column({ type: DataType.STRING, allowNull: false })
  password!: string;

  @Column({
    type: DataType.STRING(400),
    allowNull: false,
    validate: { len: [0, 400] },
  })
  address!: string;

  @Column({
    type: DataType.ENUM('admin', 'user', 'store_owner'),
    defaultValue: 'user',
  })
  role!: UserRole;

  @HasMany(() => Rating)
  ratings!: Rating[];

  @HasOne(() => Store, 'ownerId')
  store!: Store;

  @BeforeCreate
  @BeforeUpdate
  static async hashPassword(instance: User): Promise<void> {
    if (instance.changed('password')) {
      instance.password = await bcrypt.hash(instance.password, 10);
    }
  }

  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
}
