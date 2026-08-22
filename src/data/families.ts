// Kept in step with the printed card by hand — invitation/card-back-*.html
// carry the same names, houses and numbers.

export interface Family {
  /** the bride's or groom's full name, as it appears on the card */
  name: string;
  /** 'daughter of' / 'son of' */
  relation: string;
  parents: string;
  house: string;
  /** display form; the tel: link is derived from it */
  phone: string;
}

export const BRIDE: Family = {
  name: 'Keerthy Prakash',
  relation: 'daughter of',
  parents: 'Sri. T. K. Prakash & Smt. Hema Prakash',
  house: 'Thompil Puthenpurayil, Manjadi, Thiruvalla',
  phone: '+91 88914 53672',
};

export const GROOM: Family = {
  name: 'Abhijith Sreekumar',
  relation: 'son of',
  parents: 'Sri. Sreekumar V. & Smt. Anitha Kumary',
  house: 'Sreenitha, Thonnalloor, Pandalam',
  phone: '+91 94475 94088',
};

export const FAMILIES: Family[] = [BRIDE, GROOM];
