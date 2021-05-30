export interface ActivityTableProps {
  activity: Record<string, number>;
  title?: string;
  onDomainRowClicked?: (domain: string) => void;
  onFilterButtonClicked?: (domain: string) => void;
  onUndoFilterButtonClicked?: (domain: string) => void;
}
