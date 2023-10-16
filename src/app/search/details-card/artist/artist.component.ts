import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.css']
})
export class ArtistComponent {
  @Input() spotifyData: any;
  @Input() detailsCardData: any;
  artists = []; // 艺术家数组
  musicCount = 0; // 计数器
  value: any;

  incrementMusicCount() {
    this.musicCount++;
    return true;
  }


}
interface Artist {
  name: string;
  // ... 其他属性
}
