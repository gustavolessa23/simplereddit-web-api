import { Entity, Column, PrimaryGeneratedColumn, AfterInsert, OneToOne, JoinColumn, ManyToOne, Index } from "typeorm";
import { User } from "./user";
import { Link } from "./link";

@Entity('comments')
export class Comment {
    @PrimaryGeneratedColumn()
    public id!: number;

    @ManyToOne((type) => User, user => user.comments, {onDelete: "CASCADE"})
    public user!: User;

    @ManyToOne((type) => Link, link => link.comments, {onDelete: "CASCADE"})
    public link!: Link;

    @Column("text")
    public commentBody!: string;

    @AfterInsert()
    public handleAfterInsert() {
      console.log(`INSERTED COMMENT WITH ID: ${this.id}`);
    }

    constructor(owner: User, relatedLink: Link, description: string) {
      this.user = owner;
      this.link = relatedLink;
      this.commentBody = description;
    }

}