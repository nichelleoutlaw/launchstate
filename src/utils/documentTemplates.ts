import { LLCFormData, StateFilingInfo } from '../types';
import { STATES_DATA } from '../data/statesData';

export function generateArticlesOfOrganization(data: LLCFormData): string {
  const stateInfo: StateFilingInfo = STATES_DATA[data.formationState] || STATES_DATA['DE'];
  const fullLLCName = `${data.businessName} ${data.suffix}`.trim();
  const dateFormatted = data.effectiveDate || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return `ARTICLES OF ORGANIZATION
OF
${fullLLCName.toUpperCase()}

Pursuant to the applicable provisions of the Limited Liability Company Act of the State of ${stateInfo.name}, the undersigned organizer hereby submits the following Articles of Organization for filing:

ARTICLE I: NAME OF THE COMPANY
The exact legal name of the limited liability company is:
${fullLLCName}

ARTICLE II: REGISTERED OFFICE AND REGISTERED AGENT
The physical address of the initial registered office of the company in the State of ${stateInfo.name} and the name of the initial registered agent at such address is:
Registered Agent: ${data.agentName || 'Self / Designated Agent'}
Registered Address: ${data.agentAddress || data.officeStreet || '100 Main Street'}, ${data.agentCity || data.officeCity || 'Dover'}, ${data.agentState || data.formationState} ${data.agentZip || data.officeZip || '19901'}

ARTICLE III: PRINCIPAL EXECUTIVE OFFICE
The address of the principal office of the limited liability company is:
${data.officeStreet || '100 Main Street'}
${data.officeCity || 'City'}, ${data.officeState || data.formationState} ${data.officeZip || '00000'}

ARTICLE IV: PURPOSE AND POWERS
The purpose of the Company is to engage in ${data.businessDescription || 'any and all lawful business or activities'} for which limited liability companies may be organized under the laws of the State of ${stateInfo.name}. The Company shall possess and may exercise all powers and privileges granted by the Limited Liability Company Act together with any powers incidental thereto.

ARTICLE V: DURATION
The period of duration of this limited liability company is perpetual from the date of filing of these Articles of Organization, unless dissolved earlier in accordance with the Operating Agreement or state law.

ARTICLE VI: MANAGEMENT STRUCTURE
The Limited Liability Company shall be:
${data.managementType === 'manager-managed' ? '[X] MANAGER-MANAGED: The company shall be managed by one or more designated managers.' : '[X] MEMBER-MANAGED: The management of the company is vested in the members in accordance with the Operating Agreement.'}

Initial Members / Managers:
${data.members.map((m, idx) => `  ${idx + 1}. ${m.fullName} - ${m.title} (${m.ownershipPercentage}%) - ${m.city}, ${m.state}`).join('\n')}

ARTICLE VII: LIMITATION OF LIABILITY & INDEMNIFICATION
To the fullest extent permitted by the laws of the State of ${stateInfo.name}, no member or manager of the company shall be personally liable to the company or its members for monetary damages for breach of fiduciary duty as a member or manager. The company is authorized to indemnify its members, managers, and agents to the fullest extent authorized by law.

IN WITNESS WHEREOF, the undersigned Organizer has executed these Articles of Organization on this ${dateFormatted}.

ORGANIZER:
Signature: _________________________________________
Name: ${data.responsiblePartyName || data.members[0]?.fullName || 'Organizer'}
Capacity: Authorized Organizer
Date: ${dateFormatted}
`;
}

