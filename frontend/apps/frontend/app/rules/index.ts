// Rules for project label.
type MessageMap = Record<string, string>;

export const colorRules = (msg: MessageMap) => {
  return [(v: unknown) => !!v || msg.colorRequired];
};

export const labelNameRules = (msg: MessageMap) => {
  return [
    (v: string | null | undefined) => !!v || msg.labelRequired,
    (v: string | null | undefined) => (v && v.length <= 100) || msg.labelLessThan100Chars,
  ];
};

// Rules for project member.
export const userNameRules = (msg: MessageMap) => {
  return [
    (v: string | null | undefined) => !!v || msg.userNameRequired,
    (v: string | null | undefined) => (v && v.length <= 30) || msg.userNameLessThan30Chars,
  ];
};

export const roleRules = (msg: MessageMap) => {
  return [(v: unknown) => !!v || msg.roleRequired];
};

// Rules for Document.
export const fileFormatRules = (msg: MessageMap) => {
  return [(v: unknown) => !!v || msg.fileFormatRequired];
};

export const uploadFileRules = (msg: MessageMap) => {
  return [
    (v: File[] | null | undefined) => !!v || msg.fileRequired,
    (v: File[] | null | undefined) =>
      !v || v.some((file: File) => file.size < 100000000) || msg.fileLessThan1MB,
  ];
};

export const uploadSingleFileRules = (msg: MessageMap) => {
  return [
    (v: File | null | undefined) => !!v || msg.fileRequired,
    (v: File | null | undefined) => !v || v.size < 1000000 || msg.fileLessThan1MB,
  ];
};

// Rules for user.
export const passwordRules = (msg: MessageMap) => {
  return [
    (v: string | null | undefined) => !!v || msg.passwordRequired,
    (v: string | null | undefined) => (v && v.length <= 30) || msg.passwordLessThan30Chars,
  ];
};

export const templateNameRules = () => {
  return [(v: string | null | undefined) => !!v || "Name is required"];
};
