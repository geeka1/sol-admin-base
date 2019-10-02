export class Usuario {
    // Es importante el orden a la hora de crear el usuario
    // voy a tener q seguir esta estructura
    constructor(
        public nombre: string,
        public email: string,
        public password: string,
        public img?: string,
        public role?: string,
        public google?: boolean,
        public _id?: string
    ) { }

}
