export type UsStateCode =
  | 'AL' | 'AK' | 'AZ' | 'AR' | 'CA' | 'CO' | 'CT' | 'DE' | 'FL' | 'GA'
  | 'HI' | 'ID' | 'IL' | 'IN' | 'IA' | 'KS' | 'KY' | 'LA' | 'ME' | 'MD'
  | 'MA' | 'MI' | 'MN' | 'MS' | 'MO' | 'MT' | 'NE' | 'NV' | 'NH' | 'NJ'
  | 'NM' | 'NY' | 'NC' | 'ND' | 'OH' | 'OK' | 'OR' | 'PA' | 'RI' | 'SC'
  | 'SD' | 'TN' | 'TX' | 'UT' | 'VT' | 'VA' | 'WA' | 'WV' | 'WI' | 'WY' | 'DC';

export interface StateFilingInfo {
  code: UsStateCode;
  name: string;
  filingFee: number;
  processingTimeDays: string;
  expeditedAvailable: boolean;
  expeditedFee?: number;
  annualReportFee: number;
  annualReportDue: string;
  publicationRequired: boolean;
  publicationNotes?: string;
  statePortalUrl: string;
  portalName: string;
  corporateTaxRate: string;
  franchiseTaxNotes: string;
  popularForNonResidents: boolean;
}

export interface MemberInfo {
  id: string;
  fullName: string;
  title: string; // 'Managing Member', 'Member', 'Chief Executive Officer', etc.
  ownershipPercentage: number;
  initialContribution: number;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface LLCFormData {
  businessName: string;
  suffix: 'LLC' | 'L.L.C.' | 'Limited Liability Company';
  tagline: string;
  industry: string;
  businessDescription: string;
  naicsCode: string;
  
  formationState: UsStateCode;
  managementType: 'member-managed' | 'manager-managed';
  
  // Registered Agent
  agentType: 'self' | 'commercial';
  agentName: string;
  agentAddress: string;
  agentCity: string;
  agentState: UsStateCode;
  agentZip: string;
  agentEmail: string;

  // Principal Office Address
  officeStreet: string;
  officeCity: string;
  officeState: UsStateCode;
  officeZip: string;

  // Members / Founders
  members: MemberInfo[];

  // Effective Date & Fiscal Year
  effectiveDate: string;
  fiscalYearEndMonth: string;

  // EIN specific
  responsiblePartyName: string;
  responsiblePartySSN_Last4: string;
  responsiblePartyTitle: string;
  hasEmployees: boolean;
  estimatedEmployees12Mo: number;
  primaryActivity: string;
  
  // Legal Disclaimer & Self-Representation Acknowledgment
  legalAcknowledgment?: LegalAcknowledgment;
}

export interface LegalAcknowledgment {
  isSigned: boolean;
  signedName: string;
  signatureDate: string;
  signerCapacity: string;
  agreedNotLawFirm: boolean;
  agreedNoAttorneyClient: boolean;
  agreedSelfRepresentation: boolean;
  agreedStateVerification: boolean;
  verificationHash?: string;
}

export interface GrantItem {
  id: string;
  title: string;
  provider: string;
  level: 'federal' | 'state' | 'city';
  state?: UsStateCode;
  city?: string;
  amountMax: number;
  amountLabel: string;
  category: 'innovation' | 'women' | 'minority' | 'veteran' | 'small-business' | 'clean-tech' | 'community';
  deadline: string;
  status: 'Open' | 'Rolling' | 'Upcoming';
  summary: string;
  eligibility: string[];
  officialUrl: string;
  applicationTips: string;
}

export interface LoanProgram {
  id: string;
  name: string;
  type: 'sba-7a' | 'sba-504' | 'sba-microloan' | 'cdfi' | 'line-of-credit' | 'equipment' | 'zero-interest';
  provider: string;
  maxAmount: number;
  amountRange: string;
  interestRate: string;
  termLength: string;
  minCreditScore: number;
  timeInBusinessMonths: number;
  minRevenueAnnual: number;
  bestFor: string;
  pros: string[];
  cons: string[];
  applicationUrl: string;
}

export interface DigitalToolItem {
  id: string;
  category: 'domain' | 'email' | 'voice' | 'banking';
  title: string;
  provider: string;
  costMonthly: string;
  freeTier: boolean;
  setupTime: string;
  description: string;
  keyFeatures: string[];
  directUrl: string;
  setupGuideSteps: { step: number; title: string; desc: string }[];
}

export interface ComplianceDeadline {
  id: string;
  title: string;
  formName: string;
  stateCode: UsStateCode;
  dueDate: string; // ISO date string or formatted date
  daysRemaining: number;
  statutoryFee: number;
  latePenalty: string;
  frequency: 'Annual' | 'Biennial' | 'Periodic' | 'One-Time' | 'None';
  urgency: 'critical' | 'upcoming' | 'normal';
  portalUrl: string;
  filingRequirements: string[];
  consequences: string;
}

export interface ComplianceNotificationSettings {
  emailEnabled: boolean;
  emailAddress: string;
  pushEnabled: boolean;
  remind60Days: boolean;
  remind30Days: boolean;
  remind7Days: boolean;
  remind1Day: boolean;
  lastTestNotificationSent?: string;
}

export interface FormationStepState {
  nameCheckCompleted: boolean;
  articlesGenerated: boolean;
  registeredAgentSelected: boolean;
  stateFilingReady: boolean;
  operatingAgreementDrafted: boolean;
  ss4Ready: boolean;
  domainSearched: boolean;
  googleVoiceExplored: boolean;
  businessEmailExplored: boolean;
  fundingSearched: boolean;
}
