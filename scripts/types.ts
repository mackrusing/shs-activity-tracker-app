export type GradeLvl = 9 | 10 | 11 | 12;

export interface JsonStudent {
    id: number;
    first_name: string;
    last_name: string;
    grade_lvl: GradeLvl;
    completed_events: number[];
}

export interface JsonEvent {
    id: number;
    name: string;
    points: number;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}
