export{}
declare global {
	interface Array<T>  {
		sum(): number;
		product(): number;
	}
}