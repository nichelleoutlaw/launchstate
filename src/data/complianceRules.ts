import { UsStateCode, ComplianceDeadline } from '../types';
import { STATES_DATA } from './statesData';

// Reference date for calculations (current app date)
const CURRENT_DATE = new Date('2026-09-25T00:00:00Z');

export function getUpcomingDeadlinesForState(
  stateCode: UsStateCode,
  formationDateStr?: string
): ComplianceDeadline[] {
  const stateInfo = STATES_DATA[stateCode] || STATES_DATA['TX'];
  const deadlines: ComplianceDeadline[] = [];
  const currentYear = CURRENT_DATE.getFullYear(); // 2026

  // Helper to calculate days remaining
  const calculateDays = (targetDate: Date): number => {
    const diffTime = targetDate.getTime() - CURRENT_DATE.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Helper to determine urgency
  const getUrgency = (days: number): 'critical' | 'upcoming' | 'normal' => {
    if (days <= 30) return 'critical';
    if (days <= 90) return 'upcoming';
    return 'normal';
  };

  switch (stateCode) {
    case 'FL': {
      const flDue = new Date(Date.UTC(2027, 4, 1)); // May 1, 2027
      const days = calculateDays(flDue);
      deadlines.push({
        id: 'fl-annual-report',
        title: 'Florida Sunbiz Annual Report',
        formName: 'Online Annual Report Filing',
        stateCode: 'FL',
        dueDate: 'May 1, 2027',
        daysRemaining: days,
        statutoryFee: 138.75,
        latePenalty: '$400 mandatory non-waivable state penalty if postmarked after May 1 at 11:59 PM ET',
        frequency: 'Annual',
        urgency: getUrgency(days),
        portalUrl: 'https://dos.fl.gov/sunbiz/manage-business/efile/annual-report/',
        filingRequirements: [
          'Florida document registration number (from Articles)',
          'Active Registered Agent name and physical Florida street address',
          'Principal office address and mailing address',
          'Names and addresses of current managers or managing members',
        ],
        consequences: 'Mandatory $400 late fee applied automatically on May 2nd; administrative dissolution by the third Friday of September.',
      });
      break;
    }

    case 'DE': {
      const deDue = new Date(Date.UTC(2027, 5, 1)); // June 1, 2027
      const days = calculateDays(deDue);
      deadlines.push({
        id: 'de-alternative-tax',
        title: 'Delaware Annual LLC Franchise Tax',
        formName: 'Annual Alternative Entity Tax',
        stateCode: 'DE',
        dueDate: 'June 1, 2027',
        daysRemaining: days,
        statutoryFee: 300,
        latePenalty: '$200 penalty plus 1.5% interest per month on unpaid balance',
        frequency: 'Annual',
        urgency: getUrgency(days),
        portalUrl: 'https://corp.delaware.gov/paytaxes/',
        filingRequirements: [
          '7-digit Delaware Division of Corporations Business Entity File Number',
          'Credit card or Delaware ACH account',
          'No annual report information document required for LLCs, only the flat tax payment',
        ],
        consequences: 'Loss of good standing certificate; accrual of $200 penalty plus 1.5% monthly compound interest; entity voided after 3 years.',
      });
      break;
    }

    case 'TX': {
      const txDue = new Date(Date.UTC(2027, 4, 15)); // May 15, 2027
      const days = calculateDays(txDue);
      deadlines.push({
        id: 'tx-pir-report',
        title: 'Texas Franchise Tax & Public Information Report (PIR)',
        formName: 'Form 05-102 (Public Information Report) & No Tax Due Information',
        stateCode: 'TX',
        dueDate: 'May 15, 2027',
        daysRemaining: days,
        statutoryFee: 0,
        latePenalty: '$50 flat penalty plus 5% penalty after 30 days and forfeiture of right to transact business',
        frequency: 'Annual',
        urgency: getUrgency(days),
        portalUrl: 'https://comptroller.texas.gov/taxes/franchise/',
        filingRequirements: [
          'Texas 11-digit Taxpayer Number and WebFile Access Code (XT)',
          'Gross receipts under $2.47 million qualify for $0 No Tax Due Report',
          'Names and addresses of all current LLC managers and officers',
        ],
        consequences: 'Forfeiture of corporate privileges in Texas; personal liability for managers for debts incurred during forfeiture period.',
      });
      break;
    }

    case 'CA': {
      // California Form 3522 Annual Tax
      const caTaxDue = new Date(Date.UTC(2027, 3, 15)); // April 15, 2027
      const taxDays = calculateDays(caTaxDue);
      deadlines.push({
        id: 'ca-ftb-800',
        title: 'California Franchise Tax Board Annual Tax',
        formName: 'FTB Form 3522 (LLC Tax Voucher)',
        stateCode: 'CA',
        dueDate: 'April 15, 2027',
        daysRemaining: taxDays,
        statutoryFee: 800,
        latePenalty: '5% per month penalty up to 25%, plus interest and potential FTB suspension',
        frequency: 'Annual',
        urgency: getUrgency(taxDays),
        portalUrl: 'https://www.ftb.ca.gov/file/business/types/limited-liability-company/index.html',
        filingRequirements: [
          'California Secretary of State 12-digit LLC File Number',
          'Payment voucher submitted via Web Pay for Businesses or mail',
          'Note: First year exempt under AB 85; due starting second tax year',
        ],
        consequences: 'FTB suspension of business powers, contract voidability, and strict financial penalties.',
      });

      // California Statement of Information (LLC-12)
      const caStmtDue = new Date(Date.UTC(2026, 11, 31)); // End of year check
      const stmtDays = calculateDays(caStmtDue);
      deadlines.push({
        id: 'ca-sos-stmt',
        title: 'California Biennial Statement of Information',
        formName: 'Form LLC-12 (Statement of Information)',
        stateCode: 'CA',
        dueDate: 'Within 90 days of formation, then every 2 years',
        daysRemaining: Math.max(1, stmtDays),
        statutoryFee: 20,
        latePenalty: '$250 late penalty assessed by FTB upon notice of delinquency',
        frequency: 'Biennial',
        urgency: getUrgency(stmtDays),
        portalUrl: 'https://bizfileonline.sos.ca.gov/',
        filingRequirements: [
          'Current Registered Agent address in California',
          'Chief Executive Officer / Manager contact information',
          'California bizfileOnline account',
        ],
        consequences: '$250 FTB penalty and administrative suspension of entity status with Secretary of State.',
      });
      break;
    }

    case 'NV': {
      const nvDue = new Date(Date.UTC(2026, 9, 31)); // Oct 31, 2026
      const days = calculateDays(nvDue);
      deadlines.push({
        id: 'nv-annual-list',
        title: 'Nevada Annual List & State Business License',
        formName: 'Annual List of Managers/Members & Business License Renewal',
        stateCode: 'NV',
        dueDate: 'Last day of the anniversary month',
        daysRemaining: Math.max(1, days),
        statutoryFee: 350,
        latePenalty: '$75 late fee for Annual List + $100 late fee for Business License = $175 penalty',
        frequency: 'Annual',
        urgency: getUrgency(days),
        portalUrl: 'https://www.nvsilverflume.gov/',
        filingRequirements: [
          'SilverFlume Nevada Business Portal login',
          'Annual List filing fee ($150) + State Business License fee ($200) = $350',
          'Updated list of active managers or managing members',
        ],
        consequences: 'Entity placed in default status; additional $175 penalty; revocation of business license.',
      });
      break;
    }

    case 'WY': {
      const wyDue = new Date(Date.UTC(2026, 10, 1)); // Nov 1, 2026
      const days = calculateDays(wyDue);
      deadlines.push({
        id: 'wy-annual-report',
        title: 'Wyoming Annual Report & License Tax',
        formName: 'Annual Report & License Tax Filing',
        stateCode: 'WY',
        dueDate: 'First day of anniversary month',
        daysRemaining: Math.max(1, days),
        statutoryFee: 60,
        latePenalty: 'Administrative dissolution initiated after 60 days of delinquency',
        frequency: 'Annual',
        urgency: getUrgency(days),
        portalUrl: 'https://wyobiz.wyo.gov/',
        filingRequirements: [
          'Wyoming Entity Filing ID Number',
          'Report of value of all assets located within Wyoming ($60 minimum fee or $0.0002 per dollar of assets)',
          'Active Wyoming Registered Agent verification',
        ],
        consequences: 'Revocation of charter and forfeiture of company name after 60 days.',
      });
      break;
    }

    case 'NY': {
      const nyDue = new Date(Date.UTC(2027, 8, 30)); // 2 years out
      const days = calculateDays(nyDue);
      deadlines.push({
        id: 'ny-biennial',
        title: 'New York Biennial Statement',
        formName: 'DOS-1522 (Biennial Statement)',
        stateCode: 'NY',
        dueDate: 'Every 2 years in calendar month of formation',
        daysRemaining: days,
        statutoryFee: 9,
        latePenalty: 'Past due status flagged on public corporate registry',
        frequency: 'Biennial',
        urgency: getUrgency(days),
        portalUrl: 'https://my.ny.gov/',
        filingRequirements: [
          'DOS ID number',
          'Verification of Registered Agent / Service of Process address',
        ],
        consequences: 'Inability to receive certificate of good standing; public notice of delinquency.',
      });
      break;
    }

    case 'AZ':
    case 'MO':
    case 'NM':
    case 'SC': {
      // These states do not require periodic annual reports for standard LLCs!
      deadlines.push({
        id: `${stateCode.toLowerCase()}-exempt`,
        title: `${stateInfo.name} LLC Annual Maintenance Exemption`,
        formName: 'No Periodic Annual Report Required by Statute',
        stateCode: stateCode,
        dueDate: 'Exempt by State Law ($0 Recurring Fee)',
        daysRemaining: 999,
        statutoryFee: 0,
        latePenalty: 'No annual state fees or report deadlines apply to LLCs in this jurisdiction',
        frequency: 'None',
        urgency: 'normal',
        portalUrl: stateInfo.statePortalUrl,
        filingRequirements: [
          'Maintain an active registered agent with a physical in-state address',
          'File annual federal income tax return with IRS',
          'Report any voluntary address or management changes as they occur',
        ],
        consequences: 'Ensure your registered agent fee is renewed annually to prevent process failure.',
      });
      break;
    }

    default: {
      // Standard annual report state fallback
      const defaultDue = new Date(Date.UTC(2027, 3, 15)); // April 15, 2027
      const days = calculateDays(defaultDue);
      deadlines.push({
        id: `${stateCode.toLowerCase()}-annual-report`,
        title: `${stateInfo.name} Annual Report / Registration`,
        formName: `Annual LLC Maintenance Filing`,
        stateCode: stateCode,
        dueDate: stateInfo.annualReportDue || 'Annually on anniversary date',
        daysRemaining: days > 0 ? days : 120,
        statutoryFee: stateInfo.annualReportFee || 50,
        latePenalty: `Late penalties and interest apply if not filed prior to statutory deadline`,
        frequency: 'Annual',
        urgency: getUrgency(days > 0 ? days : 120),
        portalUrl: stateInfo.statePortalUrl,
        filingRequirements: [
          `Active ${stateInfo.name} business registration number`,
          'Verification of registered agent address and principal office',
          'Payment of statutory filing fee',
        ],
        consequences: 'Loss of legal standing, administrative dissolution, and reinstatement penalties.',
      });
      break;
    }
  }

  // Also include Federal Beneficial Ownership Information (BOI) reporting note / reminder
  deadlines.push({
    id: 'fed-boi-finCEN',
    title: 'FinCEN Beneficial Ownership Information (BOI)',
    formName: 'FinCEN BOIR Form (Corporate Transparency Act)',
    stateCode: stateCode,
    dueDate: 'Within 90 days of formation for new entities',
    daysRemaining: 45,
    statutoryFee: 0,
    latePenalty: 'Up to $591/day civil penalty and potential criminal liability for willful non-compliance',
    frequency: 'One-Time',
    urgency: 'upcoming',
    portalUrl: 'https://boiefiling.fincen.gov/',
    filingRequirements: [
      'Legal entity name and alternate trade names (DBA)',
      'Principal business address',
      'EIN / Taxpayer Identification Number',
      'Photo ID (Passport or Driver\'s License) for each beneficial owner (25%+ equity or substantial control)',
    ],
    consequences: 'Severe federal civil penalties for willful failure to file or provide accurate beneficial owner information.',
  });

  return deadlines;
}
