import { BaseResource } from './base-resource';

export interface Story {
    id: number,
    gid: string,
    created_at: Date,
    created_by: BaseResource,
    resource_subtype: string,
    resource_type: string,
    text: string,
    type: string
}