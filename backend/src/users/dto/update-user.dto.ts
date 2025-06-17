export class UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
  mobile?: string;
  age?: number;
  gender?: string; // Optional, can be set during registration
  bloodGroup?: string;
  company?: string;
  hasHealthIssues?: boolean;
  healthIssueDetails?: string;
  isEligible?: boolean;
}