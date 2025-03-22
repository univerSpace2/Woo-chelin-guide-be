export interface ResponseFormat<T> {
  data: T;
  msg: string;
  meta: Record<string, any>;
}
