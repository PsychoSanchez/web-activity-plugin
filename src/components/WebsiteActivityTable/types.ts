type Domain = string;
type Time = number;
export interface ActivityTableProps {
  websiteTimeMap: Record<Domain, Time>;
  title?: string;
  onDomainRowClicked?: (domain: string) => void;
  onFilterButtonClicked?: (domain: string) => void;
  onUndoFilterButtonClicked?: (domain: string) => void;
}
