declare module 'emoji-toolkit' {
  /**
   * Convert shortname codes (e.g., :smile:) to native unicode emoji
   * @param str - The string containing shortname codes
   * @returns The string with shortnames converted to unicode emoji
   */
  export const shortnameToUnicode: (str: string) => string;
}
