// ...existing code...
export interface Job {
	externalId: string;
	title: string;
	company: string;
	location: string;
	contractType: string;
	salaryMin?: number | null;
	salaryMax?: number | null;
	redirectUrl: string;
	_candidated?: boolean;
}
