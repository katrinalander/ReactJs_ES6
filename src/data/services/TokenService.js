class TokenService {
    static instance = null;

    static getInstance() {
        return this.instance;
    }

    static setToken(token) {
        if(!this.instance) {
            TokenService.create();
        }

        this.instance.token = token;
    }

    static getToken() {
        if(!this.instance) {
            TokenService.create();
        }

        return this.instance.token;
    }

    static create() {
        if (!this.instance) {
            this.instance = new TokenService();
        }

        return this.instance;
    }

    constructor() {
        this.token = null;
    }
}

export default TokenService;