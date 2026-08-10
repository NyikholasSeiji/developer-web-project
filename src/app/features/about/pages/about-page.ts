import { Component } from '@angular/core';
import { AboutHeroComponent } from '../components/about-hero/about-hero';
import { AboutStoryComponent } from '../components/about-story/about-story';
import { AboutValuesComponent } from '../components/about-values/about-values';
import { CtaSectionComponent } from '../../../shared/components/cta-section/cta-section';

@Component({
  selector: 'app-about-page',
  imports: [AboutHeroComponent, AboutStoryComponent, AboutValuesComponent, CtaSectionComponent],
  templateUrl: './about-page.html',
})
export class AboutPage {}