export function generateOperatingAgreement(data: LLCFormData): string {
  const stateInfo = STATES_DATA[data.formationState] || STATES_DATA['DE'];
  const fullLLCName = `${data.businessName} ${data.suffix}`.trim();
  const dateFormatted = data.effectiveDate || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const isSingleMember = data.members.length <= 1;

  return `LIMITED LIABILITY COMPANY OPERATING AGREEMENT
FOR
${fullLLCName.toUpperCase()}
A ${stateInfo.name} Limited Liability Company

THIS OPERATING AGREEMENT (the "Agreement") is entered into and effective as of ${dateFormatted}, by and between ${fullLLCName} (the "Company") and the undersigned member(s) (the "Member" or "Members").

SECTION 1: FORMATION & GENERAL PROVISIONS
1.1 Formation. The Company was formed as a limited liability company under and pursuant to the laws of the State of ${stateInfo.name} by filing Articles of Organization with the Secretary of State.
1.2 Name. The name of the Company is ${fullLLCName}.
1.3 Purpose. The nature of the business and of the purposes to be conducted and promoted by the Company is to engage in: ${data.businessDescription || 'any lawful act or activity for which limited liability companies may be formed under the State LLC Act'}.
1.4 Principal Place of Business. The principal place of business of the Company shall be: ${data.officeStreet}, ${data.officeCity}, ${data.officeState} ${data.officeZip}, or at such other locations as may be determined from time to time.
1.5 Registered Agent. The Company's initial registered agent in ${stateInfo.name} is ${data.agentName} at ${data.agentAddress}, ${data.agentCity}, ${data.agentState} ${data.agentZip}.
1.6 Term. The term of the Company shall be perpetual unless dissolved pursuant to Section 8 of this Agreement.

SECTION 2: MEMBERS & CAPITAL CONTRIBUTIONS
2.1 Initial Contributions. The Members have contributed the initial cash and property set forth below to the capital of the Company:
${data.members.map((m, idx) => `   Member ${idx + 1}: ${m.fullName}
   - Title: ${m.title}
   - Initial Capital Contribution: $${m.initialContribution.toLocaleString()}
   - Ownership Units / Percentage: ${m.ownershipPercentage}%\n`).join('')}
2.2 Additional Capital Contributions. No Member shall be required to make any additional capital contributions to the Company unless unanimously agreed in writing by all Members.
2.3 Capital Accounts. An individual capital account shall be maintained for each Member in accordance with Federal Treasury Regulation Section 1.704-1(b)(2)(iv).
2.4 No Interest on Capital. No Member shall be entitled to receive interest on their capital contribution.

SECTION 3: ALLOCATIONS OF PROFITS, LOSSES, AND DISTRIBUTIONS
3.1 Allocation of Net Profits and Losses. Net profits and net losses for each fiscal year shall be allocated to the Members in proportion to their respective Membership Percentages.
3.2 Distributions. Cash available for distribution shall be distributed to the Members at such times and in such amounts as determined by the ${data.managementType === 'manager-managed' ? 'Manager(s)' : 'Members'}, provided that all Company debts and reserves have been reasonably provided for.
3.3 Tax Classification. The Company intends to be treated as a ${isSingleMember ? 'disregarded entity (sole proprietorship)' : 'partnership'} for federal and state income tax purposes, unless the Members unanimously elect corporate tax status (IRS Form 2553 for S-Corporation or Form 8832 for C-Corporation).

SECTION 4: MANAGEMENT & VOTING
4.1 Structure. The Company is ${data.managementType.toUpperCase()}.
${data.managementType === 'member-managed'
  ? '4.2 Member Management. The management of the business and affairs of the Company shall be vested in the Members. Each Member shall have voting power proportional to their Membership Percentage. Routine decisions require a majority vote (>50%). Extraordinary decisions (dissolution, merger, admitting new members) require unanimous consent.'
  : '4.2 Manager Management. The business of the Company shall be managed under the direction of one or more Managers appointed by the Members. The initial Manager(s) shall be designated by a majority vote of the Members.'}
4.3 Authority to Bind Company. ${isSingleMember ? 'The Sole Member has full authority to act on behalf of the Company, execute contracts, and conduct commercial transactions.' : 'Any Managing Member or designated Officer is authorized to sign contracts, issue checks, and enter into obligations on behalf of the Company in the ordinary course of business.'}

SECTION 5: LIMITED LIABILITY & INDEMNIFICATION
5.1 Limited Liability. No Member or Manager shall be liable under any judgment, decree or order of a court, or in any other manner, for any debt, obligation, or liability of the Company solely by reason of being a Member or Manager.
5.2 Indemnification. The Company shall indemnify and hold harmless any Member, Manager, employee, or agent who was or is a party to any proceeding by reason of the fact that they were acting on behalf of the Company in good faith.

SECTION 6: TRANSFERS OF MEMBERSHIP INTERESTS
6.1 Transfer Restrictions. No Member may sell, assign, pledge, or transfer all or any portion of their Membership Interest without the prior written consent of the other Members.
6.2 Right of First Refusal. If any Member desires to transfer their interest, the remaining Members shall have a 30-day right of first refusal to purchase said interest at fair market value.

SECTION 7: BANK ACCOUNTS & FISCAL MATTERS
7.1 Bank Accounts. All funds of the Company shall be deposited in its name in one or more separate bank accounts maintained with federally insured financial institutions. Personal and business funds shall NEVER be commingled.
7.2 Fiscal Year. The fiscal year of the Company shall end on ${data.fiscalYearEndMonth || 'December 31'} of each year.
7.3 Books and Records. The Company shall maintain complete and accurate books and records of account at its principal executive office.

SECTION 8: DISSOLUTION & TERMINATION
8.1 Events of Dissolution. The Company shall be dissolved upon: (a) unanimous written consent of the Members; (b) the sale of substantially all assets of the Company; or (c) an event of judicial dissolution under ${stateInfo.name} law.

SECTION 9: MISCELLANEOUS
9.1 Governing Law. This Agreement shall be construed and governed in accordance with the laws of the State of ${stateInfo.name}.
9.2 Amendments. This Agreement may be amended or modified only by written instrument executed by all Members.

IN WITNESS WHEREOF, the undersigned Member(s) have executed this Operating Agreement as of the date first written above.

MEMBERS:
${data.members.map((m) => `Signature: _________________________________________
Name: ${m.fullName}
Title: ${m.title}
Ownership: ${m.ownershipPercentage}%
Date: ${dateFormatted}\n`).join('\n')}
`;
}

