import { Entity, getConnection, Column, PrimaryGeneratedColumn, JoinOptions,  AfterInsert, OneToOne, JoinColumn, OneToMany, ManyToOne, Index, JoinTable } from "typeorm";
import { User } from "./user";
import { Vote } from "./vote";
import { Comment } from "./comment";

@Entity('links')
export class Link {
    @PrimaryGeneratedColumn()
    public id!: number;
    
    @Column()
    public title!: string;

    @Column()
    public url!: string

    @ManyToOne(type => User, user => user.links, {onDelete: "CASCADE"})
    public user!: User;

    @OneToMany(type => Vote, vote => vote.link, {onDelete: "CASCADE"})
    public votes!: Vote[];

    @OneToMany(type => Comment, comment => comment.link, {onDelete: "CASCADE"})
    public comments!: Comment[];

    // @AfterInsert()
    // public handleAfterInsert() {
    //   console.log(`CREATED LINK WITH ID: ${this.id}`);
    // };

    public constructor(title: string, url: string, user: User){
      this.title = title;
      this.url = url;
      this.user = user;
    }
}
