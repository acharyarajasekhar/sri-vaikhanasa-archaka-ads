import { Component, OnInit } from '@angular/core';
import { PostsService } from '../services/posts.service';
import { ModalController } from '@ionic/angular';

@Component({
  templateUrl: './archaka-post-view.component.html',
  styleUrls: ['./archaka-post-view.component.css']
})
export class ArchakaPostViewComponent implements OnInit {

  id: string;
  post$: any;

  constructor(
    private postsService: PostsService,
    private modalController: ModalController
  ) { }

  ngOnInit(): void {
    if (!!this.id) {
      this.post$ = this.postsService.getPostById(this.id);
    }
  }

  cancel() {
    this.modalController.dismiss(null, 'cancel');
  }

  async showOptions(post) {
    await this.postsService.showPostOptions(post);
  }

}
