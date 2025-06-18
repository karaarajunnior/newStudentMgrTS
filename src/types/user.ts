export interface user {
	id: string;
	tel: string;
	firstname: string;
	lastname: string;
	password: string;
	email: string;
	created_at: Date;
	updated_at: Date;
}

export interface StudentData {
	firstname?: string;
	lastname?: string;
	tel?: string;
	email?: string;
	password?: string;
}
