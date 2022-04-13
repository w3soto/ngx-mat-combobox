import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';


export interface User {
  id: number,
  name: string,
  image?: string
}

const USERS: User[] = [
  {id: 13, name: "Annie Lennox", image: "https://i1.sndcdn.com/artworks-8xGhRvr1FRzSASZ6-eCjEnA-t500x500.jpg"},
  {id: 16, name: "Billy Corgan", image: "https://i1.sndcdn.com/artworks-8xGhRvr1FRzSASZ6-eCjEnA-t500x500.jpg"},
  {id: 8, name: "Bill Murray", image: "https://i1.sndcdn.com/artworks-8xGhRvr1FRzSASZ6-eCjEnA-t500x500.jpg"},
  {id: 6, name: "Bono Vox", image: "https://i1.sndcdn.com/artworks-8xGhRvr1FRzSASZ6-eCjEnA-t500x500.jpg"},
  {id: 12, name: "Dave Gahan", image: "https://i1.sndcdn.com/artworks-8xGhRvr1FRzSASZ6-eCjEnA-t500x500.jpg"},
  {id: 14, name: "James Hetfield", image: "https://i1.sndcdn.com/artworks-8xGhRvr1FRzSASZ6-eCjEnA-t500x500.jpg"},
  {id: 10, name: "Jimmy Hendrix", image: "https://i1.sndcdn.com/artworks-8xGhRvr1FRzSASZ6-eCjEnA-t500x500.jpg"},
  {id: 7, name: "Jimmy Page", image: "https://i1.sndcdn.com/artworks-8xGhRvr1FRzSASZ6-eCjEnA-t500x500.jpg"},
  {id: 9, name: "John Lennon", image: "https://i1.sndcdn.com/artworks-8xGhRvr1FRzSASZ6-eCjEnA-t500x500.jpg"},
  {id: 1, name: "John Travolta", image: "https://i1.sndcdn.com/artworks-8xGhRvr1FRzSASZ6-eCjEnA-t500x500.jpg"},
  {id: 20, name: "Keith Richards", image: "https://i1.sndcdn.com/artworks-8xGhRvr1FRzSASZ6-eCjEnA-t500x500.jpg"},
  {id: 4, name: "Martin Luther", image: "https://i1.sndcdn.com/artworks-8xGhRvr1FRzSASZ6-eCjEnA-t500x500.jpg"},
  {id: 5, name: "Michael Jackson", image: "https://i1.sndcdn.com/artworks-8xGhRvr1FRzSASZ6-eCjEnA-t500x500.jpg"},
  {id: 19, name: "Mick Jagger", image: "https://i1.sndcdn.com/artworks-8xGhRvr1FRzSASZ6-eCjEnA-t500x500.jpg"},
  {id: 15, name: "Patti Smith", image: "https://i1.sndcdn.com/artworks-8xGhRvr1FRzSASZ6-eCjEnA-t500x500.jpg"},
  {id: 2, name: "Peter Gabriel", image: "https://i1.sndcdn.com/artworks-8xGhRvr1FRzSASZ6-eCjEnA-t500x500.jpg"},
  {id: 3, name: "Peter Jackson", image: "https://i1.sndcdn.com/artworks-8xGhRvr1FRzSASZ6-eCjEnA-t500x500.jpg"},
  {id: 11, name: "Robert Plant", image: "https://i1.sndcdn.com/artworks-8xGhRvr1FRzSASZ6-eCjEnA-t500x500.jpg"},
  {id: 18, name: "Sinead O'Connor", image: "https://i1.sndcdn.com/artworks-8xGhRvr1FRzSASZ6-eCjEnA-t500x500.jpg"},
  {id: 17, name: "Stuart Staples", image: "https://i1.sndcdn.com/artworks-8xGhRvr1FRzSASZ6-eCjEnA-t500x500.jpg"},
];


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild('content', {static: true})
  content!: ElementRef;

  constructor() {
  }

  ngOnInit(): void {
  }

  scrollTo(e: MouseEvent) {

    const anchor = (e.target as HTMLElement).closest('a')!.getAttribute('href')!;
    //console.log(e.target, anchor);
    window.scrollTo({
      top: (document.querySelector(anchor)! as HTMLElement).offsetTop - 64,
      behavior: 'smooth'
    });
    history.pushState(anchor, '', anchor);

    e.preventDefault();
  }

}
