/** Rivers State LGA, ward and polling unit hierarchy derived from NG2027's INEC geography source. Voter-register counts are not present in that source. */
import source from './rivers-geography.json';

export type LgaKey = string;
export type Lga = {
  key: LgaKey; name: string; code: string; hq: string; senatorialDistrict: string;
  federalConstituency: string; pus: number; registered: number;
  registeredProv: string; pusProv: string; wards: number;
};
export const LGAS: Record<LgaKey, Lga> = Object.fromEntries(source.lgas.map((lga) => [lga.key, lga])) as Record<LgaKey, Lga>;
export const LGA_LIST: Lga[] = source.lgas;
export type LeadKey = 'general';
export type Ward = {
  id: string; slug: string; name: string; inecName: string; lga: LgaKey; lgaName: string;
  senatorialDistrict: string; federalConstituency: string; code: string; pu2021: number; pus: number;
  registered: number; weight: number; lead: LeadKey; leadIssue: string; idx: number;
  pollingUnits: Array<{ code: string; name: string }>;
};
export const WARDS: Ward[] = source.wards.map((ward, index) => ({
  ...ward, lead: 'general' as const, pu2021: ward.pus, weight: 1, idx: index,
}));
export const WARD_BY_SLUG: Record<string, Ward> = Object.fromEntries(WARDS.map((ward) => [ward.slug, ward]));
export const TOTAL_PUS = LGA_LIST.reduce((sum, lga) => sum + lga.pus, 0);
export const TOTAL_REGISTERED = 0;
export function wardsOf(lga: LgaKey): Ward[] { return WARDS.filter((ward) => ward.lga === lga); }
export type PU = { id: string; slug: string; ward: Ward; n: number; registered: number; order: number; name: string };
export const PUS: PU[] = WARDS.flatMap((ward) => ward.pollingUnits.map((pu, index) => ({
  id: ward.id + '-' + pu.code, slug: ward.slug + '-' + pu.code, ward, n: index + 1,
  registered: 0, order: (index + 1) / (ward.pus + 1), name: pu.name,
})));
export const PU_BY_SLUG: Record<string, PU> = Object.fromEntries(PUS.map((pu) => [pu.slug, pu]));
export function pusOf(ward: Ward): PU[] { return PUS.filter((pu) => pu.ward.slug === ward.slug); }
export const CORRIDOR_NOTE = 'Rivers State ward and polling unit names are from the INEC-derived geography source.';
