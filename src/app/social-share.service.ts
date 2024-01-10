import { Injectable } from '@angular/core';

interface ISocialData {
  platform: 'FB' | 'WHATSAPP' | 'LINKEDIN' | 'TWITTER' | 'COPY' | 'COPY-LINK';
  url: string
  title: string
  description?: string
}

@Injectable({
  providedIn: 'root'
})
export class SocialShareService {
  yourShareURL = '';
  yourShareTitle = '';
  yourShareDescription = '';
  constructor() { }

  share(type: ISocialData) {
    this.yourShareURL = type.url;
    this.yourShareTitle = type.title;
    this.yourShareDescription = type.description;
    switch (type.platform) {
      case 'FB':
        this.shareOnFacebook();
        break;
      case 'LINKEDIN':
        this.shareOnLinkedIn();
        break;
      case 'TWITTER':
        this.shareOnTwitter();
        break;
      case 'WHATSAPP':
        this.shareOnWhatsApp();
        break;
      case 'COPY':
        this.copy(type.description + '\n  ' + type.url);
        break;
      case 'COPY-LINK':
        this.copy(type.url);
        break;
      default:
        break;
    }
  }

  private shareOnFacebook() {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(this.yourShareURL)}`;
    window.open(url, '_blank');
  }

  private shareOnWhatsApp() {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(this.yourShareDescription)}${encodeURIComponent(this.yourShareURL)}`;
    window.open(url, '_blank');
  }

  private shareOnLinkedIn() {
    const url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
      this.yourShareURL
    )}&title=${encodeURIComponent(this.yourShareTitle)}&summary=${encodeURIComponent(
      this.yourShareDescription
    )}`;
    window.open(url, '_blank');
  }

  private shareOnTwitter() {
    const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      this.yourShareURL
    )}&text=${encodeURIComponent(this.yourShareTitle)}`;
    window.open(url, '_blank');
  }

  private copy(content) {
    const dummyInput = document.createElement('input');
    dummyInput.value = content;
    document.body.appendChild(dummyInput);
    dummyInput.select();
    document.execCommand('copy');
    document.body.removeChild(dummyInput);
  }

}