export function generateFormSS4Packet(data: LLCFormData): string {
  const fullLLCName = `${data.businessName} ${data.suffix}`.trim();
  const stateInfo = STATES_DATA[data.formationState] || STATES_DATA['DE'];
  const primaryMember = data.members[0] || { fullName: 'Founder', streetAddress: data.officeStreet, city: data.officeCity, state: data.officeState, zipCode: data.officeZip };

  return `DEPARTMENT OF THE TREASURY - INTERNAL REVENUE SERVICE
APPLICATION FOR EMPLOYER IDENTIFICATION NUMBER (FORM SS-4)
PRE-FILING SUMMARY PACKET & AUDIT WORKSHEET

Use this pre-filled data packet when completing the official free IRS Online EIN application at:
https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online
(IRS Operating Hours: Monday through Friday, 7:00 a.m. to 10:00 p.m. Eastern Time)

========================================================================
LINE-BY-LINE SS-4 DETAILS:
========================================================================
Line 1. Legal Name of Entity: ${fullLLCName}
Line 2. Trade Name / DBA (if applicable): ${data.businessName}
Line 3. Executor, Administrator, Trustee, "Care of" Name: [N/A]
Line 4a-b. Mailing Address: ${data.officeStreet}, ${data.officeCity}, ${data.officeState} ${data.officeZip}
Line 5a-b. Physical Street Address: ${data.officeStreet}, ${data.officeCity}, ${data.officeState} ${data.officeZip}
Line 6. County and State Where Principal Business Located: ${data.officeCity} County / Municipality, State of ${stateInfo.name}

Line 7a. Name of Responsible Party: ${data.responsiblePartyName || primaryMember.fullName}
Line 7b. SSN, ITIN, or EIN of Responsible Party: ***-**-${data.responsiblePartySSN_Last4 || 'XXXX'}
(Note: Entered securely directly on the IRS.gov encrypted website; never transmitted to 3rd parties)

Line 8a. Is this application for a Limited Liability Company (LLC)? [YES]
Line 8b. If 8a is "Yes", enter the number of LLC members: ${data.members.length}
Line 8c. If 8a is "Yes", was the LLC organized in the United States? [YES], State of ${stateInfo.name}

Line 9a. Type of Entity: Limited Liability Company (LLC)
Tax Treatment Default: ${data.members.length === 1 ? 'Disregarded Entity / Single-Member LLC' : 'Partnership / Multi-Member LLC'}

Line 10. Reason for Applying: Started new business (Specify: ${data.industry || 'Commercial enterprise'})
Line 11. Date business started or acquired: ${data.effectiveDate || new Date().toISOString().split('T')[0]}
Line 12. Closing month of accounting year: ${data.fiscalYearEndMonth || 'December'}

Line 13. Highest number of employees expected in the next 12 months:
  Agricultural: 0 | Household: 0 | Other: ${data.estimatedEmployees12Mo || 0}
Line 14. If you expect your employment tax liability to be $1,000 or less in a full calendar year and want to file Form 944 annually instead of Form 941 quarterly, check here: [${(data.estimatedEmployees12Mo || 0) <= 2 ? 'X' : ' '}]

Line 15. First date wages or annuities were paid (if applicable): [Not yet paid]
Line 16. Check one box that best describes the principal activity of your business:
  [X] ${data.industry || 'Other'} (${data.businessDescription || 'Professional Services'})
Line 17. Indicate principal line of merchandise sold, specific construction work done, products produced, or services provided:
  ${data.businessDescription || data.industry}
Line 18. Has the applicant entity shown on line 1 ever applied for and received an EIN? [NO]

========================================================================
APPLICANT SIGNATURE VERIFICATION:
========================================================================
Name of Responsible Party: ${data.responsiblePartyName || primaryMember.fullName}
Title / Capacity: ${data.responsiblePartyTitle || 'Authorized Managing Member'}
Contact Phone Number: ________________________ (or Google Voice Business Line)
Date: ${new Date().toLocaleDateString()}
`;
}

