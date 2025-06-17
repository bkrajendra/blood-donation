export class CreateUserDto {
  mobile: string;
  name: string;
  email?: string;
  age: number;
  gender?: string; // Optional, can be set during registration
  bloodGroup: string;
  company: string;
  hasHealthIssues?: boolean;
  healthIssueDetails?: string;
  isEligible?: boolean;
  password?: string; // Optional, can be set during registration
}