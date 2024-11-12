import { Inventari } from '../inventari/inventari.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Classroom {
  @PrimaryGeneratedColumn()
  id_classroom: number;

  @Column()
  description: string;

  @OneToMany(() => Inventari, (inventari) => inventari.fk_classroom)
  fk_inventari: Inventari[];
}
