'use strict';

import {IUserDBSchema, userDBModel} from '../models/user.db.model';
import {User, IUser} from '../models/user.model';
import {PasswordValidator} from '../services/validator/password.validator.service';
import {PasswordsNotEqualException} from '../../../core/error/models/password.notequal.exception';
import {PasswordNotComplexException} from '../../../core/error/models/password.notcomplex.exception';
import {UserState} from '../models/userstate.model';
import {UserValidator} from '../services/validator/user.validator.service';

/* tslint:disable */
import chai = require('chai');
import {UserMapper} from '../mapper/user.mapper';
const expect = chai.expect;
/* tslint:enable */

describe('User Tests', () => {

    describe('Mapping Tests', () => {

        let validUserJson: any;
        let userModel: User;
        let dbUser: IUserDBSchema;
        let userMapper: UserMapper;

        beforeEach(() => {
            validUserJson = {
                'firstName': 'testName',
                'lastName': 'testX',
                'email': 'test@test.com'
            };

            userModel = new User('test@test.com',
                'firstname',
                'lastname',
                UserState.DISABLED,
                undefined,
                undefined,
                123);

            dbUser = new userDBModel({
                createdOn: '2013-02-04T10:35:24-08:00',
                email: 'dbtest@test.com',
                firstName: 'dbTest',
                id: '123',
                lastName: 'dbLTest',
                modifiedOn: '2016-02-04T10:35:24-08:00',
                password: '#1233kewrwerRTwewerOP',
                state: 'active'
            });

            userMapper = new UserMapper();
        });

        describe('Json Request Tests', () => {

            it('map to user model', () => {
                let user: IUser = userMapper.fromJSON(validUserJson);
                expect(user).to.be.an.instanceof(User);
                expect(user.firstName).to.be.eq('testName');
                expect(user.lastName).to.be.eq('testX');
                expect(user.email).to.be.eq('test@test.com');
                expect(user.hasOwnProperty('password')).to.be.false;
                expect(user.state).to.be.eq(UserState.PENDING);
            });

            it('map without all relevantData ', () => {
                delete validUserJson.lastName;
                let user: IUser = userMapper.fromJSON(validUserJson);
                expect(user).to.be.an.instanceof(User);
                expect(user.firstName).to.be.eq('testName');
                expect(user.lastName).to.be.undefined;
                expect(user.email).to.be.eq('test@test.com');
                expect(user.state).to.be.eq(UserState.PENDING);
            });

        });

        describe('Model Mapping Tests', () => {
            it('Map Model to DB Model', () => {
                let user = userMapper.toDBmodel(userModel);
                expect(user).to.be.an.instanceof(userDBModel);
                expect(user.firstName).to.be.eq('firstname');
                expect(user.lastName).to.be.eq('lastname');
                expect(user.email).to.be.eq('test@test.com');
                expect(user.state).to.be.eq(UserState.DISABLED);
            });

            it('Map DB Model to Model', () => {
                let user: IUser = userMapper.toUser(dbUser);
                expect(user).to.be.an.instanceof(User);
                expect(user.firstName).to.be.eq('dbTest');
                expect(user.lastName).to.be.eq('dbLTest');
                expect(user.email).to.be.eq('dbtest@test.com');
                expect(user.hasOwnProperty('password')).to.be.false;
                expect(user.state).to.be.eq(UserState.ACTIVE);
            });

        });
    });

    describe('Validation Tests', () => {

        describe('User Validation Tests', () => {
            let validUser: User;
            let invalidUserNoEmail: User;
            let invalidUserNoLastName: User;

            beforeEach(() => {
                validUser = new User('test@test.com',
                    'firstname',
                    'lastname',
                    UserState.ACTIVE,
                    undefined,
                    undefined,
                    123);

                invalidUserNoEmail = new User('test',
                    'firstname',
                    'lastname',
                    UserState.ACTIVE,
                    undefined,
                    undefined,
                    undefined);

                invalidUserNoLastName = new User('test',
                    '',
                    'lastname',
                    UserState.ACTIVE,
                    undefined,
                    undefined,
                    undefined);

            });

            it('validate User success', () => {
                let valErrors = UserValidator.validateUser(validUser);
                expect(valErrors).to.be.length(0);
            });

            it('validate User fail with email', () => {
                let valErrors = UserValidator.validateUser(invalidUserNoEmail);
                expect(valErrors).to.be.length(1);
            });

            it('validate User fail with email + lastname', () => {
                let valErrors = UserValidator.validateUser(invalidUserNoLastName);
                expect(valErrors).to.be.length(2);
            });

        });

        describe('Password Validation Tests', () => {

            let validPassword: string;
            let invalidPassword: string;

            beforeEach(() => {
                validPassword = 'thisShouldBeSecure$?89';
                invalidPassword = 'password';
            });

            it ('valid Pw and confirm are equal', () => {
                expect(PasswordValidator
                        .validatePassword(validPassword, validPassword))
                        .to
                        .be
                        .true;
            });

            it ('valid Pw and confirm are not equal', () => {
                expect(function(){ PasswordValidator.validatePassword(validPassword, invalidPassword); })
                                    .to
                                    .throw(PasswordsNotEqualException);
            });

            it ('invalid Pw and confirm are equal', () => {
                expect(function(){ PasswordValidator.validatePassword(invalidPassword, invalidPassword); })
                                    .to
                                    .throw(PasswordNotComplexException);
            });

            it ('invalid Pw and confirm are not equal', () => {
                expect(function(){ PasswordValidator.validatePassword(invalidPassword, validPassword); })
                                    .to
                                    .throw(PasswordsNotEqualException);
            });

        });
    });
});
