/** Who acts on an attempt: a signed-in user, or an anonymous browser holding an attempt token. */
export interface AttemptOwner {
  userId?: string;
  anonymousToken?: string;
}
