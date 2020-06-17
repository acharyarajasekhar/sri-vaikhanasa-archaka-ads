import { Component, OnInit } from '@angular/core';
import { PostsService } from '../services/posts.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-my-posts',
  templateUrl: './my-posts.component.html',
  styleUrls: ['./my-posts.component.css']
})
export class MyPostsComponent implements OnInit {

  currentPost: any = null;
  posts: Array<any> = [];

  get sortedPosts() {
    if (!!this.posts && this.posts.length > 0) {
      return _.orderBy(this.posts, ['updatedAt'], ['desc']);
    }
    return [];
  }

  constructor(
    private postsService: PostsService
  ) { }

  ngOnInit(): void {
    this.postsService.myPosts.subscribe(posts => {
      this.posts = posts;
    })
  }

  async addNew() {
    await this.postsService.addNew();
  }

  async showOptions(post) {
    await this.postsService.showPostOptions(post);
  }

}
