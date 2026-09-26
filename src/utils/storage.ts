import { LLCFormData, FormationStepState } from '../types';

export const SAMPLE_PRESET_BUSINESSES: { id: string; label: string; tag: string; data: LLCFormData }[] = [
  {
    id: 'tech-austin',
    label: 'Vanguard Synergy LLC (Austin, TX)',
    tag: 'Tech & Cloud Advisory',
    data: {
      businessName: 'Vanguard Synergy',
      suffix: 'LLC',
      tagline: 'Empowering tomorrow\'s innovative enterprises',
      industry: 'Technology & Consulting Services',
      businessDescription: 'Providing software engineering, cloud computing consulting, and digital advisory solutions to enterprise clients.',
      naicsCode: '541512 - Computer Systems Design Services',
      formationState: 'TX',
      managementType: 'member-managed',
      agentType: 'self',
      agentName: 'Alexander Vance',
      agentAddress: '701 Brazos Street, Suite 500',
      agentCity: 'Austin',
      agentState: 'TX',
      agentZip: '78701',
      agentEmail: 'founder@vanguardsynergy.com',
      officeStreet: '701 Brazos Street, Suite 500',
      officeCity: 'Austin',
      officeState: 'TX',
      officeZip: '78701',
      members: [
        {
          id: 'mem-1',
          fullName: 'Alexander Vance',
          title: 'Managing Member',
          ownershipPercentage: 100,
          initialContribution: 5000,
          streetAddress: '701 Brazos Street, Suite 500',
          city: 'Austin',
          state: 'TX',
          zipCode: '78701',
        },
      ],
      effectiveDate: new Date().toISOString().split('T')[0],
      fiscalYearEndMonth: 'December',
      responsiblePartyName: 'Alexander Vance',
      responsiblePartySSN_Last4: '4821',
      responsiblePartyTitle: 'Managing Member',
      hasEmployees: true,
      estimatedEmployees12Mo: 2,
      primaryActivity: 'Consulting & Software Technology',
      legalAcknowledgment: {
        isSigned: true,
        signedName: 'Alexander Vance',
        signerCapacity: 'Managing Member',
        signatureDate: new Date().toISOString().split('T')[0],
        agreedNotLawFirm: true,
        agreedNoAttorneyClient: true,
        agreedSelfRepresentation: true,
        agreedStateVerification: true,
        verificationHash: 'PRO-SE-78701-4821',
      }
    }
  },
  {
    id: 'design-sf',
    label: 'Apex Creative Studio LLC (San Francisco, CA)',
    tag: 'Digital Agency & AI Media',
    data: {
      businessName: 'Apex Creative Studio',
      suffix: 'LLC',
      tagline: 'Designing immersive digital frontiers & creative assets',
      industry: 'Design & Digital Media',
      businessDescription: 'Bespoke brand identities, UI/UX systems architecture, and generative AI media production for emerging startups.',
      naicsCode: '541430 - Graphic Design Services',
      formationState: 'CA',
      managementType: 'manager-managed',
      agentType: 'commercial',
      agentName: 'California Registered Agent Solutions Inc.',
      agentAddress: '100 Pine Street, Suite 1250',
      agentCity: 'San Francisco',
      agentState: 'CA',
      agentZip: '94111',
      agentEmail: 'service@apexcreativestudio.com',
      officeStreet: '550 Montgomery St, Floor 8',
      officeCity: 'San Francisco',
      officeState: 'CA',
      officeZip: '94111',
      members: [
        {
          id: 'mem-1',
          fullName: 'Elena Rostova',
          title: 'Managing Director & Design Lead',
          ownershipPercentage: 60,
          initialContribution: 12000,
          streetAddress: '550 Montgomery St, Floor 8',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94111',
        },
        {
          id: 'mem-2',
          fullName: 'Marcus Chen',
          title: 'Technical Partner',
          ownershipPercentage: 40,
          initialContribution: 8000,
          streetAddress: '550 Montgomery St, Floor 8',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94111',
        }
      ],
      effectiveDate: new Date().toISOString().split('T')[0],
      fiscalYearEndMonth: 'December',
      responsiblePartyName: 'Elena Rostova',
      responsiblePartySSN_Last4: '7193',
      responsiblePartyTitle: 'Managing Partner',
      hasEmployees: true,
      estimatedEmployees12Mo: 4,
      primaryActivity: 'Creative Direction & Software Engineering',
      legalAcknowledgment: {
        isSigned: true,
        signedName: 'Elena Rostova',
        signerCapacity: 'Managing Partner',
        signatureDate: new Date().toISOString().split('T')[0],
        agreedNotLawFirm: true,
        agreedNoAttorneyClient: true,
        agreedSelfRepresentation: true,
        agreedStateVerification: true,
        verificationHash: 'PRO-SE-94111-7193',
      }
    }
  },
  {
    id: 'bio-delaware',
    label: 'Quantum BioLabs LLC (Wilmington, DE)',
    tag: 'Biotech & Capital Venture',
    data: {
      businessName: 'Quantum BioLabs',
      suffix: 'LLC',
      tagline: 'Accelerating non-invasive molecular diagnostics',
      industry: 'Biotechnology & Health Tech',
      businessDescription: 'Conducting early-stage cellular research, medical diagnostics software development, and SBIR federal grant applications.',
      naicsCode: '541714 - R&D in Biotechnology',
      formationState: 'DE',
      managementType: 'manager-managed',
      agentType: 'commercial',
      agentName: 'The Corporation Trust Company',
      agentAddress: '1209 North Orange Street',
      agentCity: 'Wilmington',
      agentState: 'DE',
      agentZip: '19801',
      agentEmail: 'contact@quantumbiolabs.io',
      officeStreet: '1209 North Orange Street',
      officeCity: 'Wilmington',
      officeState: 'DE',
      officeZip: '19801',
      members: [
        {
          id: 'mem-1',
          fullName: 'Dr. Sophia Williams',
          title: 'Chief Scientific Officer & Member',
          ownershipPercentage: 70,
          initialContribution: 25000,
          streetAddress: '1209 North Orange Street',
          city: 'Wilmington',
          state: 'DE',
          zipCode: '19801',
        },
        {
          id: 'mem-2',
          fullName: 'David K. Miller',
          title: 'Operations Member',
          ownershipPercentage: 30,
          initialContribution: 10000,
          streetAddress: '1209 North Orange Street',
          city: 'Wilmington',
          state: 'DE',
          zipCode: '19801',
        }
      ],
      effectiveDate: new Date().toISOString().split('T')[0],
      fiscalYearEndMonth: 'December',
      responsiblePartyName: 'Dr. Sophia Williams',
      responsiblePartySSN_Last4: '3182',
      responsiblePartyTitle: 'Managing Member',
      hasEmployees: true,
      estimatedEmployees12Mo: 5,
      primaryActivity: 'Biomedical Research and Diagnostic Software',
      legalAcknowledgment: {
        isSigned: true,
        signedName: 'Dr. Sophia Williams',
        signerCapacity: 'Managing Member',
        signatureDate: new Date().toISOString().split('T')[0],
        agreedNotLawFirm: true,
        agreedNoAttorneyClient: true,
        agreedSelfRepresentation: true,
        agreedStateVerification: true,
        verificationHash: 'PRO-SE-19801-3182',
      }
    }
  }
];

export const DEFAULT_LLC_DATA: LLCFormData = SAMPLE_PRESET_BUSINESSES[0].data;

const STORAGE_KEY = 'launchstate_llc_form_v1';
const STEP_STORAGE_KEY = 'launchstate_step_state_v1';

export function loadSavedLLCData(): LLCFormData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error reading saved LLC data', e);
  }
  return DEFAULT_LLC_DATA;
}

export function saveLLCData(data: LLCFormData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving LLC data', e);
  }
}

export const INITIAL_STEP_STATE: FormationStepState = {
  nameCheckCompleted: true,
  articlesGenerated: true,
  registeredAgentSelected: true,
  stateFilingReady: false,
  operatingAgreementDrafted: true,
  ss4Ready: true,
  domainSearched: false,
  googleVoiceExplored: false,
  businessEmailExplored: false,
  fundingSearched: false,
};

export function loadSavedStepState(): FormationStepState {
  try {
    const raw = localStorage.getItem(STEP_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error reading step state', e);
  }
  return INITIAL_STEP_STATE;
}

export function saveStepState(state: FormationStepState): void {
  try {
    localStorage.setItem(STEP_STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Error saving step state', e);
  }
}
