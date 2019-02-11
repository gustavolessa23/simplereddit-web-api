import { Entity, Column, PrimaryGeneratedColumn, AfterInsert, OneToOne, JoinColumn, ManyToOne, Index, BeforeRemove, BeforeInsert } from "typeorm";
import { User } from "./user";
import { Link } from "./link";
import { getVoteRepository } from "../repositories/vote_repository";

@Entity('votes')
export class Vote {

  private static downvotes: number = 0;
  private static upvotes: number = 0;

  @PrimaryGeneratedColumn()
  public id!: number;

  @ManyToOne((type) => User, user => user.votes, { onDelete: 'CASCADE' })
  public user!: User;

  @ManyToOne((type) => Link, link => link.votes, { onDelete: 'CASCADE' })
  public link!: Link;

  @Column()
  public rate!: boolean;

  @AfterInsert()
  public handleAfterInsert() {
    console.log(`INSERTED VOTE WITH ID: ${this.id}`);
  }

  @BeforeRemove()
  private handleBeforeRemove() {
    if(this.rate == false) Vote.downvotes--;
    if(this.rate == true) Vote.upvotes--;
  }

  @BeforeInsert()
  private handleBeforeInsert() {
    if(this.rate == true) Vote.upvotes++;
    if(this.rate == false) Vote.downvotes++;
  }

  public constructor(user: User, link: Link, rate: boolean){
      this.user = user;
      this.link = link;
      this.rate = rate;
  }

  public getDownvotes(){
    return Vote.downvotes;
  }

  public getUpvotes(){
    return Vote.upvotes;
  }
}