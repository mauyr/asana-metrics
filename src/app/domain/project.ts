import { Sections } from './section';
import { Leadtime } from './leadtime';

export interface Project {
    name: string,
    sections: Sections,
    leadtime?: Leadtime
}