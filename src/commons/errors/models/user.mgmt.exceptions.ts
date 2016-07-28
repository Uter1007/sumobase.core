import {BaseException} from '../../base/base.exception';

export class AccountNotFoundException extends BaseException {
    constructor(message: string) {
        super(message);
        this.statusCode = 404;
    }
}

export class AuthenticationError extends BaseException {
    constructor(message: string) {
        super(message);
        this.statusCode = 401;
    }
}

export class UserNotFoundException extends BaseException {
    constructor(message: string) {
        super(message);
        this.statusCode = 404;
    }
}

export class AccountNameNotValidException extends BaseException {
    constructor(message: string) {
        super(message);
        this.statusCode = 432;
    }
}

export class AccountParametersException extends BaseException {
    constructor(message: string) {
        super(message);
        this.statusCode = 432;
    }
}

export class AccountAlreadyInUseException extends BaseException {
    constructor(message: string) {
        super(message);
        this.statusCode = 433;
    }
}

export class UserAlreadyInUseException extends BaseException {
    constructor(message: string) {
        super(message);
    }
}

export class PasswordNotComplexException extends BaseException {
    constructor(message: string) {
        super(message);
    }
}

export class RegisterParametersNotValid extends BaseException {
    constructor(message: string) {
        super(message);
    }
}

export class PasswordsNotEqual extends BaseException {
    constructor(message: string) {
        super(message);
    }
}

export class AccountCheckInvalid extends BaseException {
    constructor(message: string) {
        super(message);
    }
}

export class ConfirmationTokenNotValid extends BaseException {
    constructor(message?: string) {
        super(message);
        this.statusCode = 404;
    }
}

export class ConfirmationTokenExpired extends BaseException {
    constructor(message?: string) {
        super(message);
        this.statusCode = 404;
    }
}
