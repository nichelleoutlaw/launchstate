import { LLCFormData, FormationStepState } from '../types';

export const DEFAULT_LLC_DATA: LLCFormData = {
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
};

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
