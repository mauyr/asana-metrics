import { BaseResource } from './base-resource';
import { Story } from './story';

export interface Task {
    id: number,
    gid: string,
    name: string,
    resource_type: string
    assignee: BaseResource,
    assignee_status: string,
    completed: boolean,
    completed_at: Date,
    created_at: Date,
    due_at: Date,
    due_on: Date,
    followers: BaseResource,
    hearted: boolean,
    hearts: BaseResource[]
    liked: boolean
    likes: BaseResource[]
    memberships: [{
        project: BaseResource,
        section: BaseResource
    }],
    modified_at: Date
    notes: string,
    num_hearts: number,
    num_likes: number,
    parent: BaseResource,
    projects: BaseResource[],
    start_on: Date,
    tags: BaseResource[],
    resource_subtype: string,
    workspace: BaseResource,
    stories: Story[]
}