// Define the type for Field
export interface Field {
	name: string;
	label: string;
	type: string;
	placeholder: string;
	options?: Array<{ label: string; value: string }>;
	fullWidth?: boolean;
	isRequired?:boolean;

  }
  

  