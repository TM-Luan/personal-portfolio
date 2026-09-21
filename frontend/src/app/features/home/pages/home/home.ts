import { Component } from '@angular/core';
import { Intro } from '../../components/intro/intro';
import { Journey } from '../../components/journey/journey';
import { TechStack } from '../../components/tech-stack/tech-stack';
import { FeaturedProjects } from '../../components/featured-projects/featured-projects';
import { Contact } from '../../components/contact/contact';

@Component({
  imports: [Intro, Journey, TechStack, FeaturedProjects, Contact],
  selector: 'app-home',
  styleUrl: './home.scss',
  templateUrl: './home.html',
})
export class Home {}