export function generateInitialResolutions(data: LLCFormData): string {
  const fullLLCName = `${data.businessName} ${data.suffix}`.trim();
  const stateInfo = STATES_DATA[data.formationState] || STATES_DATA['DE'];
  const dateFormatted = data.effectiveDate || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return `ACTION BY UNANIMOUS WRITTEN CONSENT
OF THE ORGANIZER AND MEMBERS OF
${fullLLCName.toUpperCase()}

The undersigned, being the initial Organizer and Member(s) of ${fullLLCName}, a limited liability company organized under the laws of the State of ${stateInfo.name}, hereby adopt the following resolutions by unanimous written consent:

1. FILING OF ARTICLES OF ORGANIZATION
RESOLVED, that the Articles of Organization filed with the Secretary of State of ${stateInfo.name} are hereby ratified, approved, and accepted as the foundational corporate charter of the Company.

2. ADOPTION OF OPERATING AGREEMENT
RESOLVED, that the Operating Agreement in the form presented to the Members is hereby approved, adopted, and confirmed as the governing Operating Agreement of the Company.

3. ELECTION OF OFFICERS & MANAGEMENT
RESOLVED, that the following individuals are hereby elected to the offices indicated opposite their respective names, to serve until their successors are chosen:
${data.members.map((m) => `   - ${m.fullName}: ${m.title}`).join('\n')}

4. ESTABLISHMENT OF COMMERCIAL BANK ACCOUNTS
RESOLVED, that the Member(s) and designated Officers of the Company are authorized and directed to open one or more deposit or checking accounts in the name of the Company at such banking institution(s) as they deem appropriate (including Mercury Bank, Relay Financial, Chase, or Bank of America); and
FURTHER RESOLVED, that the signature of any one authorized Member shall be sufficient to bind the Company upon checks, drafts, electronic wires, and commercial instruments.

5. PROCUREMENT OF IRS EIN & LICENSES
RESOLVED, that the responsible officers are authorized to apply for an Employer Identification Number (EIN) from the Internal Revenue Service and procure all requisite municipal and state business licenses.

IN WITNESS WHEREOF, the undersigned have executed this consent effective as of ${dateFormatted}.

${data.members.map((m) => `_________________________________________
${m.fullName}, ${m.title}`).join('\n\n')}
`;
}

