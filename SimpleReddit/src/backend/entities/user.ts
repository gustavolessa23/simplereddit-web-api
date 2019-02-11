import { Entity, Column, PrimaryGeneratedColumn, AfterInsert, OneToMany, Index } from "typeorm";
import { Link } from "./link";
import { Comment } from "./comment";
import { Vote } from "./vote";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    public id!: number;

    @Column({unique: true})
    public email!: string;

    @Column({select: false})
    public password!: string;
 
    @OneToMany(type => Comment, comment => comment.user, {
      onDelete: 'CASCADE',
    })
    public comments!: Comment[];
    
    @OneToMany(type => Link, link => link.user, {
      onDelete: 'CASCADE',
    })
    public links!: Link[];
 
    @OneToMany(type => Vote, vote => vote.user, {
      onDelete: 'CASCADE',
    })
    public votes!: Vote[];

    @AfterInsert()
    public handleAfterInsert() {
      console.log(`INSERTED USER WITH ID: ${this.id}`);
    }

    public constructor(email: string, password: string) {
      this.email = email;
      this.password = password;
    }
}
