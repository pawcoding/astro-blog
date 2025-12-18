interface Window {
  _paq?: {
    push: (data: MatomoData) => void;
  };
}

/**
 * Matomo tracking data types
 */
type MatomoData = MatomoCustomDimensionData | MatomoEventData;

/**
 * Matomo custom dimension data type
 */
type MatomoCustomDimensionData = [
  action: "setCustomDimension",
  dimension: number,
  value: string,
];

/**
 * Matomo event tracking data type
 */
type MatomoEventData = [
  action: "trackEvent",
  category: string,
  action: string,
  name?: string,
  value?: number,
];
