export const getDefaultSnippetStyle = (contentClassName: string) => `
  body {
    font-family: "Lato", "Helvetica Neue", Helvetica, Arial, sans-serif, sans-serif;
  }

  .${contentClassName} > :first-child {
    margin-top: 0;
  }

  .${contentClassName} > :last-child {
    margin-bottom: 0;
  }
`;