export function generateDisclaimerAcknowledgment(data: LLCFormData): string {
  const fullLLCName = `${data.businessName} ${data.suffix}`.trim();
  const stateInfo = STATES_DATA[data.formationState] || STATES_DATA['TX'];
  const ack = data.legalAcknowledgment;
  const isSigned = ack?.isSigned;
  const signerName = ack?.signedName || data.responsiblePartyName || data.members[0]?.fullName || 'Authorized Representative';
  const signDate = ack?.signatureDate || new Date().toLocaleString('en-US', { timeZoneName: 'short' });
  const certId = ack?.verificationHash || `CERT-DISC-${Date.now().toString(36).toUpperCase()}`;

  return `ACKNOWLEDGMENT OF SELF-HELP LEGAL DOCUMENT PREPARATION,
NON-ATTORNEY STATUS, AND PRO SE REPRESENTATION

REGARDING FORMATION OF: ${fullLLCName.toUpperCase()}
JURISDICTION OF ORGANIZATION: STATE OF ${stateInfo.name.toUpperCase()}

========================================================================
MANDATORY STATUTORY NOTICE & LEGAL DISCLAIMER
========================================================================

The undersigned organizer, founder, and/or managing member of ${fullLLCName} (the "Company") hereby executes this formal Acknowledgment and Agreement regarding the use of LaunchState's automated formation software and legal document generation platform:

1. NON-ATTORNEY AND SELF-HELP DISCLOSURE
The undersigned expressly understands and acknowledges that LaunchState and its affiliated operators, platforms, software engineers, and automated intelligence engines ARE NOT A LAW FIRM, are not acting as an attorney or certified public accountant for the user or the Company, and do not provide legal, tax, or investment advice. LaunchState is not permitted under applicable state statutes (including Unauthorized Practice of Law provisions) to engage in the practice of law or represent users before any tribunal, state department, or administrative agency.

2. NO ATTORNEY-CLIENT PRIVILEGE OR RELATIONSHIP
The undersigned confirms that no confidential attorney-client relationship, fiduciary relationship, or formal advisory relationship is formed or intended to be formed by using LaunchState or by generating automated formation documentation. Communications and data entered into the platform are not protected by attorney-client privilege or work-product doctrine.

3. PRO SE (SELF-REPRESENTATION) CONFIRMATION
The undersigned acknowledges that in preparing, modifying, and submitting the Articles of Organization, Operating Agreement, IRS Form SS-4 for an Employer Identification Number (EIN), initial written resolutions, and annual report filings, the user is acting strictly "PRO SE" (representing themselves and their own commercial enterprise).

4. GENERAL STATUTORY INFORMATION & NO GUARANTEE OF SUITABILITY
The undersigned understands that legal forms, operating agreement provisions, statutory tax classifications, and educational guides provided by the software are general automated templates based on prevailing statutory defaults in the State of ${stateInfo.name}. Because every business has unique equity, liability, intellectual property, and multi-state tax considerations, the automated documents may not address every specific contingency. The user has been advised of the right and recommendation to consult an independent attorney licensed in ${stateInfo.name} and a licensed CPA prior to executing binding legal contracts.

5. VERIFICATION OF ACCURACY BEFORE FILING
The undersigned warrants that all factual information provided—including entity names, registered agent appointments, principal executive office addresses, and member capital accounts—has been reviewed for truthfulness and accuracy. The user bears sole responsibility for submitting filings to the ${stateInfo.portalName} and the Internal Revenue Service and paying all statutory filing fees and taxes.

========================================================================
AFFIRMATION & DIGITAL SIGNATURE RECORD
========================================================================

By signing below, the undersigned explicitly certifies under penalty of perjury or false statement that:
  [X] I have read, understood, and agreed to this Non-Attorney Disclaimer.
  [X] I understand that LaunchState provides automated self-help software only.
  [X] I am representing myself (pro se) in establishing ${fullLLCName}.
  [X] I accept full legal responsibility for all filings made using these materials.

STATUS: ${isSigned ? 'VERIFIED & DIGITALLY EXECUTED' : 'PENDING FOUNDER SIGNATURE'}
DIGITAL SIGNATURE: ${isSigned ? signerName : '_________________________________________'}
SIGNER LEGAL NAME: ${signerName}
CAPACITY / TITLE: ${ack?.signerCapacity || 'Authorized Organizer / Managing Member'}
EXECUTION TIMESTAMP: ${signDate}
DOCUMENT VERIFICATION ID: ${certId}
GOVERNING STATE LAW: State of ${stateInfo.name}

========================================================================
A copy of this signed acknowledgment should be retained in the permanent
company records binder alongside the Articles of Organization.
========================================================================
`;
}
